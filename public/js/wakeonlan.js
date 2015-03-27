

$(document).ready(function() {
    var socket;
    socket = io.connect();
    socket.on('wol_all_response_overview', function(wols) {
        console.log(wols);

        $.each(wols, function(index, value) {
            $("#wakeonlan").append(
                '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="wakeonlan" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.name + '</h2>'
                + '</div>'
                + '<button type="button" class="btn btn-on" onclick="switchOn('+ value.mac + ')">An</button>'
                + '</div>'
            );
        });
    });

    /*

    $.ajax({
        url: "wakeonlan.json",
        dataType: "text",
        success: function (data) {
            var json = $.parseJSON(data);
            $.each(json.wakeonlan, function (index, value) {
                $("#wakeonlan").append(
                    '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="switch" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.name + '</h2>'
                + '</div>'
                + '<button type="button" class="btn btn-on" id="' + value.id.toLowerCase() + 'an"' + '">An</button>'
                + '</div>'
                );

            });

            console.log($("#wakeonlan"));

            $.each(json.wakeonlan, function(index, value) {
                var onId = '#'+value.id.toLowerCase()+'an';
                console.log("[an]"+ onId);
                $(onId).click(function() {
                    socket.emit('wakeonlan_control', {id: value.id , mac: value.mac});
                });
            });

        }
    });
    */
    socket.emit('wol_all_request', {type: 'overview'});
});

function switchOn(mac) {
    socket.emit('wakeonlan_control', {mac:mac.toString()});
}