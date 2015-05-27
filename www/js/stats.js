/**
 * Created by david on 25/05/2015.
 */
//var token=window.localStorage.token;
var app = angular.module('stats', [])
    app.controller("getraces", function($scope, $http) {

        $http.get('https://localhost:3030/user/'+ window.localStorage.token +'/races')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error:' + data);
            });

    });
//$http.get('https://localhost:3030/user/'+token +'/races').success(function(data) {
  //  $scope.users = data;
//})
  //  .error(function(data) {
    //    console.log('Error: ' + data);
    //});
/*
angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl2', function ($scope, $modal) {


    $scope.openstatistics = function () {

        var modalInstance = $modal.open({
            templateUrl: 'statistics',
            controller: 'ModalInstanceCtrlStatistics'
            //  controller: "ModalInstanceCtrlUpdate" ///a�adimos el controller que configuraremos update
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
            //  controller: "ModalInstanceCtrlUpdate" ///a�adimos el controller que configuraremos update
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
    */