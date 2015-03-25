var mongoose = require('mongoose');

module.exports = function() {
    var Wol = new mongoose.Schema({
        name: String,
        mac: String
    });
    mongoose.model('Wol', Wol);
    console.log("export Wol");
};