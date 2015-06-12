angular.module('groups.controller', [])

.controller('GroupsCtrl', function ($scope,$http, $ionicLoading, $log, GroupMessageService) {
    $scope.owngroups = [];
    $scope.othergroups = [];

    $scope.loadGroups=function () {

        //Obtener Grupos propios
        $http.get(URL+'groups/user/'+window.localStorage.token).success(function(data) {
            $scope.owngroups = data;
            console.log('own G:'+$scope.owngroups);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        //Obtener Otros Grupos
        $http.get(URL+'groups/no/'+window.localStorage.token).success(function(data) {
            $scope.othergroups = data;
            console.log('other G:'+data);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    $scope.addUser = function (group) {
        $http({
            method: 'POST',
            url: URL+'groups/'+group+'/user',
            data: {_id:window.localStorage.token},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadGroups();
            console.log(data);

        })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };



    $scope.deleteUser = function (group) {
        $http({
            method: 'DELETE',
            url: URL+'groups/'+group+'/user',
            data: {_id:window.localStorage.token},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadGroups();
            console.log(data);

        })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };
})
.service('GroupMessageService',function ($http, $log,$stateParams) {
    this.loadGroupMessages = function() {
        $http.get(URL+'message/parent/'+$stateParams.groupId).success(function (data) {
            $scope.messages=data;
        });
    }
});