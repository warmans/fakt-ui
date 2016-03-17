define([], function () {

    function controller(CONFIG, $scope, $location, $http, me) {
        $scope.me = me;

        $scope.getClass = function (path) {
          return ($location.path().substr(0, path.length) === path) ? 'active' : '';
        }

        $scope.logout = function(user) {
            $http({method: 'POST', url: CONFIG.api+'/logout', data: user})
            .then(function successCallback(response) {
                $scope.me = {user: null};
            }, function errorCallback(response) {
                console.log("FAILED", response)
            });
        };
    }

    controller.$inject=['CONFIG', '$scope', '$location', '$http', 'me'];

    return controller;
});
