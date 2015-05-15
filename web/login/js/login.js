var app = angular.module('loginRunRunners',['ngDialog']);
var url = "147.83.7.203:3000/";
var token;
app.controller('headerController', function($scope, ngDialog){
    $scope.clickToOpenSignUp = function () {
        ngDialog.open({
            template: 'signUp'
        });
    };

    $scope.clickToOpenSignIn = function () {
        ngDialog.open({
            template: 'signIn'
        });
    };
});



app.controller('userController', ['$http', function ($http){
    var loginRunRunners = this;
    var user = {};
    loginRunRunners.users = [];
    console.log("controller");
    this.addUser = function(){
        loginRunRunners.users.push(this.user);
        $http({
            method: 'POST',
            url: url+"user",
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            console.log("post");
            window.location.href='/wall';
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

    this.loginUser = function(){
        console.log(url);
        console.log(this.user);
        $http({
            method: 'POST',
            url: url+"user/auth",
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            token = data;
            window.location.href='/wall?user='+token;
        }).error(function(data) {
            console.log(data);
            window.alert("ERROR - Fallo al realizar la autentificación");
        });
        this.user = {};
    };
}]);

app.controller('footerController', function($scope){});

app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
            console.log('default pre-close callback');
        }
    });
}]);




