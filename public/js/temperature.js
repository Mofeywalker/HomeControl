var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('temperature', function(data) {
        console.log("Temperature: " + data.temperature);
         $("#tempAkt").innerText = data.temperature + " °C";
    });

    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 10000);
});