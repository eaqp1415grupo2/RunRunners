angular.module('maps.controller', [])

.controller('GpsCtrl',function($scope,$http, $stateParams, $ionicPopup, $ionicModal, $location) {

//No pongais las IP aqui las coge de controlles.js o de appApk.js asi no hay que cambiarlo en ningun .js 

    //$location.url('/map/home');
    //$ionicPlatform.ready(function() {
    //$scope.$on({reload: true});
    //$state($state.current, {}, {reload: true});
    $scope.races = {};
    var races, poly, map, markers;
    var geocoder;
    $scope.whoiswhere = [];
    $scope.basel = {lat: 41.3868765, lon: 2.1700207};

    function initialize() {
        //	geocoder = new google.maps.Geocoder();

        var mapOptions = {
            streetViewControl:true,
            center: new google.maps.LatLng(47.55, 7.59),
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        /*	directionsDisplay = new google.maps.DirectionsRenderer();
         var inticor= new google.maps.LatLng("Your Lat Long here");
         ;
         directionsDisplay.setMap(map);
         calcRoute();
         */
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        // Add a listener for the click event
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
    $scope.info = function (){
        alert("Para crear una carrera marca tu inicio y final de la misma en el mapa con el botón derecho")
    };
    /***********************************************************************************/
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
    };


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
                        "level": $scope.basel.level,
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
    /***********************************************************************************/

    $ionicModal.fromTemplateUrl('create.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModalRace = function () {
        $scope.modal.show();
    };


    $scope.okRace = function () {
        alert("creando carrera");
        var lat =0;
        var lng=0;
        var datos;
        var i;
        datos  = {
            Name: this.Name2,
            Level: this.Level2,
            Inicio: this.LocationIni,
            Final: this.LocationFin,
            Distancia: this.Distance2,
            Type: this.Type,
            _id: window.localStorage.token,
            Fecha: this.Fecha,
            Hora: this.Hora
        };
        codeAddress(datos);
        //console.log(datos);
        function codeAddress(datos) {
            var geocoder = new google.maps.Geocoder();

            var inicio = datos.Inicio;
            var final = datos.Final;
            //var locations = new Array("inicio", "final");
            alert(inicio);
            alert(final);
            //for(var i = 0; i < locations.length; i++) {
            geocoder.geocode({"address": inicio }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var location = results[0].geometry.location,
                        lat = location.lat(),
                        lng = location.lng();
                    geocoder.geocode({"address": final}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {

                            var location2 = results[0].geometry.location,
                                lat2 = location2.lat(),
                                lng2 = location2.lng();

                            alert("inicio " + location);
                            alert("final" + location2);

                            var datosfinales = {
                                Name: datos.Name,
                                Level: datos.Level,
                                LocationIni: {
                                    Lng: lat,
                                    Ltd: lng
                                },
                                LocationFin: {
                                    Lng: lat2,
                                    Ltd: lng2
                                },
                                Distance: datos.Distancia,
                                Type: datos.Type,
                                _id: datos._id,
                                Date: datos.Fecha,
                                Time: datos.Hora
                            };
                            console.log(datosfinales);
                            console.log("despues lng " + datosfinales.LocationIni.Lng);
                            console.log("despues ltd " + datosfinales.LocationIni.Ltd);

                            //cuando tenemos ya bien los datos hacemos el post
                            $http.post('race/', datosfinales)
                                .success(function (data) {
                                    //datosfinales.push(data);
                                    alert("acabas de crear carrera");
                                    console.log(datosfinales);
                                    $location.url('/map/home');
                                    $scope.modal.hide();
                                }).error(function (data) {
                                    console.log(datosfinales);
                                    console.log('Error: ' + datosfinales);
                                });


                        }
                    });
                }
            });

        }

    };

})

.directive("appMap", function ($window) {
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
                script.src = 'https://maps.googleapis.com/maps/api/js?v=3';
                // https://maps.googleapis.com/maps/api/js?v=3
                //clave google para luego: AIzaSyBhqvXyPtM34PhEzbv90sLahqSwQa1cH1A
                $window.document.body.appendChild(script);
            }

            function createMap() {
                console.log("map: create map start");
                var mapOptions = {
                    streetViewControl:true,
                    center: new google.maps.LatLng(47.55, 7.59),
                    zoom: 18,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
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
                google.maps.event.addListener(infowindow, 'closeclick', function() { //cierras marker
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
                            icon: '/img/marker.png'
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