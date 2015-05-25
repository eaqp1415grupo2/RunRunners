
angular.module('ui.bootstrap.demo', ['ui.bootstrap'])


    .controller("GetCtrl", function($scope, $http) {
        $http.get('https://localhost:3030/user/username/David')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error:' + data);
            });

    })

angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl', function ($scope, $modal) {


    $scope.openUpdate = function () {

        var modalInstance = $modal.open({
            templateUrl: 'ModalUpdate',
            controller: "ModalInstanceCtrlUpdate" ///añadimos el controller que configuraremos update
        });
    };
    $scope.openDelete = function () {

        var modalInstance = $modal.open({
            templateUrl: 'ModalDelete',
            controller: 'ModalInstanceCtrlDelete' //añadimos el controller que configuraremos delete
        });
    };

});
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.


angular.module('ui.bootstrap.demo').controller('ModalInstanceCtrlUpdate', function ($scope, $modalInstance, $http) {


    $scope.okUpdate= function () {
        $http.put('user/David',  $scope.updateUser)//+ cookie o token)
            .success(function(data) {
                // alert("acabas de actualizar el usuario")  //-cookie o token de usuario
                window.location.href='/profile';
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    $scope.cancelUpdate= function () {
        $modalInstance.dismiss('cancel');
    };


});
angular.module('ui.bootstrap.demo').controller('ModalInstanceCtrlDelete', function ($scope, $modalInstance, $http) {

    $scope.okDelete= function () {
        $http.delete('user/David' )//+ cookie o token)
            .success(function(data) {
                alert("acabas de borrar el usuario, le redigiremos al inicio");  //-cookie o token de usuario
                window.location.href='/';
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.cancelDelete = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelUpdate= function () {
        $modalInstance.dismiss('cancel');
    };
});
