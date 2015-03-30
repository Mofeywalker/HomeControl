var socket;
var chart;
var aktTemp;
var timeinterval;

// Wenn Seite geladen
$(document).ready(function() {
    // Datum und Zeit anzeigen, sekündlich aktualisieren
    timeinterval = setInterval(writeDateTime, 1000);

    // Mit Websocket verbinden
    socket = io.connect();

    // Socket-Listener für Temperatur. Schreibt Temperatur an zugehörigen Platz
    socket.on('temperature', function(data) {
        console.log("Temperature: " + data.temperature);
         $("#tempAkt").text(data.temperature + " °C");
        aktTemp = data.temperature;
    });

    // Temperatur abfragen
    socket.emit('tempsensor',{});

    // alle 100 Sekunden wiederholen
    setInterval(function() {
        socket.emit('tempsensor',{});
    }, 100000);

    // ---------------------------------------- Highchart style definieren
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

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
                    // jedes Mal wenn man ein Update vom Sensor bekommt wird der Graph aktualisiert
                    socket.on('temperatureUpdate', function (time, data) {
                        var series = chart.series[0];
                        aktTemp = data;
                        series.addPoint([time, data], true, true);
                    });
                }
            }
        },
        title: {
            color: '#fbfbfb',
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
                color: '#fbfbfb',
                text: 'Temperatur ºC',
                margin: 2
            }
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
            name: 'Temperatur',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -10; i <= 0; i += 1) {
                    data.push({
                        x: time + i + 10000,
                        y: aktTemp
                    });
                }
                return data;
            }())
        }]
    });
    // ---------------------------------------- Highchart style definieren
});