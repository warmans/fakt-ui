define([], function () {

    function controller(CONFIG, $scope, $http, $location, dateHelper) {

        $scope.dateHelper = dateHelper;
        $scope.search = {
            keyword: "",
            period: $location.search().period || "week",
            type: $location.search().type || "",
            periodQuery: function() {
                var p = $scope.search.period
                if (p == "yesterday") {
                    return {from: moment().subtract(1, "day").format("YYYY-MM-DD"), to: moment().format("YYYY-MM-DD"), deleted: 1};
                }
                if (p == "day") {
                    return {to: moment().add(1, "days").format("YYYY-MM-DD"), deleted: 0};
                }
                if (p == "weekend") {
                    return {from: moment().add(1, "weeks").startOf('week').subtract(2, "days").format("YYYY-MM-DD"), to: moment().add(1, "weeks").startOf('week').add(1, 'days').format("YYYY-MM-DD"), deleted: 0};
                }
                if (p == "week") {
                    return {to: moment().add(1, "week").format("YYYY-MM-DD"), deleted: 0};
                }
                if (p == "month") {
                    return {to: moment().add(1, "month").format("YYYY-MM-DD"), deleted: 0};
                }
                return {to: null, deleted: 0} //all
            }
        };

        $scope.eventTypes = [];
        $scope.events = [];

        if ($scope.eventTypes.length === 0) {
            $scope.eventUpdatePromise = $http({method: 'GET', url: CONFIG.api+'/event_type'})
            .then(function successCallback(response) {
                angular.forEach(response.data.payload, function(type) {
                    if ($scope.eventTypes.indexOf(type) === -1) {
                        $scope.eventTypes.push(type);
                    }
                });
            }, function errorCallback(response) {
                console.log("FAILED", response)
            });
        }

        var refreshEventData = function() {
            $scope.eventUpdatePromise = $http({method: 'GET', url: CONFIG.api+'/event', params: angular.extend({type: $scope.search.type}, $scope.search.periodQuery())})
            .then(function successCallback(response) {

                var events = [];

                angular.forEach(response.data.payload, function(event, k) {
                    //pre-process to avoid filters here so we don't end up with a billion watches/digests on long lists
                    event.datePretty = dateHelper.format(event.date);
                    event.dateCalendar = dateHelper.calendar(event.date);
                    event.dateFromNow = dateHelper.fromNow(event.date);
                    events.push(event);
                });
                $scope.events = events;

                //on load complete propagate values to URI query
                $location.search('period', $scope.search.period);
                if ($scope.search.type != ""){
                    $location.search('type', $scope.search.type);
                }

            }, function errorCallback(response) {
                console.log("FAILED", response)
            });
        }
        refreshEventData();

        var queryWatcher = function(newVal, oldVal) {
              if (newVal == oldVal) {
                  return;
              }
              refreshEventData();
          };
        $scope.$watch('search.period', queryWatcher)
        $scope.$watch('search.type', queryWatcher)
    }

    controller.$inject=['CONFIG', '$scope', '$http', '$location', 'dateHelper'];

    return controller;
});
