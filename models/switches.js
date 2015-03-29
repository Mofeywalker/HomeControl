var mongoose = require('mongoose');

/**
 * Definition des Switch Models, welches eine Fernbedienung abbildet.
 * Wird diese Funktion ausgefuehrt, wird das Model im Programm bekannt gemacht.
 */
module.exports = function() {
    var Switch = new mongoose.Schema({
        name: String,
        code: String
    });
    mongoose.model('Switch', Switch);
};