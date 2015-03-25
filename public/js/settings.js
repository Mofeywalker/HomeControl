$(document).ready(function() {
    var socket;
    socket = io.connect();

    socket.on('switch_all_response', function(response){
        console.log(response);
        $.each(response, function(index, value){
            $('#steckdosen-liste').append(
                '<div class="row" id="steck'+index+'">'
                    + '<div class="col-md-4" id="row'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="row'+index+'code">'+value.code+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="switchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="deleteButton('+value.code+')">L&ouml;schen</button>'
                    + '</div>'
                + '</div>'
                + '<div class="row gone" id="steckAendern'+index+'">'
                    + '<div class="col-md-4"><input type="text" id="steck'+index+'name"></div>'
                    + '<div class="col-md-4"><input type="text" id="steck'+index+'code"></div>'
                    + '<div class="col-md-4"><button onclick="changeButton('+value.code+','+index+')">Speichern</button></div>'
                +'</div>'
            );
        });
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

function switchView(index){
    document.getElementById("steck"+index).style.display = "none";
    document.getElementById("steckAendern"+index).style.display = "block";
    $("#steck"+index+"name").val(document.getElementById("row"+index+"name").innerHTML);
    $("#steck"+index+"code").val(document.getElementById("row"+index+"code").innerHTML);
}

function changeButton(oldcode, index){
    //alert(val.toString());
    var valnewname = $("#steck"+index+"-name").val();
    var valnewcode = $("#steck"+index+"-code").val();
    socket.emit('switch_update_request', {oldcode: oldcode.toString(), newname: valnewname, newcode: valnewcode.toString()});
}

function deleteButton(code){
    //alert(val.toString());
    socket.emit('switch_delete_request', {code: code.toString()});
}