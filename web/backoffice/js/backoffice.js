var app = angular.module('backOffice',['ngDialog', 'ui.bootstrap']);
var url = 'https://localhost:3030/';
app.controller('headerController', function($scope, ngDialog){
    $scope.clickToOpenSignUp = function () {
        ngDialog.open({
            template: 'addUser'
        });
    };
});

app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(setTab){
        this.tab = setTab;
    };
    this.isSet = function(isSet){
        return this.tab === isSet;
    };
});

app.controller('userController', ['$http', '$scope', 'ngDialog', 'filterFilter', function ($http, $scope, ngDialog,filterFilter){
    var backOffice = this;
    var user = {};
    backOffice.users = [];
    $scope.search = {};
    var urluser = url + 'user';
    $http.get(urluser).success(function (data) {
        backOffice.users = data;
        console.log(backOffice.users);
        $scope.currentPage = 1;
        $scope.totalItems = backOffice.users.length;
        console.log($scope.totalItems);
        $scope.entryLimit = 3;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    }).error(function(data) {
        window.alert("ERROR - Fallo al realizar el GET");
    });

    this.addUser = function(){
        backOffice.users.push(this.user);
        $http({
            method: 'POST',
            url: urluser,
            data: this.user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            window.alert("Se ha realizado el POST");
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

    this.updateUser = function(username, name, surname, email){
        user.Username = username;
        user.Name = name;
        user.Surname = surname;
        user.Email = email;
        var urluserupdate = urluser+username;
        console.log(url);
        $http({
            method: 'PUT',
            url: urluserupdate,
            data: user,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            console.log("put");
            window.alert(data);
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el POST");
        });
        this.user = {};
    };

    $scope.clickToView = function (data) {
        window.alert("Se vera " + data);
        var urlview = urluser+data;
        /*$http.get(url).success(function (data) {
         }).error(function(data) {
         window.alert("ERROR - Fallo al realizar el GET");
         });*/
        ngDialog.open({
            template: 'updateUser',
            scope: $scope
        });
        $scope.Username = this.user.Username;
        $scope.Name = this.user.Name;
        $scope.Surname = this.user.Surname;
        $scope.Email = this.user.Email;

    };

    $scope.clickToDelete = function (data) {
        window.alert("Se borrara " + data);
        var urlDelete = urluser+data;
        $http.delete(urlDelete).success(function (data) {
            window.alert(data);
        }).error(function(data) {
            window.alert("ERROR - Fallo al realizar el DELETE");
        });
    };

    $scope.resetFilters = function () {
        $scope.search = {};
    };

    // $watch search to update pagination
    $scope.$watch('search', function (newVal, oldVal) {
        $scope.filtered = filterFilter(backOffice.users, newVal);
        $scope.totalItems = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        $scope.currentPage = 1;
    }, true);
}]);

app.controller('raceController', ['$scope','$http', function($scope, $http) {
    $scope.newObject = {};
    $scope.objects = {};
    $scope.selected = false;

    $http.get('https://localhost:3030/race/').success(function(data) {

        $scope.objects = data;
        console.log(data);
    })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.deleteObject = function(newObject) {
        $http.delete('https://localhost:3030/race/' + $scope.newObject._id)
            .success(function(data) {
                $scope.newObject = {};
                $scope.selected = false;
                $scope.objects = null;

                $http.get('https://localhost:3030/race/').success(function(data) {
                    $scope.objects = data;
                })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });

            })
            .error(function(data) {
                console.log('Error: ' + data);
                window.alert('Error:' + data);
            });
    };

    $scope.createObject = function() {
        $http.post('https://localhost:3030/race/', $scope.newObject)
            .success(function(data) {
                $scope.newObject = {};
                $scope.objects.push(data);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
                window.alert('Error: ' + data);
            });
    };

    $scope.updateObject = function(newObject) {
        console.log(newObject);
        $http.put('https://localhost:3030/race/' + $scope.newObject._id, newObject)
            .success(function(data) {
                $scope.newObject = {}; // Borramos los datos del formulario

                //  $scope.objects = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                window.alert('Error:' + data);
            });
    };



    $scope.selectObject = function(object) {
        $http.get('https://localhost:3030/race/name/'+ object.Name).success(function(data) {
            $scope.newObject = data;
            console.log(data);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $scope.newObject = object;
        $scope.selected = true;
        console.log($scope.newObject, $scope.selected);
    };

}]);

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

app.controller('footerController', function($scope){});

app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

