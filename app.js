var ts = require('ds18x20');

var rc = require('piswitch');

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    conf = require('./config.json');

// PiSwitch einrichten
rc.setup({
    mode: 'phys',
    pulseLength: 330,
    protocol: 1,
    pin: 11
});

// TempSensor laden
ts.isDriverLoaded(function (err, isLoaded) {
    console.log(isLoaded);
});
sensor.loadDriver(function (err) {
    if (err) console.log('something went wrong loading the driver:', err)
    else console.log('driver is loaded');
});

/**
if(!ts.isDriverLoaded()) {
    try {
        ts.loadDriver();
        console.log('[TempSensor driver is loaded]');
    } catch (err) {
        console.log('[something went wrong loading the TempSensor driver:'+ err +']')
    }
}else{
    console.log('[TempSensor driver is already loaded]');
}
*/

//Server starten
server.listen(conf.port);
console.log("[Server.Listen]");

//Pfad
app.use(express.static(__dirname + '/public'));

//
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

//Steuerung
io.sockets.on('connection', function(socket) {
    console.log("[Connection established for: "+socket.request.connection.remoteAddress+"]");

    //Steckdosen
    socket.on('switch_control', function(data) {

        //schalten der Steckdosen
        // Code 1111110000, Typ-Dipschalter, an(false)/aus(true)
        rc.send(data.code, 'dip', data.status);
        console.log("[SEND] " + data.code +" "+ data.status);
    })

    //TempSensor
    socket.on('tempsensor', function() {

        ts.get('28-00000400afdb', function (err, temp) {
            console.log(temp);

            socket.emit('temperature', {temperature:temp});
        });

    })

});
