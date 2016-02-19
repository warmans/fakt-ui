define([], function () {

    function controller($scope, $http) {

        $scope.search = {
            keyword: "",
            period: "week",
            periodDate: function() {
                var p = $scope.search.period
                if (p == "day") {
                    return moment().add(1, "days").format("YYYY-MM-DD");
                }
                if (p == "week") {
                    return moment().add(7, "days").format("YYYY-MM-DD");
                }
                if (p == "month") {
                    return moment().add(30, "days").format("YYYY-MM-DD");
                }
                return ""
            }
        };

        $scope.dateToDay = function(raw) {
            var date = new Date(raw)
            return date.toISOString().slice(0, 10)
        };
        $scope.events = [];

        var getData = function() {
            $http({method: 'GET', url: 'http://88.80.184.89/api/v1/event', params: {to: $scope.search.periodDate()}})
            .then(function successCallback(response) {
                $scope.events = response.data.payload
            }, function errorCallback(response) {
                console.log(response)
            });
        }
        getData();

        $scope.$watch('search.period', function(newVal, oldVal) {
            if (newVal == oldVal) {
                return;
            }
            getData();
        })
    }

    controller.$inject=['$scope', '$http'];

    return controller;
});
