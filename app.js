
// Modulsetup
var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    conf        = require('./config.json'),
    wol         = require('wake_on_lan'),
    ts          = require('ds18x20'),
    rc          = require('piswitch'),
    systeminfo  = require('./libs/systeminfo.js'),
    raspicam    = require('raspicam'),
    Camera      = require('camerapi');

var cam = new Camera();
cam.baseDirectory('photo');
// Kamera Konfiguration aus der config.json lesen
var camera = new raspicam(conf.camera);

// PiSwitch Konfiguration aus der config.json lesen
rc.setup(conf.remotecontrol);

// Treiber fuer den Temperatursensor testen
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

// Express im statischen Modus verwenden
app.use(express.static(__dirname + '/public'));

// Standardroute
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// Socket.io Listener
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
        //camera.start();
        console.log("in teh app.js");

        cam.prepare({"timeout" : 150,
            "width" : 2592,
            "height" : 1944,
            "quality" : 85
        }).takePicture("mypicture.jpg",callback);


        function callback(file,error){

            //do some fun stuff
            if (!error) {
                console.log("Picture filename:" + file);
            }else{
                console.log("Error:" + error)
            }

        }
    });

    //Wake on Lan
    socket.on('wol', function(data) {

        wol.wake(data.mac, function(error) {
            if (error) {
                console.log('[something went wrong with Wake on Lan', err,']')
            } else {
                console.log('[Wake on Lan for:', data.mac,']')
            }
        });
    });

    //System Informationen auslesen und an den Browser senden
    socket.on('sysinfo', function() {
        socket.emit('sysinfo', systeminfo.getSystemInfo());
    });

});


