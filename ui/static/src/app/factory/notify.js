define([], function(){
    function factory() {
        var notify = {
            messages: [],
            warning: function(msg) {
                notify.messages.push({level: "warning", msg: msg})
            },
            info: function(msg) {
                notify.messages.push({level: "info", msg: msg})
            },
            handleHttpErr: function(response) {
                console.log("FAILED:", response);
                if (response.data.message != undefined && response.data.message != "") {
                    notify.messages.push({level: "danger", msg: response.data.message});
                    return;
                }
                notify.messages.push({level: "danger", msg: "Unknown API error ("+((response.status != undefined) ? response.status : "?")+")"});
            },
            dismiss:  function(key) {
                notify.messages.splice(key, 1);
            }
        };
        return notify;
    };
    factory.$inject=[];
    return factory;
});