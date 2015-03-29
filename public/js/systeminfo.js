$(document).ready(function() {
    // Mit Websocket verbinden
    var socket;
    socket = io.connect();

    /**
     * Socket-Listener der auf eine sysinfo Antwort wartet. Es werden verschiedenste Systeminfos auf der Seite
     * eingefuegt.
     */
    socket.on('sysinfo', function(data) {
        console.log(data);
        $("#hostname").text(data.hostname);
        $("#ostype").text(data.ostype);
        $("#osplat").text(data.osplat);
        $("#release").text(data.release);
        $("#uptime").text((Math.round((data.uptime / 60)*100)/100) + " min");
        $("#freemem").text((Math.round((data.freemem /1024 /1024)*1000)/1000) + " MB");
    });

    // Systeminfos beim Server anfragen, wird nur beim ersten Mal aufgerufen
    socket.emit('sysinfo', {});

    // Alle 5 Sekunden werden die Infos auf der Seite aktualisiert
    setInterval(function() {
        socket.emit('sysinfo', {});
    }, 5000);

});