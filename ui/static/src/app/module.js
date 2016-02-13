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

    //register controllers
    app.controller('indexController', indexController);
});
