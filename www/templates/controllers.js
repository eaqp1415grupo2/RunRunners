s'use strict';
var MapApp = angular.module('MapApp', ['ionic']);
var token=window.localStorage.token;
console.log('token '+token);

var URL='https://localhost:3030/';
//var groupid='555db5a80a9995be10000009';
/**
 * Routing table including associated controllers.
 */
MapApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('menu', {url: "/map", abstract: true, templateUrl: "/templates/menu.html"})
		.state('menu.home', {url: '/home', views: {'menuContent': {templateUrl: '/templates/map.html', controller: 'GpsCtrl'} }  })
		.state('menu.groups', {url: '/groups', views: {'menuContent': {templateUrl: '/templates/groups.html', controller: 'GroupsCtrl'} }  })
		.state('menu.group', {url: '/group/:groupId',views: {'menuContent': {templateUrl: "templates/group.html",controller: 'GroupCtrl'}}})
		.state('menu.races', {url: '/races', views: {'menuContent': {templateUrl: '/templates/races.html', controller: 'RacesCtrl'} }  })
		.state('menu.race', {url: "/race/:raceId",views: {'menuContent': {templateUrl: "templates/race.html",controller: 'RaceCtrl'}}})
		.state('menu.profile', {url: '/profile', views: {'menuContent': {templateUrl: '/templates/profile.html', controller: 'ProfileCtrl'} }  })
		//.state('menu.logout', {url: '../', views: {'menuContent': { controller: 'MainCtrl'} }  })
		.state('menu.stats',{url: '/stats', views: {'menuContent': {templateUrl: '/templates/stats.html', controller: 'StatsCtrl'} }  });
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/map/home');
}]);

MapApp.service("GroupsService",["$http", "$log", GroupsService ]);
MapApp.service("GroupMessageService",["$http", "$log", "$stateParams",GroupMessageService ]);

MapApp.controller("GroupsCtrl",["$scope", "$http","$ionicLoading", "GroupsService", "$log", GroupsCtrl]);
MapApp.controller("GroupCtrl",["$scope", "$http","$stateParams","$ionicLoading", "GroupMessageService", "$log", GroupCtrl]);                          


MapApp.service("RacesService",["$http", "$log", RacesService ]);
MapApp.service("RaceMessageService",["$http", "$log", "$stateParams",RaceMessageService ]);

MapApp.controller("RacesCtrl",["$scope", "$http","$ionicLoading", "RacesService", "$log", RacesCtrl]);
MapApp.controller("RaceCtrl",["$scope", "$http","$stateParams","$ionicLoading", "RaceMessageService", "$log", RaceCtrl]);  
/**
 * HEADER - handle menu toggle
 */
MapApp.controller('MainCtrl', function($scope, $http) {

});

MapApp.controller('StatsCtrl', function($scope, $http) {

});

MapApp.controller('ProfileCtrl', ['$scope', function($scope) {

}]);

MapApp.controller('GpsCtrl', ['$scope','$http','$ionicPlatform', '$location',
	function($scope,$http, $ionicPlatform, $location) {

	 $scope.races = {};
	// init gps array
    $scope.whoiswhere = [];
    $scope.basel = { lat: 47.55633987116614, lon: 7.576619513223015 };

    // check login code
	$ionicPlatform.ready(function() {	navigator.geolocation.getCurrentPosition(function(position) {
		    $scope.position=position;
	        var c = position.coords;
	        $scope.gotoLocation(c.latitude, c.longitude);
		    $scope.$apply();
		    },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
	    $scope.gotoLocation = function (lat, lon) {
	        if ($scope.lat != lat || $scope.lon != lon) {
	            $scope.basel = { lat: lat, lon: lon };
	            if (!$scope.$$phase) $scope.$apply("basel");
			}
		};
	//Obtener carreras
	$http.get(URL+'race').success(function(data) {
		$scope.races = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});





		// some points of interest to show on the map
		// to be user as markers, objects should have "lat", "lon", and "name" properties
		$scope.whoiswhere = [
			{ "name": "My Marker", "lat": $scope.basel.lat, "lon": $scope.basel.lon }
		];
	});

}




]);

/**
 * Group CONTROLLERS 
 */
function GroupCtrl($scope, $http, $stateParams ,$ionicLoading, GroupMessageService, $log) {
    $scope.messages = [];
    console.log($stateParams);
    $scope.groupId=$stateParams.groupId;

	$http.get(URL+'message/parent/'+$stateParams.groupId).success(function(data) {
		$scope.messages = data;
		console.log(data);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});	         		
}


function GroupsCtrl($scope,$http, $ionicLoading, GroupsService, $log) {
    $scope.owngroups = []; 
    $scope.othergroups = [];
    
        	//Obtener Grupos propios
	$http.get(URL+'groups/no/'+token).success(function(data) {
		$scope.owngroups = data;
		console.log('own G:'+$scope.owngroups);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
    
            	//Obtener Otros Grupos
	$http.get(URL+'groups/no/'+token).success(function(data) {
		$scope.othergroups = data;
			console.log('other G:'+data);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
    /*$scope.infiniteLoad = false;
    $scope.loadGroups = function() {
		GroupsService.loadGroups()
		     .success(function(result) {
				$scope.groups=result;
      console.log($scope.groups);
                      $ionicLoading.hide();
      });
    }*/
}


//Unused
function GroupsService($http, $log) {
    this.loadGroups = function() {
        return ($http.get(URL+'groups'));
    }
}

function GroupMessageService($http, $log,$stateParams) {
        this.loadGroupMessages = function() {     
        return ($http.get(URL+'js/testData/messages.json'));
        //return ($http.get(URL+'message/parent/'+$stateParams.groupId));
    }
}


function RaceCtrl($scope, $http, $stateParams ,$ionicLoading, RaceMessageService, $log) {
    $scope.messages = [];
    console.log($stateParams);
    $scope.raceId=$stateParams.raceId;

	$http.get(URL+'message/parent/'+$stateParams.raceId).success(function(data) {
		$scope.messages = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});	          		
}


function RacesCtrl($scope, $http ,$ionicLoading, $log) {
    $scope.ownraces = []; 
    $scope.otherraces = []; 
   
       	//Obtener carreras propias
	$http.get(URL+'race/user/'+token).success(function(data) {
		$scope.ownraces = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	
	    	//Obtener otras carreras
	$http.get(URL+'race/no/'+token).success(function(data) {
		$scope.otherraces = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	
	
	/*
    	//Obtener carreras propias
	$http.get(URL+'race').success(function(data) {
		$scope.ownraces = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	
	    	//Obtener otras carreras
	$http.get(URL+'race').success(function(data) {
		$scope.otherraces = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
    /*$scope.infiniteLoad = false;
    
    $scope.loadRaces = function() {
		RacesService.loadRaces()
		     .success(function(result) {
				$scope.races=result;
      console.log($scope.races);
                      $ionicLoading.hide();
      });
    }*/
}

//Unused
function RacesService($http, $log) {
    this.loadRaces = function() {
        return ($http.get(URL+'race'));
    }
}
//return ($http.get(URL+'message/parent/'+$stateParams.raceId));
function RaceMessageService($http, $log,$stateParams) {
	console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
        this.loadRaceMessages = function() {     
        return ($http.get(URL+'js/testData/messages.json'));
            }
}
/*
function GroupsCtrl($scope, $sce, $ionicLoading, GroupsService, $log) {
    $scope.groups = [];
    $scope.infiniteLoad = false;
    
    $scope.viewBlog = function(url) {        
        window.open(url, "_blank", "location=no");        
    }
    $scope.loadGroups = function() {
        $scope.infiniteLoad = false; 
        console.log($scope.groups.length);   
        if ($scope.groups.length) { 
            $scope.groups = [];
            $scope.moreGroups();
        }        
        $scope.$broadcast("scroll.refreshComplete");
        $scope.infiniteLoad = true; 
        $scope.moreGroups();
    }
    $scope.moreGroups = function() {    
        $ionicLoading.show({ template: "Loading Groups..."});
        GroupsService.loadGroups()
            .success(function(result) {
                $scope.groups = $scope.groups.concat(result.groups);
                $scope.$broadcast("scroll.infiniteScrollComplete");   
                $ionicLoading.hide();
            });
    }
    $scope.toTrusted = function(text) {
        return ($sce.trustAsHtml(text));
    }
}

function GroupsService($http, $log) {
    this.loadGroups = function() {
        return ($http.get('https://localhost:3030/groups'));
    }
}
*/

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
				script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
				$window.document.body.appendChild(script);
				}

			function createMap() {
				console.log("map: create map start");
				var mapOptions = {
					zoom: 15,
					center: new google.maps.LatLng(47.55, 7.59),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: false,
					streetViewControl: false,
					navigationControl: true,
					disableDefaultUI: true,
					overviewMapControl: true
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
			function onItemClick(pin, label, datum, url) { 
				// Create content  
				var contentString = "Name: " + label + "<br />Time: " + datum;
				// Replace our Info Window's content and position
				infowindow.setContent(contentString);
				infowindow.setPosition(pin.position);
				infowindow.open(map)
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
					};
				}

			// update map markers to match scope marker collection
			function updateMarkers() {
				if (map && scope.markers) {
					// create new markers
					//console.log("map: make markers ");
					currentMarkers = [];
					var markers = scope.markers;
					if (angular.isString(markers)) markers = scope.$eval(scope.markers);
					for (var i = 0; i < markers.length; i++) {
						var m = markers[i];
						var loc = new google.maps.LatLng(m.lat, m.lon);
						var mm = new google.maps.Marker({ position: loc, map: map, title: m.name });
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



