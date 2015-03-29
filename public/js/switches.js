$(document).ready(function() {
    // Mit Websocket verbinden
    var socket;
    socket = io.connect();

    /**
     * Socket-Listener der auf eine eingehende Antwort mit einer Liste mit allen Switches wartet.
     * Bei Eingang werden alle Switches dynamisch in die Website eingebunden.
     */
    socket.on('switch_all_response_overview', function(switches) {
        console.log(switches);
        $.each(switches, function (index, value) {
            $("#switches").append(
                '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="switch" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.name + '</h2>'
                + '</div>'
                + '<button type="button" class="btn btn-on" onclick="switchOn(' + value.code + ')' + '">An</button>'
                + '<button type="button" class="btn btn-off" onclick="switchOff(' + value.code + ')' + '">Aus</button>'
                + '</div>'
            );

        });
    });

    // Anfrage aller Switches um bei der Antwort die Seite aufzubauen
    socket.emit('switch_all_request', {type: "overview"});
});

/**
 * Methode zum einschalten eines Switches. Sendet per Websocket den Request an den Server.
 * @param code Steckdosen Code
 */
function switchOn(code) {
    socket.emit('switch_control', {type: 'request', code: code.toString(), status:false});
}

/**
 * Methode zum ausschalten eines Switches. Sendet per Websocket den Request an den Server.
 * @param code Steckdosen Code
 */
function switchOff(code) {
    socket.emit('switch_control', {type: 'request', code: code.toString(), status:true});
}