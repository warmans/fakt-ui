define([
    './controller/index',
],
function (indexController) {

    var app = angular.module('sfui', ['ngRoute']);

    //module config
    app.config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/index', {
                templateUrl: '/ui/src/app/view/index.html',
                controller: 'indexController',
                reloadOnSearch: false
            })
            .otherwise({redirectTo: '/index'});
    }]);

    app.filter('fdate', function() {
        return function(input) {
            var d = moment(input, moment.ISO_8601);
            return d.format("YYYY-MM-DD h:mma");
        };
    })

    app.filter('fromnow', function() {
        return function(input) {
            var d = moment(input, moment.ISO_8601);
            return d.fromNow();
        };
    })

    //register controllers
    app.controller('indexController', indexController);
});
