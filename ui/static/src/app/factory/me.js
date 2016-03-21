define([], function(){

    function factory(CONFIG, $http, notify) {

        var me = {
            user: {id: null, username: null},
            update: function(user) {
                me.user = user;
            }
        };

        $http({method: 'GET', url: CONFIG.api+'/me'})
        .then(function successCallback(response) {
            me.user = response.data.payload;
        }, function errorCallback(response) {
            if (response.status != 403 && response.status != 200) {
                notify.handleHttpErr(response);
            }
        });

        return me;
    };

    factory.$inject=["CONFIG", "$http", 'notify'];
    return factory;
});