var socket;

$(document).ready(function() {
    socket = io.connect();
    $.ajax({
        url: "wakeonlan.json",
        dataType: "text",
        success: function (data) {
            var json = $.parseJSON(data);
            $.each(json.wakeonlan, function (index, value) {
                $("#wakeonlan").append(
                    '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="switch" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.id + '</h2>'
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

                    socket.emit('wakeonlan_control', {type: 'request', mac: value.mac, status:false});
                });
            });

        }
    });
});

