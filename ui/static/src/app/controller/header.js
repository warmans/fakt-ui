define([], function () {

    function controller(CONFIG, $scope, $location, $http, notify, me) {

        $scope.me = me;
        $scope.notify = notify;

        $scope.getClass = function (path) {
          return ($location.path().substr(0, path.length) === path) ? 'active' : '';
        }

        $scope.logout = function(user) {
            $http({method: 'POST', url: CONFIG.api+'/logout', data: user})
            .then(function successCallback(response) {
                $scope.me = {user: null};
            }, notify.handleHttpErr);
        };
    }

    controller.$inject=['CONFIG', '$scope', '$location', '$http', 'notify', 'me'];

    return controller;
});
