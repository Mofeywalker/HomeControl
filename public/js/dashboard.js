var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('temperature', function(data) {
        console.log("Temperature: " + data.temperature);
         $("#tempAkt").text(data.temperature + " °C");
    });

    socket.emit('tempsensor',{});

    setInterval(writeDateTime, 1000);

    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 10000);


});