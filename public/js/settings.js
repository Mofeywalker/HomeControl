$(document).ready(function() {
    var socket;
    socket = io.connect();

    socket.on('switch_all_response_settings', function(response){
        console.log(response);
        $("#steckdosen-liste").text("Angelegte Steckdosen");
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
                    + '<div class="col-md-4"><input type="text" id="steck'+index+'code" onkeyup="checkCodeIndex('+index+')"></div>'
                    + '<div class="col-md-4"><button id="steck'+index+'save" onclick="changeButton('+value.code+','+index+')">Speichern</button></div>'
                + '</div>'
            );
        });
    });
    socket.emit('switch_all_request', {type: 'settings'});

    socket.on('wol_all_response_settings', function(response){
        console.log(response);
        $("#wol-liste").text("Angelegte Weckrufe");
        $.each(response, function(index, value){
            $('#wol-liste').append(
                '<div class="row" id="wol'+index+'">'
                    + '<div class="col-md-4" id="wolRow'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="wolRow'+index+'mac-id">'+value.mac+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="wolSwitchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="wolDeleteButton('+value.mac.toString()+')">L&ouml;schen</button>'
                    + '</div>'
                + '</div>'
                + '<div class="row gone" id="wolAendern'+index+'">'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'name"></div>'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'code" onkeyup="checkMacIndex('+index+')"></div>'
                    + '<div class="col-md-4"><button id="wol'+index+'save" onclick="wolChangeButton('+value.mac+','+index+')">Speichern</button></div>'
                + '</div>'
            );
        });
    });
    socket.emit('wol_all_request', {type: 'settings'});

    socket.on('temp_sensors_response', function(data) {
        //var json = $.parseJSON(data);
        console.log(data.sensors);
        $('#tempsensor').text('');
        $.each(data.sensors, function(index, value) {
            $('#tempsensor').append('<option>'+ value + '</option>');
        });
    });

    socket.on('switch_created', function(){
       refreshListOfSwitches();
    });

    socket.on('wol_created', function(){
        refreshWolList();
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
        valname = valname.trim();
        socket.emit('switch_create', {name: valname, code: valcode});
        refreshListOfSwitches();
    });

    $("#wol-save").click(function(){
        var valname = $("#wol-name").val();
        var valmac = $("#mac-id").val();
        valname = valname.trim();
        socket.emit('wol_create', {name: valname, mac: valmac});
        refreshListOfSwitches();
    });

});

function switchView(index){
    document.getElementById("steck"+index).style.display = "none";
    document.getElementById("steckAendern"+index).style.display = "block";
    $("#steck"+index+"name").val(document.getElementById("row"+index+"name").innerHTML);
    $("#steck"+index+"code").val(document.getElementById("row"+index+"code").innerHTML);
}

function wolSwitchView(index){
    document.getElementById("wol"+index).style.display = "none";
    document.getElementById("wolAendern"+index).style.display = "block";
    $("#wol"+index+"name").val(document.getElementById("wolRow"+index+"name").innerHTML);
    $("#wol"+index+"mac-id").val(document.getElementById("wolRow"+index+"mac-id").innerHTML);
}

function changeButton(oldcode, index){
    var valnewname = $("#steck"+index+"name").val();
    var valnewcode = $("#steck"+index+"code").val();
    socket.emit('switch_update_request', {oldcode: oldcode.toString(), newname: valnewname, newcode: valnewcode.toString()});
    refreshListOfSwitches();
}

function wolChangeButton(oldmac, index){
    var valnewname = $("#wol"+index+"name").val();
    var valnewmac = $("#wol"+index+"mac-id").val();
    socket.emit('wol_update_request', {oldmac: oldmac.toString(), newname: valnewname, newmac: valnewmac.toString()});
    refreshListOfSwitches();
}

function deleteButton(code){
    socket.emit('switch_delete_request', {code: code.toString()});
    refreshListOfSwitches();
}

function wolDeleteButton(mac){
    socket.emit('wol_delete_request', {mac: mac.toString()});
    refreshListOfSwitches();
}

function refreshListOfSwitches(){
    var socket;
    socket = io.connect();

    socket.on('switch_all_response_settings', function(response){
        console.log(response);
        $("#steckdosen-liste").text("Angelegte Steckdosen");
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
                    + '<div class="col-md-4"><input type="text" id="steck'+index+'code" onkeyup="checkCodeIndex('+index+')"></div>'
                    + '<div class="col-md-4"><button id="steck'+index+'save" onclick="changeButton('+value.code+','+index+')">Speichern</button></div>'
                + '</div>'
            );
        });
    });

    socket.emit('switch_all_request', {type: 'settings'});
}

function refreshWolList(){
    var socket;
    socket = io.connect();

    socket.on('wol_all_response_settings', function(response){
        console.log(response);
        $("#wol-liste").text("Angelegte Weckrufe");
        $.each(response, function(index, value){
            $('#wol-liste').append(
                '<div class="row" id="wol'+index+'">'
                    + '<div class="col-md-4" id="wolRow'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="wolRow'+index+'mac-id">'+value.mac+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="wolSwitchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="wolDeleteButton('+value.mac.toString()+')">L&ouml;schen</button>'
                    + '</div>'
                + '</div>'
                + '<div class="row gone" id="wolAendern'+index+'">'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'name"></div>'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'code" onkeyup="checkMacIndex('+index+')"></div>'
                    + '<div class="col-md-4"><button id="wol'+index+'save" onclick="wolChangeButton('+value.mac+','+index+')">Speichern</button></div>'
                + '</div>'
            );
        });
    });
    socket.emit('wol_all_request', {type: 'settings'});
}