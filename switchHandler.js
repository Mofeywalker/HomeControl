var mongoose    = require('mongoose'),
    rc          = require('piswitch'),
    nconf       = require('nconf'),
    Switch      = mongoose.model('Switch');

// Config einlesen
nconf.use('file', {file: './config.json'});
nconf.load();

// PiSwitch Konfiguration aus der config.json lesen
rc.setup(nconf.get('remotecontrol'));

module.exports = function(socket) {
    socket.on('switch_create', function(data) {
        Switch.find({code: data.code}, function (error, objects)  {
            if (error) {
                console.log("[MONGODB - Fehler beim Suchen in der Datenbank]");
            } else {
                if (objects.length === 0) {
                    var newSwitch = new Switch({
                        name: data.name,
                        code: data.code
                    });

                    newSwitch.save(function(err) {
                        if (err) {
                            console.log("[MONGODB - Probleme beim anlegen eines neuen Switch!]");
                        } else {
                            console.log("[MONGODB - Neuer Switch erfolgreich angelegt!]");
                        }
                    });
                } else {
                    console.log("[MONGODB - Fehler, Switch mit dem Code schon vorhanden]");
                }
            }
        });
    });

    socket.on('switch_all_request', function(req) {
        Switch.find({}, function(error, objects) {
            if (error) {
                console.log(error.toString());
            } else {
                console.log(reg.type);
                if (req.type === 'overview') {
                    socket.emit('switch_all_response_overview', objects);
                }
                else {
                    socket.emit('switch_all_response_settings', objects);
                }
            }
        });

    });

    socket.on('switch_name_request', function(req) {
        Switch.findOne({name: req.name}, function(error, objects) {
            if (error) {
                console.log(error.toString());
            } else {
                socket.emit('switch_name_response', objects);
            }
        });
    });

    socket.on('switch_update_request', function(req) {
        var update_switch_data = new Switch ({
            name: req.newname,
            code: req.newcode
        });

        var upsertData = update_switch_data.toObject();

        delete upsertData._id;
        Switch.update({code: req.oldcode}, upsertData, {upsert: true}, function(err) {
            console.log("[MONGODB - Update nicht moeglich!]");
        });
    });

    socket.on('switch_delete_request', function(req) {
        Switch.find({code: req.code}).remove().exec();
    });

    //Steckdosen
    socket.on('switch_control', function(data) {
        //schalten der Steckdosen
        // Code 1111110000, Typ-Dipschalter, an(false)/aus(true)
        rc.send(data.code, 'dip', data.status);
        console.log("[SEND] " + data.code +" "+ data.status);
    });

};