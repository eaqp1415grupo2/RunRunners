angular.module('ui.bootstrap.demo', ['ui.bootstrap'])

        .controller("GetCtrl", function($scope, $http) {
        $http.get('user/David')
            .success(function(data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });

    });

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


/*************************************************/

angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl2', function ($scope, $modal) {


    $scope.openstatistics = function () {

        var modalInstance = $modal.open({
            templateUrl: 'statistics',
            controller: 'ModalInstanceCtrlStatistics'
            //  controller: "ModalInstanceCtrlUpdate" ///añadimos el controller que configuraremos update
        });
    }

});

angular.module('ui.bootstrap.demo').controller('ModalInstanceCtrlStatistics', function ($scope, $modalInstance) {

    $scope.cancelstatistics = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.showmap = function () {
        var mapOptions = {
            center: new google.maps.LatLng(41.3927395, 2.1435036),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP};
        var map = new google.maps.Map(document.getElementById("map2"),mapOptions)
    };
});

angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl3', function ($scope, $modal) {


    $scope.openstatistics2 = function () {

        var modalInstance = $modal.open({
            templateUrl: 'statistics2',
            controller: 'ModalInstanceCtrlStatistics2'
            //  controller: "ModalInstanceCtrlUpdate" ///añadimos el controller que configuraremos update
        });
    }

});

angular.module('ui.bootstrap.demo').controller('ModalInstanceCtrlStatistics2', function ($scope, $modalInstance) {

    $scope.cancelstatistics2 = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.showmap = function () {
        var mapOptions = {
            center: new google.maps.LatLng(41.3927395, 2.1435036),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP};
        var map = new google.maps.Map(document.getElementById("map3"),mapOptions)
    };
});

angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl4', function ($scope, $modal) {


    $scope.openstatistics3 = function () {

        var modalInstance = $modal.open({
            templateUrl: 'statistics3',
            controller: 'ModalInstanceCtrlStatistics3'
            //  controller: "ModalInstanceCtrlUpdate" ///añadimos el controller que configuraremos update
        });
    }

});

angular.module('ui.bootstrap.demo').controller('ModalInstanceCtrlStatistics3', function ($scope, $modalInstance) {

    $scope.cancelstatistics3 = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.showmap = function () {
        var mapOptions = {
            center: new google.maps.LatLng(41.3927395, 2.1435036),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP};
        var map = new google.maps.Map(document.getElementById("map4"),mapOptions)
    };
});


