var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('sysinfo', function(data) {
        console.log(data);
        $("#hostname").text(data.hostname);
        $("#ostype").text(data.ostype);
        $("#osplat").text(data.osplat);
        $("#release").text(data.release);
        $("#uptime").text((data.uptime / 60) + " min");
        $("#freemem").text((data.freemem /1024 /1024) + " MB");
    });

    socket.emit('sysinfo', {});

    setInterval(function() {
        socket.emit('sysinfo', {});
    }, 5000);

});