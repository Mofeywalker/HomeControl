var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('sysinfo', function(data) {
        console.log(data);
        $("#hostname").text(data.hostname);
        $("#ostype").text(data.ostype);
        $("#osplat").text(data.osplat);
        $("#release").text(data.release);
        $("#uptime").text((Math.round((data.uptime / 60)*100)/100) + " min");
        $("#freemem").text((Math.round((data.freemem /1024 /1024)*1000)/1000) + " MB");
    });

    socket.emit('sysinfo', {});

    setInterval(function() {
        socket.emit('sysinfo', {});
    }, 5000);

});