var ts = require('ds18x20');

var RaspiCam = require('raspicam');
var camera = new RaspiCam({
    mode: 'photo',
    output: './photo/image.jpg',
    encoding: 'jpg',
    timeout: 0 // take the picture immediately
});

var os = require('os');

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
ts.loadDriver(function (err) {
    if (err) console.log('[something went wrong loading the driver:', err,']')
    else console.log('[TempSensor driver is loaded]');
});

//Camera steuern
camera.on('started', function( err, timestamp ){
    console.log("photo started at " + timestamp );
});

camera.on('read', function( err, timestamp, filename ){
    console.log("photo image captured with filename: " + filename );
});

camera.on('exit', function( timestamp ){
    console.log("photo child process has exited at " + timestamp );
});


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

    socket.on('disconnect', function() {
        console.log("[Connection closed for: "+socket.request.connection.remoteAddress+"]");
    });

    //Steckdosen
    socket.on('switch_control', function(data) {

        //schalten der Steckdosen
        // Code 1111110000, Typ-Dipschalter, an(false)/aus(true)
        rc.send(data.code, 'dip', data.status);
        console.log("[SEND] " + data.code +" "+ data.status);
    });

    //TempSensor
    socket.on('tempsensor', function() {

        ts.get('28-00000400afdb', function (err, temp) {
            socket.emit('temperature', { temperature: temp });
        });

    });

    //Kamera
    socket.on('camera', function() {
        camera.start();
    });


    //System Informationen
    socket.on('sysinfo', function() {

        //Returns hostname
        var hostname = os.hostname();

        //Returns the operating system name.
        var ostype = os.type();

        //Returns the operating system platform.
        var osplat = os.platform();

        //Returns the operating system CPU architecture. Possible values are "x64", "arm" and "ia32".
        var arch = os.arch();

        //Returns the operating system release.
        var release = os.release();

        //Returns the system uptime in seconds
        var uptime = os.uptime();

        //Returns an array containing the 1, 5, and 15 minute load averages.
        var loadavg = os.loadavg();

        //Returns the total amount of system memory in bytes.
        var totalmem = os.totalmem();

        //Returns the amount of free system memory in bytes.
        var freemem = os.freemem();

        console.log(hostname,  ostype,  osplat,  arch,  release,  uptime,  loadavg,  totalmem,  freemem);

        socket.emit('sysinfo', { hostname: hostname, ostype: ostype, osplat: osplat, arch: arch, release: release, uptime: uptime, loadavg: loadavg, totalmem: totalmem, freemem: freemem});

    });

});


