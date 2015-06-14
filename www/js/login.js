angular.module('login.controller', [])

.controller('loginCtrl', function ($http, $scope,$location, $window){
  //var URL='https://192.168.1.139:3030/';
  //var URL='https://147.83.7.203:3030/';
  //var URL='https://10.189.28.37:3030/';
  var URL='https://localhost:3030/';
  $scope.users = [];
  if(($window.localStorage['token'] != undefined && $window.localStorage['token'] != "") || $window.location.search != ""){
    console.log("Entra");
    if($window.location.search != ""){
      $window.localStorage['token'] = $window.location.search.substring(1);
    }
    $window.location.href='#/map/home';
  }

  $scope.addUser = function(){
    $scope.users.push(this.user);
    var urlsignin = URL+"user";
    $http({
      method: 'POST',
      url: urlsignin,
      data: this.user,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data) {
      $window.localStorage['token']=data;
      $window.location.href='#/map/home';
    }).error(function(data) {
      $window.alert("ERROR - POST");
    });
    this.user = {};
  };

  $scope.loginUser = function(){
    var urlauth = URL+"user/auth";
    $http({
      method: 'POST',
      url: urlauth,
      data: this.user,
      headers: {'Content-Type': 'application/json'}
    }).success(function(data) {
      $window.localStorage['token']=data;
      $window.location.href='#/map/home';
    }).error(function(data) {
      $window.alert("ERROR - AUTH");
    });
    this.user = {};
  };

  $scope.loginFacebook = function(){
    console.log('facebook');
    $window.location.assign(URL+'auth/facebook')
  };
})

.controller('tabCtrl', function(){
this.tab = 1;

  this.setTab = function(setTab){
    this.tab = setTab;
  };
  this.isSet = function(isSet){
    return this.tab === isSet;
  };
});
