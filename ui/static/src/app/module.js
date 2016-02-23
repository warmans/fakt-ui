define([
    './factory/dates',
    './controller/events',
],
function (dateHelper, eventsController) {

    var app = angular.module('sfui', ['ngRoute', 'cgBusy']);

    //module config
    app.config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/events', {
                templateUrl: '/ui/src/app/view/events.html',
                controller: 'eventsController',
                reloadOnSearch: false
            })
            .otherwise({redirectTo: '/events'});
    }]);

    angular.module('sfui').value('cgBusyDefaults',{
        message: "Loading...",
        templateUrl: '/ui/src/app/view/partial/angular-busy.html',
        backdrop: false,
    });

    //register factories
    app.factory('dateHelper', dateHelper);

    //register controllers
    app.controller('eventsController', eventsController);
});
