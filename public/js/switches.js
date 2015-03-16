var socket;

$(document).ready(function() {
    socket = io.connect();
    $.ajax({
        url: "switches.json",
        dataType: "text",
        success: function (data) {
            var json = $.parseJSON(data);
            $.each(json.switches, function (index, value) {
                $("#switches").append(
                    '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="switch" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.id + '</h2>'
                + '</div>'
                + '<button type="button" class="btn btn-success" id="' + value.id.toLowerCase() + 'an"' + '">An</button>'
                + '<button type="button" class="btn btn-danger" id="' + value.id.toLowerCase() + 'aus"' + '">Aus</button>'
                + '</div>'
                );

            });

            console.log($("#switches"));

            $.each(json.switches, function(index, value) {
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

        }
    });
});

