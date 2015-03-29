// Pfad zu den MongoDB Models
var models = ['./switches.js', './wols.js'];

// Funktion initialize initialisiert die MongoDB Models, sodass sie im Programm genutzt werden koennen
exports.initialize = function() {
    var len = models.length;
    for (var i = 0; i < len; i++) {
        require(models[i])();
    }
};