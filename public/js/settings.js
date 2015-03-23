$(document).ready(function() {
    var socket = io.socket();
    socket.emit('temp_sensors_request', {});
    socket.on('temp_sensors_response', function(data) {
        var json = parseJSON(data);
        $.each(json, function(index, value) {
            $('#tempsensor').enable();
            $('#tempsensor').append('<option>'+ value + '</option>');
        });
    });
});