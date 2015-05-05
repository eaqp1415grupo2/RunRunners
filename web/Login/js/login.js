var app = angular.module('loginRunRunners',['ngDialog']);

app.controller('headerController', function($scope, ngDialog){
    $scope.clickToOpen = function () {
        ngDialog.open({ template: 'singup.html' });
    };
    $scope.createUser = function () {

    };
});

app.controller('userController', ['$http', function ($http){
    var projectNotes = this;
    var user = {};
    projectNotes.users = [];

    $http.get('http://localhost:3000/user').success(function (data) {
        projectNotes.users = data;
    }).
        error(function(data) {
            window.alert("ERROR - Fallo al realizar el GET");
        });

    this.addUser = function(){
        projectNotes.users.push(this.user);
        $http({
            method: 'POST',
            url: "http://localhost:8080/notas-api/user",
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


