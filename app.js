
// Modulsetup

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
    handleTemperature = require('./temperatureHandler.js');

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

// 404 Error fuer nicht vorhandene Routen
app.get('*', function(req, res){
    res.sendStatus(404);
});

// Socket.io Listener
io.sockets.on('connection', function(socket) {

    console.log("[Verbindung hergestellt fuer: "+socket.request.connection.remoteAddress+"]");

    // Handler fuer die verschiedenen Websocket Anfragen
    handleSwitches(socket);
    handleWols(socket);
    handleCamera(socket);
    handleWeather(socket);
    handleTemperature(socket);

    //Disconnect
    socket.on('disconnect', function() {
        console.log("[Verbindung beendet fuer: "+socket.request.connection.remoteAddress+"]");
    });


    //System Informationen auslesen und an den Browser senden
    socket.on('sysinfo', function() {
        socket.emit('sysinfo', systeminfo.getSystemInfo());
    });

});