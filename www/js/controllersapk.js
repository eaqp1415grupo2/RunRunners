angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $window) {
    //var URL='https://10.189.25.180:3030/';
    var URL='https://localhost:3030/';
    var rol = 1;
    $http.get(URL+'user/admin/'+$window.localStorage['token']).success(function(data) {
        rol=2;
    })
    .error(function(data) {
        rol=1;
    });
    $scope.setRol = function(setTab){
        rol = setTab;
    };
    $scope.isSet = function(isSet){
        return rol === isSet;
    };
});
