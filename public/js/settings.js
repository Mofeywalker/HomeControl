var socket;
var cityName;
$(document).ready(function() {
    socket = io.connect();

    socket.on('temp_sensors_response', function(data) {
        //var json = $.parseJSON(data);
        console.log(data.sensors);
        $('#tempsensor').text('');
        $.each(data.sensors, function(index, value) {
            $('#tempsensor').append('<option>'+ value + '</option>');
        });
    });

    $('#tempsave').click(function(){
        var tempSensor = $('#tempsensor').val();
        socket.emit('temp_sensor_selection', {sensor: tempSensor});
    });

    socket.emit('temp_sensors_request', {});
    $('#save_city').click(function(){
        socket.emit('weatherlocation_update', {weatherlocation: $('#city').val()});
    });

    $("#steck-save").click(function(){
        var name = $("#name").val();
        var code = $("#code").val();
        name = name.trim();
        if(name.empty()){
            alert("Name leer!");
        }
        else{
            socket.emit('switch_create', {name: name, code: code});
        }
    })
});