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
            },
            searchPeriodFromText: function(p) {
                if (p == "yesterday") {
                    return {from: moment().subtract(1, "day").format("YYYY-MM-DD"), to: moment().format("YYYY-MM-DD"), deleted: 1};
                }
                if (p == "day") {
                    return {from: moment().format("YYYY-MM-DD"), to: moment().add(1, "days").format("YYYY-MM-DD"), deleted: 0};
                }
                if (p == "weekend") {
                    return {from: moment().add(1, "weeks").startOf('week').subtract(2, "days").format("YYYY-MM-DD"), to: moment().add(1, "weeks").startOf('week').add(1, 'days').format("YYYY-MM-DD"), deleted: 0};
                }
                if (p == "week") {
                    return {to: moment().add(1, "week").format("YYYY-MM-DD"), deleted: 0};
                }
                if (p == "month") {
                    return {to: moment().add(1, "month").format("YYYY-MM-DD"), deleted: 0};
                }
                return {to: null, deleted: 0} //all
            }
        };
    };

    factory.$inject=[];

    return factory;
});