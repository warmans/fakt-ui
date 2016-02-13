define([], function () {

    function controller($scope, $http) {

        $scope.dateToDay = function(raw) {
            var date = new Date(raw)
            console.log(date)
            return date.toISOString().slice(0, 10)
        }
        $scope.events = []

        $http({method: 'GET', url: 'http://88.80.184.89/api/v1/event'})
        .then(function successCallback(response) {
            $scope.events = response.data.payload
        }, function errorCallback(response) {
            console.log(response)
        });
    }

    controller.$inject=['$scope', '$http'];

    return controller;
});
