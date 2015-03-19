var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('camera', function(data) {
        console.log(data);
        socket.emit('camera', {});
    });

});