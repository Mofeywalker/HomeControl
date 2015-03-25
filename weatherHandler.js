var nconf           = require('nconf');

// Config einlesen
nconf.use('file', {file: './config.json'});
nconf.load();

module.exports = function(socket) {
    socket.on('weatherlocation_request', function() {
        socket.emit('weatherlocation_response', {weatherlocation: nconf.get('weatherlocation')});
    });

    socket.on('weatherlocation_update', function(data) {
        nconf.set('weatherlocation', data.weatherlocation);
        nconf.save(function (err) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Configuration saved successfully.');
        });
    });
};