var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('temp_sensors_response', function(data) {
        var json = $.parseJSON(data);
        console.log(data.sensors);
        $('#tempsensor').text('');
        $.each(data.sensors, function(index, value) {
            $('#tempsensor').append('<option>'+ value + '</option>');
        });
    });

    socket.emit('temp_sensors_request', {});
});