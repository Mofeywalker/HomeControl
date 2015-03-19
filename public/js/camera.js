var socket;
$(document).ready(function() {
    socket = io.connect();

    $(camera).click(function() {
        console.log(data);
        socket.emit('camera', {});

    });
});