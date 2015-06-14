angular.module('groupraces.controller', [])

.controller('groupRacesCtrl', function($scope, $ionicModal, $http, $window, $stateParams, $ionicLoading, $log) {

//No pongais las IP aqui las coge de controllers.js o de appApk.js asi no hay que cambiarlo en ningun .js 

    $scope.groupraces = [];
    $scope.otherraces = [];
    $scope.rid = [];
    $scope.user = [];

	 $scope.getUser = function () {
        $http.get(URL + 'user/' + $window.localStorage['token'])
            .success(function (data) {
                $scope.user = data;
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    }; 
    
    $scope.addRaceToGroup = function (id) {
        $http({
            method: 'POST',
            url: URL+'group/'+$stateParams.id+'/race',
            data: {_id:window.localStorage.token,
            		raceid:id},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadRaces();
            console.log(data);

        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    };
    
    $scope.loadGroupRaces=function () {
        //Obtener carreras propias
        $http.get(URL+'groups/'+$stateParams.id+'/race').success(function(data) {
            $scope.groupraces = data;
            console.log('own Races:'+$scope.groupraces);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    };
    
    $scope.loadNoGroupRaces=function () {
        //Obtener otras carreras
        $http.get(URL+'race/').success(function(data) {
            $scope.otherraces = data;
            console.log('other Races:'+$scope.otherraces);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

 $scope.deleteRace = function (id) {
    	
		$http({
			method: 'DELETE',
			url: URL+'groups/'+$stateParams.id+'/race',
			data: {_id:window.localStorage.token,
					 raceid:id
			},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				//window.location.href = '#/map/races/';
				console.log('Eliminado OK'+data);
				$scope.loadGroupRaces();
				$scope.loadNoGroupRaces();
			})
			.error(function (data) {
				$window.alert(data);
				console.log('Error:' + data);
			});
	}; 

});
