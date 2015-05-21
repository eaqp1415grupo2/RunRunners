angular.module('MainApp', [])

function mainController($scope, $http) {
	$scope.newMessage = {};
	$scope.messages = {};
	$scope.selected = false;
	var URL='https://localhost:3030';

	// Obtenemos todos los datos de la base de datos
	$http.get(URL+'/message').success(function(data) {
		$scope.messages = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	// Función para registrar un message
	$scope.registrarMessage = function() {
		$http.post(URL+'/message', $scope.newMessage)
		.success(function(data) {
				$scope.newMessage = {}; // Borramos los datos del formulario
				$scope.messages = data;
				
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$http.get(URL+'/message').success(function(data) {
		$scope.messages = data;
		})
		.error(function(data) {
		console.log('Error: ' + data);
		});
	};

	// Función para editar los datos de una message
	$scope.modificarMessage = function(newMessage) {
		$http.put(URL+'/message/' + $scope.newMessage._id, $scope.newMessage)
		.success(function(data) {
				$scope.newMessage = {}; // Borramos los datos del formulario
				$scope.messages = data;
				$scope.selected = false;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$http.get(URL+'/message').success(function(data) {
		$scope.messages = data;
		})
		.error(function(data) {
		console.log('Error: ' + data);
		});
	};

	// Función que borra un message message conocido su id
	$scope.borrarMessage = function(newMessage) {
		console.log('Borrar: '+newMessage);
		$http.delete(URL+'/message/' + $scope.newMessage._id)
		.success(function(data) {
			$scope.newMessage = {};
			$scope.messages = data;
			$scope.selected = false;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$http.get(URL+'/message').success(function(data) {
		$scope.messages = data;
		})
		.error(function(data) {
		console.log('Error: ' + data);
		});
	};

	// Función para coger el message seleccionado en la tabla
	$scope.selectObject = function(message) {
		$scope.newMessage = message;
		$scope.selected = true;
		console.log($scope.newMessage, $scope.selected);
	};
}
