angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $window) {
    var rol = 1;
    $http.get(URL+'user/admin/'+$window.localStorage['token']).success(function(data) {
        if (data=='admin'){
            rol=2;
        } else {
            rol = 1;
        }
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    $scope.setRol = function(setTab){
        rol = setTab;
    };
    $scope.isSet = function(isSet){
        return rol === isSet;
    };
});
