define([], function () {

    function controller(CONFIG, $scope, $http, $location, notify, me) {

        $scope.user = me.user;
        $scope.disableButtons = false;
        $scope.promises = {};

        $scope.submit = function(action, user) {
            if (!user.username || !user.password) {
                notify.warning("Missing username or password");
                return;
            }
            $scope.disableButtons = true;

            $scope.promises.login = $http({method: 'POST', url: CONFIG.api+'/'+action, data: user}).then(
                function successCallback(response) {
                    if (response.data.payload != null && response.status == 200) {
                        me.update(response.data.payload);
                        $location.path('/').replace();
                        return;
                    }
                    notify.handleHttpErr(response);
                },
                notify.handleHttpErr
            ).finally(function(){
                $scope.disableButtons = false;
            });
        };
    }

    controller.$inject=['CONFIG', '$scope', '$http', '$location', 'notify', 'me'];

    return controller;
});
