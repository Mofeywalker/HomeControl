var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.emit('sysinfo', {});

    socket.on('sysinfo', function(data) {
        console.log(data);
        $("#hostname").text(data.hostname);
        $("#ostype").text(data.ostype);
        $("#osplat").text(data.osplat);
        $("#release").text(data.release);
        $("#uptime").text(data.uptime);
        $("#freemem").text(data.freemem);
    });

    setInterval(function() {
        socket.emit('sysinfo', {});
    }, 5000);

});