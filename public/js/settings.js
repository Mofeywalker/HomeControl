$(document).ready(function() {
    var socket = io.connect();
    socket.emit('temp_sensors_request', {});
    socket.on('temp_sensors_response', function(data) {
        var json = $.parseJSON(data);
        console.log(data.sensors);
        $('#tempsensor').text('');
        $.each(data.sensors, function(index, value) {
            $('#tempsensor').enable();
            $('#tempsensor').append('<option>'+ value + '</option>');
        });
    });
});