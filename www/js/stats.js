angular.module('stats.controller', [])

.controller('statsCtrl',function($scope, $http) {

    $scope.getraces = function () {
        $http.get(URL+'user/' + window.localStorage.token +'/races')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };
});