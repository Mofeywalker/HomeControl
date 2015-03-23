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
    }, 100000);


    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    var aktTemp = 26;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'tempVerlauf',
            defaultSeriesType: 'spline',
            backgroundColor: 'rgba(20,20,20,0.1)',
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function() {
                    // Each time you receive a value from the socket, I put it on the graph
                    socket.on('temperatureUpdate', function (time, data) {
                        var series = chart.series[0];
                        aktTemp = data;
                        series.addPoint([time, data], true, true);
                    });
                }
            }
        },
        title: {
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: aktTemp
                    });
                }
                return data;
            }())
        }]
    });

});