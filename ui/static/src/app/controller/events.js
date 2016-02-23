define([], function () {

    function controller($scope, $http, $location, dateHelper) {

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

        var getData = function() {
            $scope.eventUpdatePromise = $http({method: 'GET', url: 'http://88.80.184.89/api/v1/event', params: angular.extend({type: $scope.search.type}, $scope.search.periodQuery())})
            .then(function successCallback(response) {

                var events = [];

                angular.forEach(response.data.payload, function(event, k) {
                    //pre-process to avoid filters here so we don't end up with a billion watches/digests on long lists
                    event.datePretty = dateHelper.format(event.date);
                    event.dateCalendar = dateHelper.calendar(event.date);
                    event.dateFromNow = dateHelper.fromNow(event.date);
                    events.push(event);
                });

                //todo: hack to get a event type listing. Should be a serverside call with types ordered by num occurrences.
                if ($scope.eventTypes.length === 0) {
                    angular.forEach(events, function(ev) {
                        if ($scope.eventTypes.indexOf(ev.type) === -1) {
                            $scope.eventTypes.push(ev.type);
                        }
                    });
                }
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
        getData();

        var queryWatcher = function(newVal, oldVal) {
              if (newVal == oldVal) {
                  return;
              }
              getData();
          };
        $scope.$watch('search.period', queryWatcher)
        $scope.$watch('search.type', queryWatcher)
    }

    controller.$inject=['$scope', '$http', '$location', 'dateHelper'];

    return controller;
});
