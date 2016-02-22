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
            return d.format("dddd Do MMM h:mma");
        };
    })

    app.filter('fromnow', function() {
        return function(input) {
            var d = moment(input, moment.ISO_8601);
            return d.fromNow();
        };
    })

    app.filter('zerotime', function() {
        return function(input) {
            var d = moment(input, moment.ISO_8601);
            d.set({hour: 0, minute: 0, second: 0});
            return d;
        };
    })

    app.filter('caldate', function() {
    moment.locale('en', {
        'calendar' : {
            'lastDay' : '[Yesterday]',
             'sameDay' : '[Today]',
            'nextDay' : '[Tomorrow]',
            'lastWeek' : '[Last] dddd',
            'nextWeek' : '[This] dddd',
            'sameElse' : 'L'
       }
    });
        return function(input) {
            var d = moment(input, moment.ISO_8601);
            return d.calendar();
        };
    })

    //register controllers
    app.controller('indexController', indexController);
});
