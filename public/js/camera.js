var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('camera', function(data) {
        console.log(data);
    });

    $(camera).click(function() {
        console.log("send" + data);
        socket.emit('camera', {});
    });



});