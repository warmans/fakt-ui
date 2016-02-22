define([], function () {

    function controller($scope, $http) {

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
                    return {from: moment().add(1, "month").format("YYYY-MM-DD"), deleted: 0};
                }
                return {to: null, deleted: 0} //all
            }
        };

        $scope.dateToDay = function(raw) {
            var date = new Date(raw)
            return date.toISOString().slice(0, 10)
        };
        $scope.events = [];
        $scope.eventTypes = [];

        var getData = function() {
            $http({method: 'GET', url: 'http://88.80.184.89/api/v1/event', params: angular.extend({type: $scope.search.type}, $scope.search.periodQuery())})
            .then(function successCallback(response) {
                $scope.events = response.data.payload;
                //todo: hack to get a event type listing. Should be a serverside call with types ordered by num occurrences.
                if ($scope.eventTypes.length === 0) {
                    angular.forEach($scope.events, function(ev) {
                        if ($scope.eventTypes.indexOf(ev.type) === -1) {
                            $scope.eventTypes.push(ev.type);
                        }
                    });
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

    controller.$inject=['$scope', '$http'];

    return controller;
});
