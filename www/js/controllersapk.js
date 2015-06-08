angular.module('starter.controllers', [])

.controller('MainCtrl', ['$scope', function($scope) {

}])

.controller('loginCtrl',['$http', '$scope', '$location', function ($http, $scope,$location){

  $scope.users = [];

  this.addUser = function(){
    users.push(this.user);
    var urlsignin = URL+"user";
    $http({
      method: 'POST',
      url: urlsignin,
      data: this.user,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data) {
      console.log("data: "+data);
      token = data;
      window.localStorage.token=data;
      $location.url('/map/home');
    }).error(function(data) {
      window.alert("ERROR - POST");
    });
    this.user = {};
  };

  this.loginUser = function(){
    console.log(this.user);
    var urlauth = URL+"user/auth";
    $http({
      method: 'POST',
      url: urlauth,
      data: this.user,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data) {
      console.log("token: "+data);
      token = data;
      window.localStorage.token=data;
      $location.url('/map/home');
    }).error(function(data) {
      window.alert("ERROR - AUTH");
    });
    this.user = {};
  };

  $scope.loginFacebook = function(){
    console.log('facebook');
    window.location.href='/auth/facebook';
  };
}])

.controller('tabCtrl', function(){
  this.tab = 1;

  this.setTab = function(setTab){
    this.tab = setTab;
  };
  this.isSet = function(isSet){
    return this.tab === isSet;
  };
});
