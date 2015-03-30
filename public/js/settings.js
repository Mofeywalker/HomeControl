$(document).ready(function() {
    // Verbindung zum Websocket erstellen
    var socket;
    socket = io.connect();

    // Socket-Listener zum erstellen der Steckdosen-Liste
    socket.on('switch_all_response_settings', function(response){
        $("#steckdosen-liste").text("Angelegte Steckdosen");
        $.each(response, function(index, value){
            $('#steckdosen-liste').append(
                '<div class="row" id="steck'+index+'">'
                    + '<div class="col-md-4" id="row'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="row'+index+'code">'+value.code+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="switchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="deleteButton('+index+')">L&ouml;schen</button>'
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
    // Abfrage der Steckdosen-Liste
    socket.emit('switch_all_request', {type: 'settings'});

    // Socket-Listener zum Erstellen der Wake on LAN Liste
    socket.on('wol_all_response_settings', function(response){
        $("#wol-liste").text("Angelegte Weckrufe");
        $.each(response, function(index, value){
            $('#wol-liste').append(
                '<div class="row" id="wol'+index+'">'
                    + '<div class="col-md-4" id="wolRow'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="wolRow'+index+'mac-id">'+value.mac.toString()+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="wolSwitchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="wolDeleteButton('+index+')">L&ouml;schen</button>'
                    + '</div>'
                + '</div>'
                + '<div class="row gone" id="wolAendern'+index+'">'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'name"></div>'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'mac-id" onkeyup="checkMacIndex('+index+')"></div>'
                    + '<div class="col-md-4"><button id="wol'+index+'save" onclick="wolChangeButton('+value.mac+','+index+')">Speichern</button></div>'
                + '</div>'
            );
        });
    });
    // Abfrage der Wake on LAN Liste
    socket.emit('wol_all_request', {type: 'settings'});

    // Socket-Listener für Drop-Down-Liste der verfügbaren Temperatursensoren
    socket.on('temp_sensors_response', function(data) {
        $('#tempsensor').text('');
        $.each(data.sensors, function(index, value) {
            $('#tempsensor').append('<option>'+ value + '</option>');
        });
    });

    // Socket-Listener für erstellte Steckdosen zum aktualisieren der Liste
    socket.on('switch_created', function(){
       refreshListOfSwitches();
    });

    // Socket-Listener für erstellte Wake on LAN Einträge zum aktualisieren der Liste
    socket.on('wol_created', function(){
        refreshWolList();
    });

    // Button-Listener für Auswahl des Temperatursensors
    $('#tempsave').click(function(){
        var tempSensor = $('#tempsensor').val();
        socket.emit('temp_sensor_selection', {sensor: tempSensor});
    });

    // Abfrage der Temperatursensoren
    socket.emit('temp_sensors_request', {});

    // Button-Listener für Ändern der Stadt (Wetter)
    $('#save_city').click(function(){
        socket.emit('weatherlocation_update', {weatherlocation: $('#city').val()});
        alert('Standort geändert');
    });

    // Button-Listener für Erstellen einer neuen Steckdose
    $("#steck-save").click(function(){
        var valname = $("#name").val();
        var valcode = $("#code").val();
        valname = valname.trim();
        socket.emit('switch_create', {name: valname, code: valcode});
        refreshListOfSwitches();
    });

    // Button-Listener für Erstellen eines neuen Wake on LAN Eintrags
    $("#wol-save").click(function(){
        var valname = $("#wol-name").val();
        var valmac = $("#mac-id").val();
        valname = valname.trim();
        socket.emit('wol_create', {name: valname, mac: valmac});
        refreshListOfSwitches();
    });

});

/**
 * switchView
 * Ansicht von Anzeige zu Bearbeiten ändern (Steckdosen)
 * @param index Index des Eintrags
 */
function switchView(index){
    // Verstecke Anzeige-div
    document.getElementById("steck"+index).style.display = "none";
    // Zeige Bearbeite-div
    document.getElementById("steckAendern"+index).style.display = "block";
    // Kopiere zugehörige Werte in Input-Felder
    $("#steck"+index+"name").val(document.getElementById("row"+index+"name").innerHTML);
    $("#steck"+index+"code").val(document.getElementById("row"+index+"code").innerHTML);
}

/**
 * wolSwitchView
 * Ansicht von Anzeige zu Bearbeiten ändern (Wake on LAN)
 * @param index Index des Eintrags
 */
function wolSwitchView(index){
    // Anzeige-div verstecken
    document.getElementById("wol"+index).style.display = "none";
    // Bearbeite-div anzeigen
    document.getElementById("wolAendern"+index).style.display = "block";
    // Werte des zugehörigen Eintrags kopieren
    $("#wol"+index+"name").val(document.getElementById("wolRow"+index+"name").innerHTML);
    $("#wol"+index+"mac-id").val(document.getElementById("wolRow"+index+"mac-id").innerHTML);
}

/**
 * Button-Listener für Bearbeiten von Steckdosen
 * @param oldcode alter Steckdosen-Code
 * @param index Index des Eintrags
 */
function changeButton(oldcode, index){
    // Neue Werte auslesen
    var valnewname = $("#steck"+index+"name").val();
    var valnewcode = $("#steck"+index+"code").val();
    // Werte zum Speichern in Datenbank übergeben
    socket.emit('switch_update_request', {oldcode: oldcode.toString(), newname: valnewname, newcode: valnewcode.toString()});
    // Liste aktualisieren
    refreshListOfSwitches();
}

/**
 * Button-Listener für Bearbeiten von Wake on LAN Einträgen
 * @param oldmac alte MAC-Adresse
 * @param index zugehöriger Index
 */
function wolChangeButton(oldmac, index){
    // Neue Werte auslesen
    var valnewname = $("#wol"+index+"name").val();
    var valnewmac = $("#wol"+index+"mac-id").val();
    // Werte zum Speichern in Datenbank übergeben
    socket.emit('wol_update_request', {oldmac: oldmac.toString(), newname: valnewname, newmac: valnewmac.toString()});
    // Liste aktualisieren
    refreshWolList();
}

/**
 * Button-Listener zum Löschen eines Steckdosen Eintrags
 * @param index zugehöriger Index
 */
function deleteButton(index){
    // Code der Steckdose (zum Identifizieren) auslesen
    var code = $('#row'+index+'code').text();
    // Aus Datenbank löschen
    socket.emit('switch_delete_request', {code: code.toString()});
    // Liste aktualisieren
    refreshListOfSwitches();
}

/**
 * Button-Listener zum Löschen eines Wake on LAN Eintrags
 * @param index zugehöriger Index
 */
function wolDeleteButton(index){
    // MAC-Adresse des Eintrags (zum Identifizieren) auslesen
    var mac = $('#wolRow'+index+'mac-id').text();
    // Aus Datenbank löschen
    socket.emit('wol_delete_request', {mac: mac.toString()});
    // Liste aktualisieren
    refreshWolList();
}

/**
 * refreshListOfSwitches
 * Liste aktualisieren (Steckdosen)
 */
function refreshListOfSwitches(){
    var socket;
    socket = io.connect();

    socket.on('switch_all_response_settings', function(response){
        $("#steckdosen-liste").text("Angelegte Steckdosen");
        $.each(response, function(index, value){
            $('#steckdosen-liste').append(
                '<div class="row" id="steck'+index+'">'
                    + '<div class="col-md-4" id="row'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="row'+index+'code">'+value.code+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="switchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="deleteButton('+index+')">L&ouml;schen</button>'
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

/**
 * refreshWolList
 * Liste aktualisieren (Wake on LAN)
 */
function refreshWolList(){
    var socket;
    socket = io.connect();

    socket.on('wol_all_response_settings', function(response){
        $("#wol-liste").text("Angelegte Weckrufe");
        $.each(response, function(index, value){
            $('#wol-liste').append(
                '<div class="row" id="wol'+index+'">'
                    + '<div class="col-md-4" id="wolRow'+index+'name">'+value.name+'</div>'
                    + '<div class="col-md-4" id="wolRow'+index+'mac-id">'+value.mac.toString()+'</div>'
                    + '<div class="col-md-4">'
                        + '<button onclick="wolSwitchView('+index+')">&Auml;ndern</button>'
                        + '<button onclick="wolDeleteButton('+index+')">L&ouml;schen</button>'
                    + '</div>'
                + '</div>'
                + '<div class="row gone" id="wolAendern'+index+'">'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'name"></div>'
                    + '<div class="col-md-4"><input type="text" id="wol'+index+'mac-id" onkeyup="checkMacIndex('+index+')"></div>'
                    + '<div class="col-md-4"><button id="wol'+index+'save" onclick="wolChangeButton('+value.mac+','+index+')">Speichern</button></div>'
                + '</div>'
            );
        });
    });
    socket.emit('wol_all_request', {type: 'settings'});
}