var mongoose = require('mongoose'),
    wol      = require('wake_on_lan'),
    Wol      = mongoose.model('Wol');

module.exports = function(socket) {
    socket.on('wol_create', function(req) {
        Wol.find({mac: req.mac}, function(error, objects) {
            if (error) {
                console.log('[MONGODB - Fehler beim Suchen in der Datenbank]');
            } else {
                if (objects.length === 0) {
                    var newWol = new Wol({
                        name: req.name,
                        mac: req.mac
                    });
                    newWol.save(function(err) {
                        if (err) {
                            console.log("[MONGODB - Probleme beim anlegen eines neuen WOL-Objekts!]");
                        } else {
                            console.log("[MONGODB - Neues WOL-Objekt erfolgreich angelegt!]");
                        }
                    });
                }
            }
        });
    });

    socket.on('wol_all_request', function() {
        Wol.find({}, function(error, objects) {
            if (error) {
                console.log(error.toString());
            } else {
                socket.emit('wol_all_response', objects);
            }
        })
    });

    socket.on('wol_update_request', function(req) {
        var update_wol_data = new Wol ({
            name: req.name,
            mac: req.mac
        });

        var upsertData = update_wol_data.toObject();

        delete upsertData._id;
        Wol.update({code: update_wol_data.code}, upsertData, {upsert: true}, function(err) {
            console.log("[MONGODB - Update nicht moeglich]");
        });
    });


    socket.on('wol_delete_request', function(req) {
        Wol.find({mac: req.mac}).remove().exec();
    });

    socket.on('wakeonlan_control', function(data) {

        wol.wake(data.mac, function(error) {
            if (error) {
                console.log('[something went wrong with Wake on Lan', err,']')
            } else {
                console.log('[Wake on Lan for:', data.id,' ',data.mac,']')
            }
        });
    });

};