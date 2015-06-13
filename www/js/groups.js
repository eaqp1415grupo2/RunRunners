angular.module('groups.controller', [])

.controller('GroupsCtrl', function ($scope, $http, $ionicModal, $window, $ionicLoading, $log) {
    $scope.owngroups = [];
    $scope.othergroups = [];
    $scope.newgroup = [];

    $scope.loadGroups=function () {

        //Obtener Grupos propios
        $http.get(URL+'groups/user/'+window.localStorage.token).success(function(data) {
            $scope.owngroups = data;
            console.log('own G:'+$scope.owngroups);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        //Obtener Otros Grupos
        $http.get(URL+'groups/no/'+window.localStorage.token).success(function(data) {
            $scope.othergroups = data;
            console.log('other G:'+data);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    $scope.addUser = function (group) {
        $http({
            method: 'POST',
            url: URL+'groups/'+group+'/user',
            data: {_id:window.localStorage.token},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadGroups();
            console.log(data);

        })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };



    $scope.deleteUser = function (group) {
        $http({
            method: 'DELETE',
            url: URL+'groups/'+group+'/user',
            data: {_id:window.localStorage.token},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            $scope.loadGroups();
            console.log(data);

        })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };
    
   //NewGroupModal
	$ionicModal.fromTemplateUrl('NewGroupModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openNewGroupModal = function () {
        $scope.modal.show();
    };

	$scope.postNewGroup = function () {
		console.log("answer: "+$scope.newgroup);
		if(($scope.newgroup.Name==null)||($scope.newgroup.Name=="")){
		//console.log("Mensaje vacio no se postea");
		$window.alert("Debes escribir el nombre del grupo!");
		}else{
		$http({
			method: 'POST',
			url: URL+'groups',
			data: {
					_id:window.localStorage.token,
					Info:$scope.newgroup.Info,
					Name:$scope.newgroup.Name,
					Level:$scope.newgroup.Level,
					Location:$scope.newgroup.Location
					},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				console.log(data);
				
				$scope.loadGroups();
				$scope.newgroup.Info="";
				$scope.newgroup.Name="";
				$scope.newgroup.Level="";
				$scope.newgroup.Location="";
				$scope.modal.hide();
			})
			.error(function (data) {
				console.log('Error:' + data);
			});
	
	}
	};


    $scope.closeNewGroupModal = function () {
        $scope.modal.hide();
    };
    
    $scope.deleteGroup = function (gid) {
		$http({
			method: 'DELETE',
			url: URL+'groups/'+gid,
			data: {_id:window.localStorage.token},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				//window.location.href = '#/map/races/';
				console.log(data);
				$scope.loadGroups();
			})
			.error(function (data) {
				$window.alert(data);
				console.log('Error:' + data);
			});
	}; 
    
})
