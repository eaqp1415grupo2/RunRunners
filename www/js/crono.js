angular.module('crono.controller', [])
    .controller('cronoCtrl', function ($scope, $timeout, $http, $window) {

        var URL = 'https://localhost:3030/';
        $scope.counter = 0;
        $scope.timer = 0;
        $scope.seconds = 0;
        $scope.minutes = 0;
        var Tour = [];
        var time = 0;
        var user = {};
        var LocationIni;
        var mytimeout = null; // the current timeoutID
        var race;
        $scope.onTimeout = function () {

            $scope.counter++;
            $scope.seconds = $scope.counter;
            if ($scope.seconds == 30 || $scope.seconds == 60) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var currentposition = position.coords;
                    var Lat = currentposition.latitude;
                    var Long = currentposition.longitude;
                    Tour.push({'Ltd': Lat, 'Lng': Long});
                    console.log(Tour);
                });
            }
            if ($scope.seconds == 60) {
                $scope.seconds = 0;
                $scope.counter = 0;
                $scope.minutes++;
            }
            mytimeout = $timeout($scope.onTimeout, 1000);
        };

        $scope.startTimer = function () {
            var date = new Date();
            var fecha = (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
            var hora = (date.getHours+":"+date.getMinutes()+":"+date.getSeconds());
            $http.get(URL + 'user/' + $window.localStorage['token'])
                .success(function (data) {
                    user = data;
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var currentposition = position.coords;
                        var Lat = currentposition.latitude;
                        var Long = currentposition.longitude;
                        LocationIni = ({'Ltd': Lat, 'Lng': Long});

                        console.log(user);
                        var PostRace = ({
                            Name: 'Race',
                            Level: user.Level,
                            Date: fecha,
                            Hour: hora,
                            LocationIni: LocationIni,
                            Type: 'Entreno',
                            _id: $window.localStorage['token']

                        })
                        $http({
                            method: 'POST',
                            url: URL + 'race',
                            data: PostRace,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function (data) {
                           race = data._id;

                        })
                            .error(function (data) {
                                console.log('Error:' + data);
                            });

                    });
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });

            mytimeout = $timeout($scope.onTimeout, 1000);
        };

        // stops and resets the current timer
        $scope.stopTimer = function () {
            var time = $scope.minutes;
            $timeout.cancel(mytimeout);
            var RaceDone = ({
                raceId: race,
                Time: time,
                Tour: Tour
            })
            $http({
                method: 'PUT',
                url: URL + 'user/race/'+ $window.localStorage['token'],
                data: RaceDone,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);

            })
                .error(function (data) {
                    console.log('Error:' + data);
                });

            console.log(race);
        };

        $scope.$on('timer-stopped', function (event, remaining) {
            if (remaining === 0) {
                console.log('your time ran out!');
            }
        });
    });//No pongais las IP aqui las coge de controllers.js o de appApk.js asi no hay que cambiarlo en ningun .js 

}]);