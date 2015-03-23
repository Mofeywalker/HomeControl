
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
                var pos = stdout.indexOf("t=");
                var res = stdout.substring(pos+2, pos+8);
                var temp = parseFloat(res)/1000;
                var date = new Date().getTime();

                socket.emit('temperatureUpdate', date, temp);
            }
        });
    }, 5000);


    /**
     * Dark theme for Highcharts JS
     * @author Torstein Honsi
     */

// Load the fonts
    Highcharts.createElement('link', {
        href: '//fonts.googleapis.com/css?family=Unica+One',
        rel: 'stylesheet',
        type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

// Apply the theme
    Highcharts.setOptions(Highcharts.theme);

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


