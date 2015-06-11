'use strict';
var MapApp = angular.module('MapApp', ['ionic']);
var token={};
var object={};

var URL='https://localhost:3030/';
//var URL='https://192.168.1.136:3030/';
var groupid='555db5a80a9995be10000009';
/**
 * Routing table including associated controllers.
 */
MapApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('menu', {url: "/map", abstract: true, templateUrl: "/templates/menu.html"})
		.state('login', {url: '/login', templateUrl: '/templates/login.html', controller: 'loginCtrl'})
		.state('menu.home', {url: '/home', views: {'menuContent': {templateUrl: '/templates/map.html', controller: 'GpsCtrl'} }  })
		.state('menu.groups', {url: '/groups', views: {'menuContent': {templateUrl: '/templates/groups.html', controller: 'GroupsCtrl'} }  })
		.state('menu.races', {url: '/races', views: {'menuContent': {templateUrl: '/templates/races.html', controller: 'RacesCtrl'} }  })
		.state('menu.group', {url: "/group/:parentId",views: {'menuContent': {templateUrl: "templates/messages.html",controller: 'MessagesCtrl'}}})
		.state('menu.race', {url: "/race/:parentId",views: {'menuContent': {templateUrl: "templates/messages.html",controller: 'MessagesCtrl'}}})
		.state('menu.userlist', {url: "/users/:parent/:parentId",views: {'menuContent': {templateUrl: "templates/userlist.html",controller: 'UsersCtrl'}}})
		.state('menu.profile', {url: '/profile', views: {'menuContent': {templateUrl: '/templates/profile3.html', controller: 'profileCtrl'} }  })
		.state('menu.logout', {url: '/logout', views: {'menuContent': {templateUrl: '/templates/logout.html', controller: 'logOutCtrl'} }  })
		.state('menu.stats', {url: '/stats', views: {'menuContent': {templateUrl: '/templates/stats.html', controller: 'statsCtrl'} }  });

	// if none of the above states are matched, use this as the fallback
	console.log(window.localStorage.token);
    console.log(window.location.search);
	if((window.localStorage.token === undefined || window.localStorage.token == 'null' || window.localStorage.token == "") && window.location.search== ""){
		$urlRouterProvider.otherwise('/login');
	} else {
        window.localStorage.token = window.location.search.substring(1);
        token = window.localStorage.token;
		$urlRouterProvider.otherwise('/map/home');
	}
}]);

MapApp.service("GroupMessageService",["$http", "$log", "$stateParams",GroupMessageService ]);
/*
MapApp.service("GroupsService",["$http", "$log", GroupsService ]);
MapApp.service("GroupMessageService",["$http", "$log", "$stateParams",GroupMessageService ]);

MapApp.controller("GroupsCtrl",["$scope", "$stateParams","$http","$ionicLoading", "GroupsService", "$log", GroupsCtrl]);
MapApp.controller("GroupCtrl",["$scope", "$http","$stateParams","$ionicLoading", "GroupMessageService", "$log", GroupCtrl]);                          


MapApp.service("RacesService",["$http", "$log", RacesService ]);
MapApp.service("RaceMessageService",["$http", "$log", "$stateParams",RaceMessageService ]);

MapApp.controller("RacesCtrl",["$scope", "$http","$stateParams","$ionicLoading", "RacesService", "$log", RacesCtrl]);
MapApp.controller("RaceCtrl",["$scope", "$stateParams","$ionicLoading", "RaceMessageService", "$log", RaceCtrl]);  
/**
 * HEADER - handle menu toggle
 */
MapApp.controller('statsCtrl',function($scope, $http) {



	$scope.getraces = function () {
		$http.get(URL+'user/' + window.localStorage.token +'/races')
			.success(function (data) {
				$scope.users = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error:' + data);
			});
	};


});

MapApp.controller('profileCtrl',function($scope, $http, $ionicModal, $location) {

	$scope.updateUser = {};

	$http.get(URL+'user/' + window.localStorage.token)
		.success(function (data) {
			$scope.users = data;
			console.log(data);
		})
		.error(function (data) {
			console.log('Error:' + data);
		});

	$scope.getUser = function () {
		$http.get(URL+'user/' + window.localStorage.token)
			.success(function (data) {
				$scope.users = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error:' + data);
			});
	};
	$ionicModal.fromTemplateUrl('update.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;
	});

	$scope.openModalUpdate = function () {
		$scope.modal.show();
	};

	$scope.okUpdate = function (updateUser) {

		$http.put('user/' + window.localStorage.token, $scope.updateUser)//+ cookie o token)
			.success(function (data) {
				$location.url('/map/home');
				$scope.modal.hide();
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
	};

	$scope.closeModalUpdate = function () {
		$scope.modal.hide();
	};



	$ionicModal.fromTemplateUrl('delete.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal2) {
			$scope.modal2 = modal2;
		});
		$scope.openModalDelete = function () {
			$scope.modal2.show();
		};
		$scope.closeModalDelete = function () {
			$scope.modal2.hide();

		};

		$scope.okDelete = function () {
			$http.delete('user/' + window.localStorage.token)//+ cookie o token)
				.success(function (data) {
					alert("acabas de borrar el usuario, le redigiremos al inicio");
					window.localStorage.token = {};
					window.location.href = '/';
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		}

});
/**
 * MAIN CONTROLLER - handle inapp browser
 */
MapApp.controller('MainCtrl', ['$scope', function($scope) {

}]);

MapApp.controller('loginCtrl',['$http', '$scope', '$location', '$window', function ($http, $scope,$location, $window){
	$scope.users = [];

	$scope.addUser = function(){
		$scope.users.push(this.user);
		var urlsignin = URL+"user";
		$http({
			method: 'POST',
			url: urlsignin,
			data: this.user,
			headers: {'Content-Type': 'application/json'}
		}).success(function(data) {
			console.log("data: "+data);
			$window.localStorage.token=data;
			$location.url('/map/home');
		}).error(function(data) {
			$window.alert("ERROR - POST");
		});
		this.user = {};
	};

	$scope.loginUser = function(){
		console.log(this.user);
		var urlauth = URL+"user/auth";
		$http({
			method: 'POST',
			url: urlauth,
			data: this.user,
			headers: {'Content-Type': 'application/json'}
		}).success(function(data) {
			console.log("token: "+data);
			$window.localStorage.token=data;
			$location.url('/map/home');
		}).error(function(data) {
			$window.alert("ERROR - AUTH");
		});
		this.user = {};
	};

	$scope.loginFacebook = function(){
		console.log('facebook');
		$window.location.href='/auth/facebook';
	};
}]);

MapApp.controller('tabCtrl', function(){
	this.tab = 1;

	this.setTab = function(setTab){
		this.tab = setTab;
	};
	this.isSet = function(isSet){
		return this.tab === isSet;
	};
});

/**
 * LOG OUT CONTROLLER - handle inapp browser
 */
MapApp.controller('logOutCtrl', ['$scope', function($scope) {
	alert("Vas a salir");
	token = null;
	window.localStorage.token = null;
	window.location.href = '/';
}]);

/**
 * CRONO CONTROLLER - handle inapp browser
 */
MapApp.controller('cronoCtrl', ['$scope', function($scope) {

}]);


/**
 * Group CONTROLLERS 
 */
function MessagesCtrl($scope, $state, $stateParams, $http, $ionicLoading, $log, $window) {
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
		
	         		
}

function GroupsCtrl($scope,$http, $ionicLoading, $log, GroupMessageService) {
    $scope.owngroups = []; 
    $scope.othergroups = [];
    
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
}

/*/Unused
function GroupsService($http, $log) {
    this.loadGroups = function() {
        return ($http.get(URL+'groups'));
    }
}

	$scope.load = function (race) {
		$http.get(URL+'message/parent/'+$stateParams.groupId).success(function(data) {
		$scope.messages = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	};
*/
function GroupMessageService($http, $log,$stateParams) {
        this.loadGroupMessages = function() {     
        $http.get(URL+'message/parent/'+$stateParams.groupId).success(function (data) {
		   $scope.messages=data;     	
        	});
        //return ($http.get(URL+'message/parent/'+$stateParams.groupId));
    }
}


function UsersCtrl($scope, $http, $stateParams , $window, $ionicLoading, $log) {
    $scope.users = [];
    $scope.parent = [];
    console.log('Type: '+$stateParams.parent+' ParentId: '+$stateParams.parentId);
    $scope.parentId=$stateParams.parentId;
    

	$scope.loadUsers=function () {
	
		$http.get(URL+$stateParams.parent+'/'+$stateParams.parentId).success(function(data) {
			$scope.parent = data;
			$scope.users = data.Users;
			console.log('Rx Info: ' + data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	};
	
	$scope.deleteUser = function (delID) {
		$http({
			method: 'DELETE',
			url: URL+$stateParams.parent+'/'+$stateParams.parentId+'/user',
			data: {
					_id:window.localStorage.token,
					delete:delID
					},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {
				$scope.loadUsers();
				console.log(data);
				
			})
			.error(function (data) {
				$window.alert(data+' No estas autorizado a expulsar a este usuario!');
				console.log('Error: ' + data);
			});
	};
		          		
}


function RacesCtrl($scope, $http, $stateParams, $ionicLoading, $log) {
    $scope.ownraces = []; 
    $scope.otherraces = []; 
    
    $scope.loadRaces=function () {
    	
    	//Obtener carreras propias
		$http.get(URL+'race/user/'+window.localStorage.token).success(function(data) {
			$scope.ownraces = data;
			console.log('own Races:'+$scope.ownraces);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	  //Obtener otras carreras
		$http.get(URL+'race/no/'+window.localStorage.token).success(function(data) {
			$scope.otherraces = data;
			console.log('other Races:'+$scope.otherraces);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		
	};

	$scope.addUser = function (race) {
		$http({
			method: 'POST',
			url: URL+'race/'+race+'/user',
			data: {_id:window.localStorage.token},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {			
				$scope.loadRaces();
				console.log(data);
				
			})
			.error(function (data) {
				console.log('Error:' + data);
			});
	};
	
	$scope.deleteUser = function (race) {
		$http({
			method: 'DELETE',
			url: URL+'race/'+race+'/user',
			data: {_id:window.localStorage.token},
			headers: {'Content-Type': 'application/json'}
		}).success(function (data) {			
				$scope.loadRaces();
				console.log(data);
				
			})
			.error(function (data) {
				console.log('Error:' + data);
			});
	};

}


/**
 * A google map / GPS controller.
 */
MapApp.controller('GpsCtrl', ['$scope','$http','$ionicPlatform', '$location',
	function($scope,$http, $route, $window,$ionicPlatform, $ionicLoading, $location) {

			//$location.url('/map/home');
	//	$ionicPlatform.ready(function() {
		//$scope.$on({reload: true});
		//$state($state.current, {}, {reload: true});
		$scope.races = {};
		var races, poly, map, markers;
		// init gps array
		$scope.whoiswhere = [];
		$scope.basel = {lat: 41.3868765, lon: 2.1700207};
		// geo-coding
		$scope.search = "";
		var infowindow;
		var currentMarkers;
		var callbackName = 'InitMapCb';
		/* $scope.$on( "$ionicView.enter", function( scopes, states ) {
			google.maps.event.trigger( map, 'resize' );
		});*/
		//$ionicPlatform.ready(function()  {
			//$ionicLoading.ready(function() {
		var directionsDisplay;
		var directionsService = new google.maps.DirectionsService();
		var inticor, start, end ;

		function initialize() {
			var mapOptions = {
				zoom: 13,
				center: new google.maps.LatLng(47.55, 7.59),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				panControl: true,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: false,
				refresh: true,
				streetViewControl: true,
				navigationControl: true,
				disableDefaultUI: true,
				overviewMapControl: true,
				addressControlOptions: {
					position: google.maps.ControlPosition.BOTTOM_CENTER
				}

			};


		/*	directionsDisplay = new google.maps.DirectionsRenderer();
			var inticor= new google.maps.LatLng("Your Lat Long here");
			map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);
			directionsDisplay.setMap(map);
			calcRoute();
			*/
			// Add a listener for the click event
			google.maps.event.addListener(map, 'click', addLatLng);
		}

		google.maps.event.addDomListener(window, 'load', initialize);
		// Add a listener for the click event+
/*
		function calcRoute() {
			alert("calculando ruta...");
			var start = (41.386608, 2.16402);
			var end = (41.3886325,2.168484);
			var request = {
				origin:start,
				destination:end,
				travelMode: google.maps.TravelMode.WALKING
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					alert("in");
					directionsDisplay = new google.maps.DirectionsRenderer();
					directionsDisplay.setMap(map);
					directionsDisplay.setDirections(response);
				}
			});
		}
		*/

		navigator.geolocation.getCurrentPosition(function (position) {
			//$scope.position=position;
			var c = position.coords;
			$scope.gotoLocation(c.latitude, c.longitude);
			$scope.$apply();
		}, function (e) {
			console.log("Error retrieving position " + e.code + " " + e.message)
		});
		$scope.gotoLocation = function (lat, lon) {
			if ($scope.lat != lat || $scope.lon != lon) {
				$scope.basel = {lat: lat, lon: lon};
				// to be user as markers, objects should have "lat", "lon", and "name" properties
				$scope.whoiswhere = [ //marker
					{
						"name": "You are here!",
						"lat": $scope.basel.lat,
						"lon": $scope.basel.lon

					}
				];

				if (!$scope.$$phase) $scope.$apply("basel");

			}
		};

		$scope.centerOnMe = function() {

			alert("centrando");

		}


		$http.get(URL + 'race', $scope).success(function (data) {

				races = data;
				angular.forEach(races, function (race) {
					$scope.objects = race;
					$scope.Name = race.Name;
					$scope.Distance = race.Distance;
					$scope.Level = race.Level;
					$scope.Date = race.Date;
					$scope.LocationIniLng = race.LocationIni.Lng;
					$scope.LocationIniLtd = race.LocationIni.Ltd;
					goto(race);
				//	localizarte(position);
					console.log($scope.LocationIniLng);
					console.log($scope.LocationIniLtd);


				});
			});

			function goto(race) {
				navigator.geolocation.getCurrentPosition(function (position) {
					//	for (var i = 0; i < 2; i++) {

					var lat = race.LocationIni.Lng;
					var lon = race.LocationIni.Ltd;
					var name = race.Name;
					gotolocation2(lat, lon, name);
					$scope.$apply();
					//}
				}, function (e) {
					console.log("Error retrieving position " + e.code + " " + e.message)
				});
				function gotolocation2(lat, lon, name) {
					//alert (lat);
					//alert(lon);
					//alert(name);
					if ($scope.lat != lat || $scope.lon != lon) {
						$scope.basel = {

							lat: lat,
							lon: lon,
							name: name
						};

						// to be user as markers, objects should have "lat", "lon", and "name" properties
						$scope.whoiswhere = [ //marker
							{
								"name": $scope.basel.name,
								"lat": $scope.basel.lat,
								"lon": $scope.basel.lon

							}

						];
						if (!$scope.$$phase) $scope.$apply("basel");
					}
				}
			}
			//Obtener carreras html
			$http.get(URL + 'race').success(function (data) {
				$scope.races = data;
				console.log(data);
			})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		//});

	}

]);

/********************************************************************************
 // formats a number as a latitude (e.g. 40.46... => "40°27'44"N")
 MapApp.filter('lat', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ns = input > 0 ? "N" : "S";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ns;
    }
});
 // formats a number as a longitude (e.g. -80.02... => "80°1'24"W")
 MapApp.filter('lon', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ew = input > 0 ? "E" : "W";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ew;
    }
});
 ****************************************************************************/

/**
 * Handle Google Maps API V3+
 */
// - Documentation: https://developers.google.com/maps/documentation/
MapApp.directive("appMap", function ($window) {
	return {
		restrict: "E",
		replace: true,
		template: "<div></div>",
		scope: {
			center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
			markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
			width: "@",         // Map width in pixels.
			height: "@",        // Map height in pixels.
			zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
			mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
			panControl: "@",    // Whether to show a pan control on the map.
			zoomControl: "@",   // Whether to show a zoom control on the map.
			scaleControl: "@"   // Whether to show scale control on the map.
		},
		link: function (scope, element, attrs) {
			var toResize, toCenter;
			var map;
			var infowindow;
			var currentMarkers;
			var callbackName = 'InitMapCb';

			//Obtener la posicion y centrar
			navigator.geolocation.getCurrentPosition(function(pos) {
				map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
			}, function(error) {
				alert('Unable to get location: ' + error.message);
			});

			// callback when google maps is loaded
			$window[callbackName] = function() {
				console.log("map: init callback");
				createMap();
				updateMarkers();
			};

			if (!$window.google || !$window.google.maps ) {
				console.log("map: not available - load now gmap js");
				loadGMaps();
			}
			else
			{
				console.log("map: IS available - create only map now");
				createMap();
			}
			function loadGMaps() {
				console.log("map: start loading js gmaps");
				var script = $window.document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBhqvXyPtM34PhEzbv90sLahqSwQa1cH1A&sensor=true&callback=InitMapCb';
				//clave google para luego: AIzaSyBhqvXyPtM34PhEzbv90sLahqSwQa1cH1A
				$window.document.body.appendChild(script);
			}

			function createMap() {
				console.log("map: create map start");
				var mapOptions = {
					zoom: 17,
					center: new google.maps.LatLng(47.55, 7.59),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: false,
					streetViewControl: true,
					navigationControl: true,
					disableDefaultUI: true,
					overviewMapControl: true,
					addressControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_CENTER
					}
				};
				if (!(map instanceof google.maps.Map)) {
					console.log("map: create map now as not already available ");
					map = new google.maps.Map(element[0], mapOptions);
					// EDIT Added this and it works on android now
					// Stop the side bar from dragging when mousedown/tapdown on the map
					google.maps.event.addDomListener(element[0], 'mousedown', function(e) {
						e.preventDefault();
						return false;
					});
					infowindow = new google.maps.InfoWindow();
				}
			}

			scope.$watch('markers', function() {
				updateMarkers();
			});

			// Info window trigger function
			function onItemClick(pin, label, datum, url, member) {
				// Create content
				var contentString = label + "<br />" + "lat: " + pin.position.A + "<br />" + "lon: " + pin.position.F ;
				console.log(datum);
				console.log(url);
				console.log(pin);
				// "Name: " + label;
				//+ "<br />" +"Time: " + datum;
				// Replace our Info Window's content and position
				infowindow.setContent(contentString);
				infowindow.setPosition(pin.position);
				infowindow.open(map);
				google.maps.event.addListener(infowindow, 'closeclick', function() {
					//console.log("map: info windows close listener triggered ");
					infowindow.close();
				});
			}

			function markerCb(marker, member, location) {
				return function() {
					//console.log("map: marker listener for " + member.name);
					var href="https://maps.apple.com/?q="+member.lat+","+member.lon;
					map.setCenter(location);
					onItemClick(marker, member.name, member.date, href);
					//console.log(member);
				};
			}

			// update map markers to match scope marker collection
			function updateMarkers() {
				if (map && scope.markers) {
					//create new markers
					console.log("map: make markers ");
					currentMarkers = [];
					var markers = scope.markers;
					if (angular.isString(markers)) markers = scope.$eval(scope.markers);
					for (var i = 0; i < markers.length; i++) {
						var m = markers[i];
						var loc = new google.maps.LatLng(m.lat, m.lon);
						var mm = new google.maps.Marker({
							position: loc,
							map: map,
							title: m.name,
							//animation: google.maps.Animation.DROP,
							//animation: google.maps.Animation.BOUNCE,
							icon: 'http://putopoetayonqui.files.wordpress.com/2010/03/icono-running-mini-36x361.png'
						});
						//console.log("map: make marker for " + m.name);
						google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
						currentMarkers.push(mm);
					}
				}
			}

			// convert current location to Google maps location
			function getLocation(loc) {
				if (loc == null) return new google.maps.LatLng(40, -73);
				if (angular.isString(loc)) loc = scope.$eval(loc);
				return new google.maps.LatLng(loc.lat, loc.lon);
			}

		} // end of link:
	}; // end of return
});