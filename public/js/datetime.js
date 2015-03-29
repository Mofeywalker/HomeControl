/*
 * writeDateTime
 * Funktion um Datum und Zeit an Ihren Platz auf dem Dashboard zu schreiben
 */
function writeDateTime(){
    // Neues Zeitobjekt erzeugen
    var dt = new Date;

    // Tag, Monat und Jahr auslesen
    var d = dt.getDate();
    var m = dt.getMonth();
    // Monat wird von 0-11 zurückgegeben, repräsentativ für Monate 1-12, daher Inkrement
    m++;
    var y = dt.getFullYear();

    // Stunden, Minuten und Sekunden auslesen
    var hh = dt.getHours();
    var mm = dt.getMinutes();
    var ss = dt.getSeconds();

    // Führende Nullen hinzufügen, falls nötig
    if(m < 10){
        m = "0"+m;
    }
    if(hh < 10){
        hh = "0"+hh;
    }
    if(mm < 10){
        mm = "0"+mm;
    }
    if(ss < 10){
        ss = "0"+ss;
    }

    // Ergebnis-String erzeugen
    res = d+'.'+m+'.'+y+"<br>"+hh+':'+mm+':'+ss;

    // Einbinden des Zeit-String
    try{
        document.getElementById("date").innerHTML = res;
    }
    catch (e) {
        clearInterval(timeinterval);
    }
}