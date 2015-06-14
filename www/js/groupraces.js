angular.module('groupraces.controller', [])

.controller('groupRacesCtrl', function($scope, $ionicModal, $http, $window, $stateParams, $ionicLoading, $log) {

//No pongais las IP aqui las coge de controllers.js o de appApk.js asi no hay que cambiarlo en ningun .js 

    $scope.groupraces = [];
    $scope.otherraces = [];
    $scope.rid = [];
    $scope.user = [];
    $scope.Admin = [];

	 $scope.getUser = function () {
        $http.get(URL + 'user/' + $window.localStorage['token'])
            .success(function (data) {
                $scope.user = data;
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    }; 
    
    $scope.getGroupAdmin = function () {
        $http.get(URL + 'groups/' + $stateParams.id)
            .success(function (data) {
                $scope.Admin = data;
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };
    
   $scope.initListGroupRace = function () {

		$scope.getUser();
		$scope.getGroupAdmin();
			console.log($scope.user+' '+$scope.Admin);
		if ($scope.user=$scope.Admin) {
		
		 $scope.loadGroupRaces();
		 $scope.loadNoGroupRaces();

		}else {
		
			$scope.loadGroupRaces();}
  	 };

    $scope.addRace = function (id) {
        $http({
            method: 'POST',
            url: URL+'groups/'+$stateParams.id+'/race',
            data: {_id:window.localStorage.token,
            		raceid:id},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
				$scope.groupraces="";
				$scope.otherraces="";
				
				$scope.initListGroupRace();

        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    };
    
    $scope.loadGroupRaces=function () {
        //Obtener carreras propias
        $http.get(URL+'race/group/'+$stateParams.id).success(function(data) {
            $scope.groupraces = data;
            console.log('own Races:'+$scope.groupraces);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    };
    
    $scope.loadNoGroupRaces=function () {
        //Obtener otras carreras
        $http.get(URL+'race/no/group/'+$stateParams.id).success(function(data) {
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
				console.log('Eliminado '+data);
				$scope.groupraces="";
				$scope.otherraces="";
				
				$scope.initListGroupRace();
			})
			.error(function (data) {
				$window.alert(data);
				console.log('Error:' + data);
			});
	}; 

});
