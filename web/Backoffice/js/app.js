angular.module('MainApp', []);

function mainController($scope, $http) {
    $scope.newObject = {};
    $scope.objects = {};
    $scope.selected = false;

    $http.get('https://localhost:3030/race/').success(function(data) {

        $scope.objects = data;
        console.log(data);
    })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.deleteObject = function(newObject) {
        $http.delete('https://localhost:3030/race/' + $scope.newObject._id)
            .success(function(data) {
                $scope.newObject = {};
                $scope.selected = false;
                $scope.objects = null;

                $http.get('https://localhost:3030/race/').success(function(data) {
                    $scope.objects = data;
                })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });

            })
            .error(function(data) {
                console.log('Error: ' + data);
                window.alert('Error:' + data);
            });
    };

    $scope.createObject = function() {
        $http.post('https://localhost:3030/race/', $scope.newObject)
            .success(function(data) {
                $scope.newObject = {};
                $scope.objects.push(data);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
                window.alert('Error: ' + data);
            });
    };

    $scope.updateObject = function(newObject) {
        console.log(newObject);
        $http.put('https://localhost:3030/race/' + $scope.newObject._id, newObject)
            .success(function(data) {
                $scope.newObject = {}; // Borramos los datos del formulario

              //  $scope.objects = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                window.alert('Error:' + data);
            });
    };



    $scope.selectObject = function(object) {
        $http.get('https://localhost:3030/race/name/'+ object.Name).success(function(data) {
            $scope.newObject = data;
            console.log(data);
        })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $scope.newObject = object;
        $scope.selected = true;
        console.log($scope.newObject, $scope.selected);
    };

}
