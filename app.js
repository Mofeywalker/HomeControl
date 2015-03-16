var ts = require('index');

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
if(!ts.isDriverLoaded()) {
    try {
        ts.loadDriver();
        console.log('driver is loaded');
    } catch (err) {
        console.log('something went wrong loading the driver:', err)
    }
}else{
    console.log('driver is loaded');
}


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
    console.log("[sockets.connection]");

    //Steckdosen
    socket.on('switch_control', function(data) {
        console.log("[sockets.switch_control]");

        //schalten der Steckdosen
        // Code 1111110000, Typ-Dipschalter, an(false)/aus(true)
        rc.send(data.code, 'dip', data.status);
        console.log("[SEND] " + data.code +" "+ data.status);
    })

    //TempSensor
    socket.on('tempsensor', function() {
        console.log("[sockets.tempsensor]");
        console.log('getAll sync', ts.getAll());
        var temp = sensor.get('28-00000400afdb');
        console.log(temp);
        socket.write(temp);

    })

});
