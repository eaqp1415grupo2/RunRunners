var app = angular.module('loginRunRunners',['ngDialog']);


app.controller('headerController', function($scope, ngDialog){
    $scope.clickToOpenSignUp = function () {
        ngDialog.open({
            template: 'signUp',
            controller: 'InsideCtrl',
            className: 'ngdialog-theme-default'
        });
    };

    $scope.clickToOpenSignIn = function () {
        ngDialog.open({
            template: 'signIn',
            controller: 'InsideCtrl',
            className: 'ngdialog-theme-default'
        });
    };

    $scope.createUser = function () {

    };

    $scope.loginUser = function () {

    };
});

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

app.controller('InsideCtrl', function ($scope, ngDialog) {
    $scope.dialogModel = {
        message : 'message from passed scope'
    };
    $scope.openSecond = function () {
        ngDialog.open({
            template: '<h3><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
            plain: true,
            closeByEscape: false,
            controller: 'SecondModalCtrl'
        });
    };
});


