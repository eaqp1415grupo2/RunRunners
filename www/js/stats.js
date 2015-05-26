/**
 * Created by david on 25/05/2015.
 */
angular.module('Stats', ['ionic'])
angular.module('Stats').controller('ModalDemoCtrl2', function ($scope, $modal, $http) {


    $scope.openstatistics = function () {

        var modalInstance = $modal.open({
            templateUrl: 'statistics',
            controller: 'ModalInstanceCtrlStatistics'
            //  controller: "ModalInstanceCtrlUpdate" ///añadimos el controller que configuraremos update
        });
    }

});

angular.module('Stats').controller('ModalInstanceCtrlStatistics', function ($scope, $modalInstance, $http) {

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


angular.module('Stats').controller('ModalInstanceCtrlStatistics2', function ($scope, $modalInstance, $http) {

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

angular.module('Stats').controller('ModalDemoCtrl4', function ($scope, $modal, $http) {


    $scope.openstatistics3 = function () {

        var modalInstance = $modal.open({
            templateUrl: 'statistics3',
            controller: 'ModalInstanceCtrlStatistics3'
            //  controller: "ModalInstanceCtrlUpdate" ///añadimos el controller que configuraremos update
        });
    }

});

angular.module('Stats').controller('ModalInstanceCtrlStatistics3', function ($scope, $modalInstance, $http) {

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