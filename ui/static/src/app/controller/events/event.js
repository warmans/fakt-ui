define([], function () {

    function controller($scope, $routeParams, $http, dateHelper) {

        var refreshEventData = function() {
            $scope.eventUpdatePromise = $http({method: 'GET', url: 'http://api.fakt.pw/api/v1/event', params: {event: $routeParams.event_id, deleted: 1}})
            .then(function successCallback(response) {
                $scope.event = {};
                if (response.data.payload.length > 0) {
                    $scope.event = response.data.payload[0];
                    $scope.event.datePretty = dateHelper.format($scope.event.date);
                    $scope.event.dateCalendar = dateHelper.calendar($scope.event.date);
                    $scope.event.dateFromNow = dateHelper.fromNow($scope.event.date);
                }
            }, function errorCallback(response) {
                console.log("FAILED", response)
            });
        }
        refreshEventData();
    }

    controller.$inject=['$scope', '$routeParams', '$http', 'dateHelper'];

    return controller;
});
