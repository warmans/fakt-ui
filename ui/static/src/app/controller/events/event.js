define([], function () {

    function controller(CONFIG, $scope, $routeParams, $http, dateHelper, notify) {

        $scope.event = {};
        $scope.performers = [];

        var refreshEventData = function() {
            $scope.eventUpdatePromise = $http({method: 'GET', url: CONFIG.api+'/event', params: {event: $routeParams.event_id, deleted: 1}})
            .then(function successCallback(response) {
                $scope.event = {};
                if (response.data.payload.length > 0) {
                    $scope.event = response.data.payload[0];
                    $scope.event.datePretty = dateHelper.format($scope.event.date);
                    $scope.event.dateCalendar = dateHelper.calendar($scope.event.date);
                    $scope.event.dateFromNow = dateHelper.fromNow($scope.event.date);

                    //fetch detailed performer data
                    var pIDs = [];
                    if ($scope.event.performer && $scope.event.performer.length > 0){
                        angular.forEach($scope.event.performer, function(perf) { pIDs.push(perf.id); });
                        $scope.performerUpdatePromise = $http({method: 'GET', url: CONFIG.api+'/performer', params: {performer: pIDs.join(",")}})
                        .then(function successCallback(response) {
                            $scope.performers = response.data.payload;
                        });
                    }
                }
            }, notify.handleHttpErr);
        }
        refreshEventData();
    }

    controller.$inject=['CONFIG', '$scope', '$routeParams', '$http', 'dateHelper', 'notify'];

    return controller;
});
