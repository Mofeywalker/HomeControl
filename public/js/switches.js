var socket;

$(document).ready(function() {
    socket = io.connect();
    socket.on('switch_all_response', function(switches) {
        //var json = $.parseJSON(data);
        console.log(switches);
        $.each(switches, function (index, value) {
            $("#switches").append(
                '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="switch" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.name + '</h2>'
                + '</div>'
                + '<button type="button" class="btn btn-on" onclick="switchOn(' + value.code + ')' + '">An</button>'
                + '<button type="button" class="btn btn-off" onclick="switchOff(' + value.code + ')' + '">Aus</button>'
                + '</div>'
            );

        });

        console.log($("#switches"));

        /*
        $.each(switches, function(index, value) {
            var onId = '#'+value.id.toLowerCase()+'an';
            console.log("[an]"+ onId);
            $(onId).click(function() {

                socket.emit('switch_control', {type: 'request', code: value.code, status:false});
            });
            var offId = '#'+value.id.toLowerCase()+'aus';
            console.log("[an]"+ offId);
            $(offId).click(function() {
                console.log("[aus]");
                socket.emit('switch_control', {type: 'request', code: value.code, status:true});
            });
        });
        */
    });

    socket.emit('switch_all_request');
});

function switchOn(code) {
    socket.emit('switch_control', {type: 'request', code: code.toString(), status:false});
}

function switchOff(code) {
    socket.emit('switch_control', {type: 'request', code: code.toString(), status:true});
}