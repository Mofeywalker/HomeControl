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
                + '<button type="button" class="btn btn-success" id=' + value.id.toLowerCase() + 'an' + '">An</button>'
                + '<button type="button" class="btn btn-danger" id=' + value.id.toLowerCase() + 'aus' + '">Aus</button>'
                + '</div>'
                );

                $('#'+value.id.toLowerCase()+'an').click(function() {
                    socket.emit('switch_control', {type: 'request', code: value.code, status:'false'});
                });

                $('#'+value.id.toLowerCase()+'aus').click(function() {
                    socket.emit('switch_control', {type: 'request', code: value.code, status:'true'});
                });
            });
        }
    });
});

