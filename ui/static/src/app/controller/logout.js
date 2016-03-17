define([], function () {

    function controller(CONFIG, $scope, $http, $location) {
        $scope.user = {username: "", password: ""};

    }

    controller.$inject=['CONFIG', '$scope', '$http', '$location'];

    return controller;
});
