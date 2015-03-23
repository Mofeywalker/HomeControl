var socket;
var chart;

var timeinterval;

$(document).ready(function() {
    timeinterval = setInterval(writeDateTime, 1000);

    socket = io.connect();

    socket.on('temperature', function(data) {
        console.log("Temperature: " + data.temperature);
         $("#tempAkt").text(data.temperature + " °C");
    });

    socket.emit('tempsensor',{});

    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 10000);

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'tempVerlauf',
            defaultSeriesType: 'spline',
            backgroundColor: 'rgba(20,20,20,0.2)',
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
            color: '#E0E0E3',
            text: 'Temperatur'
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
                color: '#E0E0E3',
                text: 'Temperatur ºC',
                margin: 80
            }
        },
        series: [{
            name: 'Temperatur',
            data: []
        }]
    });

});