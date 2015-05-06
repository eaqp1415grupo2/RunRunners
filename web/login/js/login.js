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
        console.log(user);
        loginRunRunners.users.push(this.user);
        $http({
            method: 'POST',
            url: "http://localhost:3000/user",
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
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




