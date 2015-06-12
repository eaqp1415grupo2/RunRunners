angular.module('messages.controller', [])

.controller("MessagesCtrl", function ($scope, $stateParams, $http, $ionicLoading, $log, $window) {
    $scope.messages = [];
    console.log('sP: '+$stateParams.parentId);
    $scope.postMessage=[];


	$scope.loadMessage = function () {
		$http.get(URL+'message/parent/'+$stateParams.parentId).success(function(data) {
			$scope.messages = data;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	};
	
	$scope.addMessage = function () {
		if(($scope.postMessage.text==null)||($scope.postMessage.text=="")){
		console.log("Mensaje vacio no se postea");
		$window.alert("Debes escribir algo!");
		}else{
		$http({
			method: 'POST',
			url: URL+'message',
			data: {
					UserID:window.localStorage.token,
					Text:$scope.postMessage.text,
					ParentID:$stateParams.parentId
					},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				console.log(data);
				
				$scope.loadMessage();
				$scope.postMessage.text="";
			})
			.error(function (data) {
				console.log('Error:' + data);
			});
	
	}
	};
	
	$scope.deleteMessage = function (id) {
		$http({
			method: 'DELETE',
			url: URL+'message/'+id,
			data: {UserID:window.localStorage.token},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				//window.location.href = '#/map/races/';
				console.log(data);
				$scope.loadMessage();
			})
			.error(function (data) {
				$window.alert(data);
				console.log('Error:' + data);
			});
	};
});