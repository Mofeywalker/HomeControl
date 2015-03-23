$(document).ready(function() {
    var weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Illingen,de&units=metric&lang=de';
    var wetterart;
    $.ajax({
        dataType: "jsonp",
        url: weather,
        success: function(data) {
            var edit_save;


            for (var i = 1; i <= 4; i++){
                wetterart = data.list[i-1].weather[0].icon
                edit_save = document.getElementById("tag" + i);
                edit_save.src = "http://openweathermap.org/img/w/" + wetterart + ".png"

                document.getElementById("temp_tag" + i).innerHTML = '<h3>'  + data.list[i-1].temp.day + " &deg;C  " + '</h3>';
                document.getElementById("day_tag" + i).innerHTML = '<h3>' + $.datepicker.formatDate('dd.mm.yy', new Date (new Date(data.list[i-1].dt*1000))) + '</h3>';
            }
        }
    });
});