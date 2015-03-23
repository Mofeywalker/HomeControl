var socket;
var chart;

$(document).ready(function() {
    setInterval(writeDateTime, 1000);

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
            text: 'Temperature Wohnzimmer'
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



    // TEST
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $('#tempSchnitt').highcharts({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
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
                        y: Math.random()
                    });
                }
                return data;
            }())
        }]
    });

});