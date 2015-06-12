angular.module('races.controller', [])

.controller('racesCtrl', function($scope, $http, $stateParams, $ionicLoading, $log) {
    //var URL='https://10.189.25.180:3030/';
    var URL='https://localhost:3030/';
    $scope.ownraces = [];
    $scope.otherraces = [];

    $scope.loadRaces=function () {
        //Obtener carreras propias
        $http.get(URL+'race/user/'+window.localStorage.token).success(function(data) {
            $scope.ownraces = data;
            console.log('own Races:'+$scope.ownraces);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

        //Obtener otras carreras
        $http.get(URL+'race/no/'+window.localStorage.token).success(function(data) {
            $scope.otherraces = data;
            console.log('other Races:'+$scope.otherraces);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.addUser = function (race) {
        $http({
            method: 'POST',
            url: URL+'race/'+race+'/user',
            data: {_id:window.localStorage.token},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadRaces();
            console.log(data);

        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    };

    $scope.deleteUser = function (race) {
        $http({
            method: 'DELETE',
            url: URL+'race/'+race+'/user',
            data: {_id:window.localStorage.token},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadRaces();
            console.log(data);

        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    };

});