$(document).ready(function() {
    var socket = io.socket();
    socket.emit('temp_sensors_request', {});
    socket.on('temp_sensors_response', function(data) {
        var json = parseJSON(data);
        if (json.length === 0) {
            $('#tempsensor').disable();
        } else {
            $.each(json, function(index, value) {
                $('#tempsensor').append('<option>'+ value + '</option>');
            });
        }

    });
});