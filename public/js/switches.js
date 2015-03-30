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
            console.log(value);
            console.log(value.code);
            $("#switches").append(
                '<div class="col-md-6 col-xs-12" align="center">'
                + '<div class="switch" class="col-md-12 col-xs-12" align="center">'
                + '<h2>' + value.name + '</h2>'
                + '<div class="gone" id="schalte'+index+'">'+value.code+'</div>'
                + '</div>'
                + '<button type="button" class="btn btn-on" onclick="switchOn(' + index + ')' + '">An</button>'
                + '<button type="button" class="btn btn-off" onclick="switchOff(' + index + ')' + '">Aus</button>'
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
function switchOn(index) {
    var code = $("#schalte"+index).text();
    console.log("im switchOn "+code+" string: " +code.toString());
    socket.emit('switch_control', {type: 'request', code: code.toString(), status:false});
}

/**
 * Methode zum ausschalten eines Switches. Sendet per Websocket den Request an den Server.
 * @param code Steckdosen Code
 */
function switchOff(index) {
    var code = $("#schalte"+index).text();
    console.log("im switchOff "+code+" string: " +code.toString());
    socket.emit('switch_control', {type: 'request', code: code.toString(), status:true});
}