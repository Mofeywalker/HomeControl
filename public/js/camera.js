$(document).ready(function() {
    // Mit dem Websocket verbinden
    var socket;
    socket = io.connect();

    // Websocket-Listener, der auf eingehende Kameraaktualisierungen wartet
    socket.on('camera', function(data) {
        console.log(data);
        var d = new Date();
        // Bild in die Website einbinden
        document.getElementById("camPic").src = "camPics/camPic.jpg?ver="+d.getTime();
    });

    // Anfrage fuer ein neues Foto, wird beim refresh der Seite ausgefuehrt
    socket.emit('camera', {});

});