var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('temperature', function(data) {
         $("#tempAkt").innerHTML = data.temperature + " °C";
    });

    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 1500);
});