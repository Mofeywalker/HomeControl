var socket;
var chart;
var aktTemp;
var timeinterval;

$(document).ready(function() {

    google.load("feeds", "1");
    function initialize() {
        var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
        feed.load(function(result) {
            if (!result.error) {
                var container = document.getElementById("rssFeed");
                for (var i = 0; i < result.feed.entries.length; i++) {
                    var entry = result.feed.entries[i];
                    var div = document.createElement("div");
                    div.appendChild(document.createTextNode(entry.title));
                    container.appendChild(div);
                }
            }
        });
    }
    google.setOnLoadCallback(initialize);

    timeinterval = setInterval(writeDateTime, 1000);

    socket = io.connect();

    socket.on('temperature', function(data) {
        console.log("Temperature: " + data.temperature);
         $("#tempAkt").text(data.temperature + " °C");
        aktTemp = data.temperature;
    });

    socket.emit('tempsensor',{});

    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 100000);

});