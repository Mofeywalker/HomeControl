$(document).ready(function() {
    // Mit Websocket verbinden
    var socket;
    socket = io.connect();

    /**
     * Socket-Listener der auf eine eingehende Antwort wartet, die alle verfuegbaren Wake On Lan Eintrage beinhaltet
     * und die Seite dynamisch aufbaut.
     */
    socket.on('wol_all_response_overview', function(wols) {
        console.log(wols);

        $.each(wols, function(index, value) {
            $("#wakeonlan").append(
                '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="wakeonlan" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.name + '</h2>'
                + '<div class="gone" id="wake'+index+'">'+value.mac+'</div>'
                + '</div>'
                + '<button type="button" class="btn btn-on" onclick="switchOn('+index+')">An</button>'
                + '</div>'
            );
        });
    });

    // Anfrage fuer alle WOL Eintraege
    socket.emit('wol_all_request', {type: 'overview'});
});

/**
 * Funktion zum senden einer WOl Anfrage an den Server.
 * @param index
 */
function switchOn(index) {
    var mac = $("#wake"+index).text();
    socket.emit('wakeonlan_control', {mac:mac.toString()});
}