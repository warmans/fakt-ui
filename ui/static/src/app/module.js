define([
    './factory/dates',
    './factory/me',
    './factory/notify',

    './controller/header',
    './controller/login',
    './controller/events',
    './controller/events/event',

    './directive/tags/tags'
],
function (dateHelper, me, notify, headerController, loginController, eventsController, eventController, eventTagsDirective) {

    var app = angular.module('sfui', ['ngRoute', 'cgBusy']);

    app.constant("CONFIG", {"api": "/api/v1"});

    //module config
    app.config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/login', {
                templateUrl: '/src/app/view/login.html',
                controller: 'loginController',
                reloadOnSearch: false
            })
            .when('/events/:event_id', {
                templateUrl: '/src/app/view/events/event.html',
                controller: 'eventController',
                reloadOnSearch: false
            })
            .when('/events', {
                templateUrl: '/src/app/view/events.html',
                controller: 'eventsController',
                reloadOnSearch: false,
                data: {queryContext: {}}
            })
            .when('/my/events', {
                templateUrl: '/src/app/view/events.html',
                controller: 'eventsController',
                reloadOnSearch: false,
                data: {
                    queryContext: {tag: "like", me_only: true}
                }
            })
            .otherwise({redirectTo: '/events'});
    }]);

    app.value('cgBusyDefaults',{
        message: "Loading...",
        templateUrl: '/src/app/view/partial/angular-busy.html',
        backdrop: true,
    });

    //register directives
    app.directive('eventTags', eventTagsDirective);

    //register factories
    app.factory('dateHelper', dateHelper);
    app.service('me', me);
    app.service('notify', notify);

    //register controllers
    app.controller('eventsController', eventsController);
    app.controller('eventController', eventController);
    app.controller('loginController', loginController);
    app.controller('headerController', headerController);
});
