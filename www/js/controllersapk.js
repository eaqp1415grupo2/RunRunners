angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $window) {
    //var URL='https://192.168.1.139:3030/';
    //var URL='https://147.83.7.203:3030/';
    //var URL='https://10.189.28.37:3030/';
    var URL='https://localhost:3030/';
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
