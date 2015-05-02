//Angular App Module and Controller
angular.module('mapsApp', [])
.controller('MapCtrl', function ($scope) {

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(41.388135, 2.168878),
        mapTypeId: google.maps.MapTypeId.SATELLITE
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.race
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        marker.dist= info.dist + ' km';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content+'distancia: '+'<h1>'+marker.dist+'</h1>');
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  
    
    for (i = 0; i < races.length; i++){
        createMarker(races[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

});

//Data
var races = [
    {
        race : 'Carrera C/ Valencia',
        desc : 'Carrera dede C/ Valencia - Girona fins Pl. Glories',
        dist: 4,
        lat : 41.396506,
        long : 2.168235
    },
    {
        race : 'Gran Via - Urgell',
        desc : 'Fins WTC',
        dist: 5,
        lat : 41.382996, 
        long : 2.159550
    },
    {
        race : 'Carrera del Raval',
        desc : 'Carrera Urbana',
        dist: 6,
        lat : 41.378323, 
        long : 2.173524
    },
    {
        race : "Portal de l'Angel",
        desc : 'Carrera 4 Lorem Ipsum',
        dist: 5,
        lat : 41.386076, 
        long : 2.172547
    },
    {
        race : 'Tibidabo',
        desc : 'Per la Muntanya',
        dist: 10,
        lat : 41.410341, 
        long : 2.136809
    },
    {
        race : 'LH-Carrera C/ Valencia',
        desc : 'Carrera dede C/ Valencia - Girona fins Pl. Glories',
        dist: 4,
        lat : 41.396506,
        long : 2.068235
    },
    {
        race : 'LH-Gran Via - Urgell',
        desc : 'Fins WTC',
        dist: 5,
        lat : 41.382996, 
        long : 2.059550
    },
    {
        race : 'LH-Carrera del Raval',
        desc : 'Carrera Urbana',
        dist: 6,
        lat : 41.378323, 
        long : 2.073524
    },
    {
        race : "LH-Portal de l'Angel",
        desc : 'Carrera 4 Lorem Ipsum',
        dist: 5,
        lat : 41.386076, 
        long : 2.072547
    },
    {
        race : 'LH-Tibidabo',
        desc : 'Per la Muntanya',
        dist: 10,
        lat : 41.410341, 
        long : 2.036809
    }
];