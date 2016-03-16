define([], function(){

    function directive(CONFIG, me, $http) {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: "/src/app/directive/tags/tags.html",
            link: function (scope, elem, attrs, ngModel) {

                scope.availableTags = [
                    {value: "like", icon: "glyphicon-thumbs-up", count: 0, clicked: false, users: []},
                    {value: "dislike", icon: "glyphicon-thumbs-down", count: 0, clicked: false, users: []},
                ];
                scope.me = me;

                scope.toggleTag = function(key, tag) {
                    //update the interface instantly
                    if (tag.clicked) {
                        scope.availableTags[key].count--;
                    } else {
                        scope.availableTags[key].count++;
                    }
                    scope.availableTags[key].clicked = !tag.clicked;

                    //then sync to backend
                    var userTags = []
                    angular.forEach(scope.availableTags, function(availTag) {
                        if (availTag.clicked == true) {
                            userTags.push(availTag.value);
                        }
                    });
                    if (attrs["save"]) {
                      $http({method: 'POST', url: CONFIG.api+attrs["save"], data: userTags})
                        .then(function successCallback(response) {
                            ngModel.$viewValue = response.data.payload;
                        }, function errorCallback(response) {
                            console.log("FAILED", response)
                        });

                    } else {
                        console.log("no save url")
                    }
                };

                var unwatch = scope.$watch(attrs.ngModel, function () {
                    angular.forEach(ngModel.$viewValue, function(existingTag) {
                        angular.forEach(scope.availableTags, function(availTag) {
                            if (existingTag.tags.indexOf(availTag.value) != -1) {
                                availTag.count++;
                                if (me.user.username == existingTag.username) {
                                    availTag.clicked = true;
                                }
                                availTag.users.push(existingTag.username);
                            }
                        });
                    });
                    unwatch(); //let toggletag do the work without lots of watches
                });

                scope.implode = function(strings) {
                    return strings.join(", ");
                }
            }
        }
    }
    directive.$inject=["CONFIG", "me", "$http"];

    return directive;
});