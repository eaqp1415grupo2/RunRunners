angular.module('groups.controller', [])

.controller('GroupsCtrl', function ($scope, $http, $ionicModal, $window, $ionicLoading, $log) {
    $scope.owngroups = [];
    $scope.othergroups = [];
    $scope.newgroup = [];
    $scope.gid = [];
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


    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal2.hide();
    };
    

  
  	$ionicModal.fromTemplateUrl('deleteGroup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal2) {
        $scope.modal2 = modal2;
    });

    $scope.openDeleteGroupModal = function (gid,admin) {
    	  $scope.gid=gid;
    	  $scope.getUser();
    	  console.log("gid "+ gid +" Admin "+admin + " Username "+$scope.user.Username)
    	  if (admin==$scope.user.Username) {
           $scope.modal2.show(); 	  
    	  }else {
			$window.alert("No puedes elimirar un grupo si no eres su Administrador!")		  
		  }
    };
    
    $scope.deleteGroup = function () {
    	
		$http({
			method: 'DELETE',
			url: URL+'groups/'+$scope.gid,
			data: {_id:window.localStorage.token},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				//window.location.href = '#/map/races/';
				console.log(data);
				$scope.loadGroups();
				$scope.modal2.hide();
			})
			.error(function (data) {
				$window.alert(data);
				console.log('Error:' + data);
			});
	}; 
	
	
	
})
