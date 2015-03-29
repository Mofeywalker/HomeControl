var mongoose = require('mongoose');

/**
 * Definition des Wake On Lan Models.
 * Wird diese Funktion ausgefuehrt, wird das Model im Programm bekannt gemacht.
 */
module.exports = function() {
    var Wol = new mongoose.Schema({
        name: String,
        mac: String
    });
    mongoose.model('Wol', Wol);
};