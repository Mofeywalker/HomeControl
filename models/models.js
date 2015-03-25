var models = ['./switches.js', './wols.js'];

exports.initialize = function() {
    var len = models.length;
    for (var i = 0; i < len; i++) {
        require(models[i])();
    }
};