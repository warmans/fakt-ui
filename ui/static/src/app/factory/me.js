define([], function(){

    function factory(CONFIG, $http) {

        var me = {
            user: {id: null, username: null},
        };

        $http({method: 'GET', url: CONFIG.api+'/me'})
        .then(function successCallback(response) {
            me.user = response.data.payload;
        }, function errorCallback(response) {
            console.log("FAILED", response)
        });

        return me;
    };

    factory.$inject=["CONFIG", "$http"];
    return factory;
});