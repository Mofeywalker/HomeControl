var socket;
$(document).ready(function() {
    socket = io.connect();

    socket.on('temperature', function(data) {
        console.log("Temperature: " + data.temperature);
         $("#tempAkt").text(data.temperature + " °C");
    });

    socket.emit('tempsensor',{});

    setInterval(writeDateTime, 1000);

    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 10000);


    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart',
            defaultSeriesType: 'spline',
            events: {
                load: function() {
                    // Each time you receive a value from the socket, I put it on the graph
                    socket.on('temperatureUpdate', function (time, data) {
                        var series = chart.series[0];
                        series.addPoint([time, data]);
                    });
                }
            }
        },
        rangeSelector : {
            selected : 100
        },
        title: {
            text: 'Temperature Home'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Temperature ºC',
                margin: 80
            }
        },
        series: [{
            name: 'Temperature',
            data: []
        }]
    });

});