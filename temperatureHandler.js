var ts = require('ds18x20'),
    tempSensor,
    tempSensorAvailable = false;

// Treiber fuer den Temperatursensor testen
ts.loadDriver(function (err) {
    if (err) {
        console.log('[DS18X20 - Fehler beim Laden des Temperatur-Treibers:', err,']')
        tempSensorAvailable = false;
    }
    else {
        console.log('[DS18X20 - Temperatur-Treiber erfolgreich geladen]');
        ts.list(function(error, sensors) {
            if (error) {
                console.log("[DS18X20 - Keine Temperatursensoren gefunden]");
                tempSensor = "null";
                tempSensorAvailable = false;
            } else {
                tempSensor = sensors[0];
                tempSensorAvailable = true;
            }
        });
    }
});

if (tempSensorAvailable) {
    setInterval(function(){
        var temp = ts.get(tempSensor);
        var date = new Date().getTime();
        socket.emit('temperatureUpdate', date, temp);
    }, 10000);
}

module.exports = function(socket) {
    //TempSensor
    socket.on('tempsensor', function() {
        if (tempSensorAvailable) {
            ts.get(tempSensor, function (err, temp) {
                socket.emit('temperature', { temperature: temp });
            });
        }
    });

    socket.on('temp_sensors_request', function(data) {
        ts.list(function(error, sensors) {
            if (error) {
                console.log("[DS18X20 - Fehler bei Auslesen der Temperatur-Sensoren]");
            } else {
                console.log(sensors);
                socket.emit('temp_sensors_response', {sensors: sensors});
            }

        });
    });

    /*
    socket.on('temp_sensor_selection', function(data) {
        var new_sensor = new TempSensor(data.sensor);
        TempSensor.find({}, function(error, sensors) {
            if (sensors.length === 0) {
                new_sensor.save();
            } else {
                TempSensor.find({}).remove().exec();
                new_sensor.save();
            }
        })
    });
    */
};