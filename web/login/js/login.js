var app = angular.module('loginRunRunners',['ngDialog']);

app.controller('headerController', function($scope, ngDialog){
    $scope.clickToOpenSignUp = function () {
        ngDialog.open({ template: 'signup.html' });
    };

    $scope.clickToOpenSignIn = function () {
        ngDialog.open({ template: 'signin.html' });
    };

    $scope.createUser = function () {

    };

    $scope.loginUser = function () {

    };
});

app.controller('userController', ['$http', function ($http){
    var loginRunRunners = this;
    var user = {};
    loginRunRunners.users = [];

    $http.get('http://localhost:3000/user').success(function (data) {
        loginRunRunners.users = data;
    }).
        error(function(data) {
            window.alert("ERROR - Fallo al realizar el GET");
        });

    this.addUser = function(){
        loginRunRunners.users.push(this.user);
        $http({
            method: 'POST',
            url: "http://localhost:3000/user",
            data: this.user,
            headers: {'Content-Type': 'application/vnd.note.api.user+json'}
        }).success(function(data) {
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

}]);

app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(setTab){
        this.tab = setTab;
    };
    this.isSet = function(isSet){
        return this.tab === isSet;
    };
});


