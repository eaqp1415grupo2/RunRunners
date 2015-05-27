var app = angular.module('loginRunRunners',[]);
var URL = "https://localhost:3030/user";


app.controller('headerController', function($scope, ngDialog){

});

app.controller('userController', ['$http', '$scope', '$window', function ($http, $scope,$window){

    var loginRunRunners = this;
    var user = {};
    loginRunRunners.users = [];
    console.log("controller");
    this.addUser = function(){
        loginRunRunners.users.push(this.user);
        $http({
            method: 'POST',
            url: URL,
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            console.log(data);
            $window.localStorage.token = data;
            window.location.href='/ionic';
        }).error(function(data) {
            window.alert("ERROR - POST");
        });
        this.user = {};
    };

    this.loginUser = function(){
        console.log(this.user);
        var urlauth = URL+"/auth";
        $http({
            method: 'POST',
            url: urlauth,
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            console.log(data);
            $window.localStorage.token = data;
            window.location.href='/ionic';
        }).error(function(data) {
            window.alert("ERROR - AUTH");
        });
        this.user = {};
    };

    $scope.loginFacebook = function(){
        console.log('facebook');
        window.location.href='/auth/facebook';
    }
}]);

app.controller('facebookController', ['$http', '$scope', function ($http, $scope){
    var loginRunRunners = this;
    loginRunRunners.users = [];
    console.log($scope.user);
    loginRunRunners.users.push(this.user);

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
