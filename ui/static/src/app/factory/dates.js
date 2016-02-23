define([], function(){

    function factory() {

        moment.locale('en', {
            'calendar' : {
              'lastDay' : '[Yesterday]',
               'sameDay' : '[Today]',
              'nextDay' : '[Tomorrow]',
              'lastWeek' : '[Last] dddd',
              'nextWeek' : '[This] dddd',
              'sameElse' : 'DD.MM.YYYY'
            }
        });

        return {
            format: function(input) {
                return moment(input, moment.ISO_8601).format("dddd Do MMM h:mma");
            },
            fromNow: function(input) {
                var d = moment(input, moment.ISO_8601);
                return d.fromNow();
            },
            calendar: function(input) {
                var d = moment(input, moment.ISO_8601);
                return d.calendar();
            },
            isSameDay: function(a, b) {
                var aDate = new Date(a);
                var bDate = new Date(b);
                return (aDate.toISOString().slice(0, 10) === bDate.toISOString().slice(0, 10));
            }
        };
    };

    factory.$inject=[];

    return factory;
});