define([
    './factory/dates',
    './controller/index',
],
function (dateHelper, indexController) {

    var app = angular.module('sfui', ['ngRoute', 'cgBusy']);

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

    angular.module('sfui').value('cgBusyDefaults',{
        message: "Loading...",
        templateUrl: '/ui/src/app/view/partial/angular-busy.html',
        backdrop: false,
    });

    //register factories
    app.factory('dateHelper', dateHelper);

    //register controllers
    app.controller('indexController', indexController);
});
