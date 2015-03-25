var mongoose = require('mongoose');

module.exports = function() {
    var Switch = new mongoose.Schema({
        name: String,
        code: String
    });
    mongoose.model('Switch', Switch);
    console.log("export Switch");
};