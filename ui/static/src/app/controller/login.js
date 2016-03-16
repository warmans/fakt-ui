define([], function () {

    function controller(CONFIG, $scope, $http, $location) {
        $scope.user = {username: "", password: ""};
        $scope.login = function(user) {
            $http({method: 'POST', url: CONFIG.api+'/login', data: user})
            .then(function successCallback(response) {
                $location.path('/').replace();
            }, function errorCallback(response) {
                console.log("FAILED", response)
            });

        };
    }

    controller.$inject=['CONFIG', '$scope', '$http', '$location'];

    return controller;
});
