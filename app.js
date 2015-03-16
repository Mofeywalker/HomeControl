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

//Server starten
server.listen(conf.port);

//Pfad
app.use(express.static(__dirname + '/public'));

//
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

//
io.sockets.on('connection', function(socket) {
    socket.on('switch_control', function (data) {
        //schalten der Steckdosen
        // Code 1111110000, Typ-Dipschalter, an(false)/aus(true)
        rc.send(data.code, dip, data.status);
        console.log("[SEND] " + data.code +" "+ data.status);
    })
});
