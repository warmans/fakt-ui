define([], function () {

    function controller($scope, $http, dateHelper) {

        $scope.dateHelper = dateHelper;
        $scope.search = {
            keyword: "",
            period: "week",
            type: "",
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
                var eventTypes = [];

                angular.forEach(response.data.payload, function(event, k) {
                    //pre-process to avoid filters here so we don't end up with a billion watches/digests on long lists
                    event.datePretty = dateHelper.format(event.date);
                    event.dateCalendar = dateHelper.calendar(event.date);
                    event.firstInDay = (k == 0 || (false == dateHelper.isSameDay(event.date, events[k-1].date)));
                    events.push(event);
                });

                //todo: hack to get a event type listing. Should be a serverside call with types ordered by num occurrences.
                if ($scope.eventTypes.length === 0) {
                    angular.forEach(events, function(ev) {
                        if (eventTypes.indexOf(ev.type) === -1) {
                            eventTypes.push(ev.type);
                        }
                    });
                }

                //move to scope
                $scope.events = events;
                $scope.eventTypes = eventTypes;

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

    controller.$inject=['$scope', '$http', 'dateHelper'];

    return controller;
});
