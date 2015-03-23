$(document).ready(function() {
    console.log("Forecast document ready");
    //console.log(cityName);
    socket.emit('weatherlocation_request');

    socket.on('weatherlocation_response', function(data) {
        var cityName = data.weatherlocation;
        console.log(cityName);
        $.ajax({
            dataType: "jsonp",
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + ',de&units=metric&lang=de&cnt=4',
            success: function(data) {
                console.log(data);
                //var json = $.parseJSON(data);
                //console.log(json);
                $("#forecast").append(
                    '<h2>' + cityName + '</h2>'
                )
                $.each(data.list, function (index, value) {
                    var datum = new Date(value.dt*1000);
                    var tag = datum.getDate();
                    var monat = datum.getMonth();
                    monat++;
                    if(tag < 10){
                        tag = '0'+tag;
                    }
                    if(monat < 10){
                        monat = '0'+monat;
                    }
                    var datumtext = tag+'.'+monat+'.';
                    console.log(value.dt);
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