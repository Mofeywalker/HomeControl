// Kamera Modul laden
var Camera  = require('camerapi'),
    cam     = new Camera();

module.exports = function(socket) {

    //KameraHandler
    socket.on('camera', function() {

        cam.baseFolder(__dirname+ '/public/camPics');
        cam.prepare({"timeout" : 150,
            "width" : 800,
            "height" : 600,
            "quality" : 85
        }).takePicture("camPic.jpg",callback);

        function callback(file,error){
            if (!error) {
                console.log("[KAMERA - Dateipfad/Name:" + file+"]");
                socket.emit('camera', { camera: file });
            } else{
                console.log("[KAMERA - Fehler:" + error+"]")
            }
        }
    });
};