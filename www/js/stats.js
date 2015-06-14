angular.module('stats.controller', [])

.controller('statsCtrl',function($scope, $http) {
    //var URL='https://192.168.1.139:3030/';
    //var URL='https://147.83.7.203:3030/';
    //var URL ='https://10.189.28.37:3030/';
    var URL='https://localhost:3030/';
    $scope.pendings = [{}];
    $scope.dones = [{}];
    $scope.graph = {};

    $http.get(URL+'user/validate/' + window.localStorage.token)
    .success(function (data) {

    })
    .error(function (data) {
        console.log('Error:' + data);
    });

    //Datos globales
    $scope.getstats = function () {
        $http.get(URL + 'user/stats/' + window.localStorage.token)
        .success(function (data) {
            $scope.globals = data;


        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    };

    //Carreras Pendientes
    $scope.getracespending = function () {
        $http.get(URL+'user/pending/' + window.localStorage.token)
            .success(function (data) {
                var pendientes = data;
                angular.forEach(pendientes, function(pendiente) {

                    angular.forEach(pendiente, function(carreras){
                        $scope.pendings.push(carreras);
                    })

                });


            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };

    //Gráfica de una Carrera Hecha
    $scope.grafica = function (done) {
        $scope.graph.data = [


            [0, done.Data.Distance]
            , [0, done.Data.Distance/done.Data.Time], [0, done.Data.Time]

        ];
        $scope.graph.labels = ['', done.Race];
        $scope.graph.series = ['Distance', 'Velocity', 'Time'];

    };

    //Devuelve las carreras Hechas
    $scope.getracesdone = function () {
        $http.get(URL+'user/done/' + window.localStorage.token)
        .success(function (data) {
            var hechas = data;

            angular.forEach(hechas, function(hecha) {

                console.log(hecha);
                console.log(hecha.Race);
                $scope.dones.push(hecha);
                $scope.graph.data = [


                    [0, hecha.Data.Distance ]
                    ,[0, hecha.Data.Distance/hecha.Data.Time], [0, hecha.Data.Time]

                ];
                $scope.graph.labels = ['', hecha.Race];
                $scope.graph.series = ['Distance', 'Velocity', 'Time'];
                //	angular.forEach(hecha, function(carreras){

                //		$scope.dones.push(carreras);
                //		console.log(carreras);
                //	})

            });
        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    };
});