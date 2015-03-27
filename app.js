
// Modulsetup
<<<<<<< Updated upstream
=======
var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    conf        = require('./config.json'),
    wol         = require('wake_on_lan'),
    ts          = require('ds18x20'),
    rc          = require('piswitch'),
    mongoose    = require('mongoose'),
    systeminfo  = require('./libs/systeminfo.js'),
    raspicam    = require('raspicam'),
    Camera      = require('camerapi');

var cam = new Camera();

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
>>>>>>> Stashed changes

// Models der MongoDB laden, muss als erstes passieren, da andere Funktionen davon abhaengen!!
var mongoose    = require('mongoose');
require('./models/models.js').initialize();
var Switch = mongoose.model('Switch');
var Wol = mongoose.model('Wol');

var express         = require('express'),
    app             = express(),
    server          = require('http').createServer(app),
    io              = require('socket.io').listen(server),
    systeminfo      = require('./libs/systeminfo.js'),
    bodyParser      = require('body-parser'),
    nconf           = require('nconf'),
    handleSwitches  = require('./switchHandler.js'),
    handleWols      = require('./wolHandler.js'),
    handleCamera    = require('./cameraHandler.js'),
    handleWeather   = require('./weatherHandler'),
    handleTemperature = require('./temperatureHandler.js'),
    tempSensor;



// Config einlesen
nconf.use('file', {file: './config.json'});
nconf.load();

// Verbindung zur Datenbank aufbauen
mongoose.connect('mongodb://localhost/homecontrol');

// Callback fuer Fehler und erfolgreiches Verbinden mit der Datenbank
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("[MongoDB - Verbindung zur Datenbank steht!]");
});

//Server starten
server.listen(nconf.get('port'));
console.log("[Server.Listen]");

// Express im statischen Modus verwenden
app.use(express.static(__dirname + '/public'));

// Benoetigt um Post Anfragen mit application/json zu parsen
app.use(bodyParser.json());

// Standardroute
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// 404 Error fuer nicht vorhandene ROuten
app.get('*', function(req, res){
    res.sendStatus(404);
});

// Socket.io Listener
io.sockets.on('connection', function(socket) {

    console.log("[Connection established for: "+socket.request.connection.remoteAddress+"]");

    handleSwitches(socket);
    handleWols(socket);
    handleCamera(socket);
    handleWeather(socket);
    handleTemperature(socket);



    /*-----------------------------------------------------Temperatur--------------------------------------------------*/

    /*
    if (tempSensor === null || tempSensor === "null") {
        setInterval(function(data){
            child = exec("cat /sys/bus/w1/devices/"+ tempSensor+ "/w1_slave", function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                } else {
                    // You must send time (X axis) and a temperature value (Y axis)
                    var pos = stdout.indexOf("t=");
                    var res = stdout.substring(pos+2, pos+8);
                    var temp = parseFloat(res)/1000;
                    var date = new Date().getTime();

                    socket.emit('temperatureUpdate', date, temp);
                }
            });
        }, 10000);
    }

*/
    /*-----------------------------------------------------Ende Temperatur--------------------------------------------------*/

    //Disconnect
    socket.on('disconnect', function() {
        console.log("[Connection closed for: "+socket.request.connection.remoteAddress+"]");
    });


    //System Informationen auslesen und an den Browser senden
    socket.on('sysinfo', function() {
        socket.emit('sysinfo', systeminfo.getSystemInfo());
    });

});








