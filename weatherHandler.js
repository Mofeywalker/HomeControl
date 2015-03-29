// Nconf zum auslesen der Config
var nconf = require('nconf');

// Config einlesen
nconf.use('file', {file: './config.json'});
nconf.load();

module.exports = function(socket) {
    /**
     * Socket-Listener der auf ein Wetter-Update Request wartet und dann den Ort zurueck sendet,
     * beim Client werden dann die neusten Wetter-Informationen von openweathermap abgerufen
     */
    socket.on('weatherlocation_request', function() {
        socket.emit('weatherlocation_response', {weatherlocation: nconf.get('weatherlocation')});
    });


    /**
     * Socket-Listener der auf ein Update des Ortes wartet, fuer den das Wetter abgefragt wird.
     * Diese Information wird in der config.json gepeichert.
     */
    socket.on('weatherlocation_update', function(data) {
        nconf.set('weatherlocation', data.weatherlocation);
        nconf.save(function (err) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('[NCONF - Standort fuer Wetterabfragen erfolgreich geaendert!]');
        });
    });
};