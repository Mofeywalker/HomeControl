var socket;
var cityName;
$(document).ready(function() {
    socket = io.connect();

    socket.on('switch_all_response', function(response){
        console.log(response);
        $("#steckdosen-liste").append('<table border="0">');
        $.each(response, function(index, data){
            var str = "<tr><td>" + data.name + '('+ data.code +')</td><td><button class="change" onclick="changeButton('+data.name+')">&Auml;ndern</button></td></tr>';
            $("#steckdosen-liste").append(str);
        });
        $("#steckdosen-liste").append('</table>');
    });

    socket.emit('switch_all_request');

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
        alert('Standort geändert');
    });

    $("#steck-save").click(function(){
        var valname = $("#name").val();
        var valcode = $("#code").val();
        name = name.trim();
        socket.emit('switch_create', {name: valname, code: valcode});
    });

});

function changeButton(val){
    alert(val);
}