var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('camera', function(data) {
        console.log(data);
        document.getElementById("camPic").innerHTML="<img id='camPic' src='camPics/camPic.jpg' width='800' height='600'>";
    });

    socket.emit('camera', {});

});