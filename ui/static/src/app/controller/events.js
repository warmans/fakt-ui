define([], function () {

    function controller(CONFIG, $route, $scope, $http, $location, dateHelper, notify, me) {
        $scope.dateHelper = dateHelper;
        $scope.keywordFilter = "";
        $scope.search = {
            period: $location.search().period || "week",
            type: $location.search().type || "",
            tag: $route.current.$$route.data.queryContext.tag != undefined ? $route.current.$$route.data.queryContext.tag : "",
            tag_user: $route.current.$$route.data.queryContext.me_only == true ? me.user.username  : "",
        };
        $scope.eventTypes = [];
        $scope.events = [];

        $scope.eventImage = function(event) {
            if (!event.performer) {
                return "";
            }
            for (i=0; i<event.performer.length; i++) {
                if (event.performer[i].img != "" && event.performer[i].img != null) {
                    return event.performer[i].img;
                }
            }
        }

        if ($scope.eventTypes.length === 0) {
            $scope.eventUpdatePromise = $http({method: 'GET', url: CONFIG.api+'/event_type'})
            .then(function successCallback(response) {
                angular.forEach(response.data.payload, function(type) {
                    if ($scope.eventTypes.indexOf(type) === -1) {
                        $scope.eventTypes.push(type);
                    }
                });
            }, notify.handleHttpErr);
        }

        var refreshEventData = function() {
            $scope.eventUpdatePromise = $http({method: 'GET', url: CONFIG.api+'/event', params: angular.extend($scope.search, dateHelper.searchPeriodFromText($scope.search.period))})
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

            }, notify.handleHttpErr);
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

    controller.$inject=['CONFIG', '$route', '$scope', '$http', '$location', 'dateHelper', 'notify', 'me'];

    return controller;
});
