define([], function(){

    function directive(CONFIG, me, $http) {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: "/src/app/directive/tags/tags.html",
            link: function (scope, elem, attrs, ngModelCtrl) {

                scope.me = me;
                scope.tagState = [
                    {value: "like", icon: "glyphicon-thumbs-up", count: 0, clicked: false, users: []},
                    {value: "dislike", icon: "glyphicon-thumbs-down", count: 0, clicked: false, users: []},
                ];

                scope.toggleTag = function(key, tag) {
                    //update the interface instantly
                    if (tag.clicked) {
                        scope.tagState[key].count--;
                    } else {
                        scope.tagState[key].count++;
                    }
                    scope.tagState[key].clicked = !tag.clicked;

                    //then sync to backend
                    var userTags = []
                    angular.forEach(scope.tagState, function(availTag) {
                        if (availTag.clicked == true) {
                            userTags.push(availTag.value);
                        }
                    });
                    if (attrs["save"]) {
                      $http({method: 'POST', url: CONFIG.api+attrs["save"], data: userTags})
                        .then(function successCallback(response) {
                            ngModelCtrl.$viewValue = response.data.payload;
                        }, function errorCallback(response) {
                            console.log("FAILED", response)
                        });

                    } else {
                        console.log("no save url")
                    }
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
    directive.$inject=["CONFIG", "me", "$http"];

    return directive;
});