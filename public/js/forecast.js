// Wenn Seite geladen ist
$(document).ready(function() {
    // Abfrage über Socket starten
    socket.emit('weatherlocation_request');

    // Bei Antwort Informationen verarbeiten
    socket.on('weatherlocation_response', function(data){
        var cityName = data.weatherlocation;
        $.ajax({
            dataType: "jsonp",
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + ',de&units=metric&lang=de&cnt=4',
            success: function(data) {
                console.log(data);

                // An zugehörige Stelle auf Dashboard einfügen
                $("#forecast").append(
                    '<h2>' + cityName + '</h2>'
                )
                $.each(data.list, function (index, value) {
                    // Datum Berechnen, Monat inkrementieren
                    var datum = new Date(value.dt*1000);
                    var tag = datum.getDate();
                    var monat = datum.getMonth();
                    monat++;
                    // Führende Nullen falls nötig anfügen
                    if(tag < 10){
                        tag = '0'+tag;
                    }
                    if(monat < 10){
                        monat = '0'+monat;
                    }
                    var datumtext = tag+'.'+monat+'.';
                    // Wetterinformationen anfügen
                    $("#forecast").append(
                        '<div class="col-md-3 col-xs-12 wetter">'
                        + datumtext + '<br>'
                        +'<img src="http://openweathermap.org/img/w/'+value.weather[0].icon+'.png">'
                        + value.temp.day + "&deg;C  "
                        +'</div>'
                    )
                });
            }
        });
    });


});