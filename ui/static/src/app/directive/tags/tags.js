define([], function(){

    function directive(CONFIG, me, notify, $http) {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: "/src/app/directive/tags/tags.html",
            link: function (scope, elem, attrs, ngModelCtrl) {

                scope.me = me;
                scope.tagState = [
                    {value: "like", icon: "glyphicon-ok", count: 0, clicked: false, users: []},
                    {value: "meh", icon: "glyphicon-minus", count: 0, clicked: false, users: []},
                    {value: "dislike", icon: "glyphicon-remove", count: 0, clicked: false, users: []},
                ];

                scope.toggleTag = function(key, tag) {

                    if (!attrs["save"]) {
                        console.log("no save url. Cannot update tags")
                        return
                    }

                    var syncMethod = "POST"

                    //update the interface instantly
                    if (tag.clicked) {
                        scope.tagState[key].count--;
                        syncMethod = "DELETE"

                    } else {
                        scope.tagState[key].count++;
                        syncMethod = "POST"
                    }
                    scope.tagState[key].clicked = !tag.clicked;

                    //sync to server
                    $http({method: syncMethod, url: CONFIG.api+attrs["save"], data: [tag.value]})
                    .then(function successCallback(response) {
                        ngModelCtrl.$viewValue = response.data.payload;
                    }, notify.handleHttpErr);
                };

                ngModelCtrl.$render = function() {
                    angular.forEach(ngModelCtrl.$viewValue, function(existingTag) {
                        angular.forEach(scope.tagState, function(availTag) {
                            if (existingTag.tags.indexOf(availTag.value) != -1) {
                                availTag.count++;
                                if (me.user.username == existingTag.username) {
                                    availTag.clicked = true;
                                }
                                availTag.users.push(existingTag.username);
                            }
                        });
                    });
                };

                scope.implode = function(strings) {
                    return strings.join(", ");
                }
            }
        }
    }
    directive.$inject=["CONFIG", "me", "notify", "$http"];

    return directive;
});