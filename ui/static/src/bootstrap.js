require([
        'app/module'
    ],
    function() {
        angular.bootstrap(document, ['sfui']);

        //hacky fix for slow transition animations in bootstrap.
        $.support.transition = false;
    }
);