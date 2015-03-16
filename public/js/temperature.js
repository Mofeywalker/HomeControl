var socket;
$(document).ready(function() {
    socket = io.connect();
    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 1500);

    io.sockets.on('connection', function(socket) {
        socket.on('temperature', function(data) {
            $("#tempAkt").innerHTML = data.temperature + " °C";
        })
    });
});