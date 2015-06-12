angular.module('stats.controller', [])

.controller('statsCtrl',function($scope, $http, $window) {
    //var URL='https://10.189.25.180:3030/';
    var URL='https://localhost:3030/';
    $scope.getraces = function () {
        $http.get(URL+'user/' + $window.localStorage['token'] +'/races')
            .success(function (data) {
                $scope.users = data;
                console.log('Data stats:'+data);
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };
});