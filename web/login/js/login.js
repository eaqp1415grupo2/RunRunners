var app = angular.module('loginRunRunners',['ngDialog']);


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

    $scope.createUser = function () {

    };

    $scope.loginUser = function () {

    };
});



app.controller('userController', ['$http', '$scope', function ($http, $scope){
    var loginRunRunners = this;
    var user = {};
    loginRunRunners.users = [];
    console.log("controller");
    this.addUser = function($location){
        loginRunRunners.users.push(this.user);
        $http({
            method: 'POST',
            url: "http://localhost:3000/user",
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            console.log("post");
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

    this.loginUser = function(){
        var url;
        url = "http://localhost:3000/user/" + this.user.Username;
        console.log("get");
        console.log(url);
        $http.get(url).success(function (data) {
            loginRunRunners.users = data;
            console.log(loginRunRunners.users);
            console.log("success");
            user = data;
            console.log(user);
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el GET");
        });
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




