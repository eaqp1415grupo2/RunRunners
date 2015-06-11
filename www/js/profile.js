angular.module('profile.controller', [])

.controller('profileCtrl',function($scope, $http, $ionicModal, $location) {

    $scope.updateUser = {};

    $http.get('https://localhost:3030/user/' + window.localStorage.token)
        .success(function (data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error:' + data);
        });

    $scope.getUser = function () {
        $http.get('https://localhost:3030/user/' + window.localStorage.token)
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };
    $ionicModal.fromTemplateUrl('update.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModalUpdate = function () {
        $scope.modal.show();
    };

    $scope.okUpdate = function (updateUser) {

        $http.put('user/' + window.localStorage.token, $scope.updateUser)//+ cookie o token)
            .success(function (data) {
                $location.url('/map/home');
                $scope.modal.hide();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.closeModalUpdate = function () {
        $scope.modal.hide();
    };



    $ionicModal.fromTemplateUrl('delete.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal2) {
        $scope.modal2 = modal2;
    });
    $scope.openModalDelete = function () {
        $scope.modal2.show();
    };
    $scope.closeModalDelete = function () {
        $scope.modal2.hide();

    };

    $scope.okDelete = function () {
        $http.delete('user/' + window.localStorage.token)//+ cookie o token)
            .success(function (data) {
                alert("acabas de borrar el usuario, le redigiremos al inicio");
                window.localStorage.token = {};
                window.location.href = '/';
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

});