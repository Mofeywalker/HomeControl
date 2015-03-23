
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
    Camera      = require('camerapi'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser')
    exec        = require('child_process').exec;

// Verbiondung zur Datenbank aufbauen
mongoose.connect('mongodb://localhost/switches');

// Callback fuer Fehler und erfolgreiches Verbinden mit der Datenbank
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log("Verbindung zur Datenbank steht!");
});

// Schema fuer die Switches
var switchSchema = mongoose.Schema({
    name: String,
    code: String
});

var Switch = mongoose.model('Switch', switchSchema);

//Kamera
var cam = new Camera();

// PiSwitch Konfiguration aus der config.json lesen
rc.setup(conf.remotecontrol);

// Treiber fuer den Temperatursensor testen
ts.loadDriver(function (err) {
    if (err) console.log('[something went wrong loading the driver:', err,']')
    else console.log('[TempSensor driver is loaded]');
});

//Server starten
server.listen(conf.port);
console.log("[Server.Listen]");

// Express im statischen Modus verwenden
app.use(express.static(__dirname + '/public'));

// Benoetigt um Post Anfragen mit application/json zu parsen
app.use(bodyParser.json());

// Standardroute
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

/*-------------------------------------------------------Switches-----------------------------------------------------*/
// Route um alle Switches abzufragen
app.get('/api/switches/all', function(req, res) {
    Switch.find({}, function(error, data) {
        res.json(data);
    });
});

// Route um einen bestimmten Switch zurueck geliefert zu bekommen
// Aufruf folgendermassen: /api/switches/name/Esszimmer, Antowrt als json
app.get('/api/switches/name/:name', function(req, res) {
    console.log(req.param("name"));
    Switch.findOne({name: req.param("name")}, function(error, data) {
       res.json(data);
    });
});

// Route um neuen Switch anzulegen
app.post('/api/switches/create', function(req, res) {
    var new_switch_data = new Switch ({
        name: req.body.name,
        code: req.body.code
    });

    var newSwitch = new Switch(new_switch_data);

    newSwitch.save(function(err) {
        if (err) {
            console.log("[MONGODB - Probleme beim anlegen eines neuen Switch!]");
        } else {
            console.log("[MONGODB - Neuer Switch erfolgreich angelegt!]");
        }
    });
    res.end("\nyes");
});

// Route um vorhandenen Switch zu updaten
app.post('/api/switches/update', function(req, res) {
    var update_switch_data = new Switch ({
        name: req.body.name,
        code: req.body.code
    });

    var upsertData = update_switch_data.toObject();

    delete upsertData._id;
    Switch.update({name: update_switch_data.name}, upsertData, {upsert: true}, function(err) {
        console.log("[MONGODB - Update nicht moeglich]");
    });
    res.end("\nyes");
});

// Route um bestimmte Switch zu loeschen
app.post('/api/switches/delete', function(req, res) {
    Switch.find({name: req.body.name}).remove().exec();
    res.end("\nyes");
});
/*-----------------------------------------------------Ende Switches--------------------------------------------------*/


// 404 Error fuer nicht vorhandene ROuten
app.get('*', function(req, res){
    res.sendStatus(404);
});

// Socket.io Listener
io.sockets.on('connection', function(socket) {
    console.log("[Connection established for: "+socket.request.connection.remoteAddress+"]");

    /*-----------------------------------------------------Temperatur--------------------------------------------------*/
    setInterval(function(data){
        child = exec("cat /sys/bus/w1/devices/28-00000400afdb/w1_slave", function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            } else {
                // You must send time (X axis) and a temperature value (Y axis)
                var date = new Date().getTime();
                var temp = parseFloat(stdout);
                io.socket.emit('temperatureUpdate', date, temp);
            }
        });
    }, 5000);
    /*-----------------------------------------------------Ende Temperatur--------------------------------------------------*/

    //Disconnect
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

        cam.baseFolder('/opt/nodejs/HomeControl/public/camPics');
        cam.prepare({"timeout" : 150,
            "width" : 800,
            "height" : 600,
            "quality" : 85
        }).takePicture("camPic.jpg",callback);

        function callback(file,error){
            if (!error) {
                console.log("Picture filename:" + file);
                socket.emit('camera', { camera: file });
            }else{
                console.log("Error:" + error)
            }
        }
    });

    //Wake on Lan
    socket.on('wakeonlan_control', function(data) {

        wol.wake(data.mac, function(error) {
            if (error) {
                console.log('[something went wrong with Wake on Lan', err,']')
            } else {
                console.log('[Wake on Lan for:', data.id,' ',data.mac,']')
            }
        });
    });

    //System Informationen auslesen und an den Browser senden
    socket.on('sysinfo', function() {
        socket.emit('sysinfo', systeminfo.getSystemInfo());
    });

    socket.on('temp_sensors_request', function(data) {
        socket.emit('temp_sensors_response', ts.list());
    });

});


