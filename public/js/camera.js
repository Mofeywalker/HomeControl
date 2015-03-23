var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('camera', function(data) {
        console.log(data);
        var d = new Date();
        document.getElementById("camPic").src = "camPics/camPic.jpg?ver="+d.getTime();
    });

    socket.emit('camera', {});

});