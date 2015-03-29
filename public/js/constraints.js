/**
 * Created by informaniac on 23.03.15.
 */

/**
 * checkCode
 * Überprüfen des eingegebenen Codes bei Anlegen einer Steckdose
 * Code muss eine zehnstellige Binärzahl sein
 */
function checkCode(){
    // lese eingegebenen Code aus
    var code = $("#code").val();
    // kreiere Regulären Ausdruck für eine zehnstellige Binärzahl
    var regex = '^[0-1]{10}$';
    var constraint = new RegExp(regex);

    // teste auf gleichheit
    if(constraint.test(code)){
        // sind sie gleich, aktiviere Speichern-Button
        document.getElementById("steck-save").disabled = false;
        document.getElementById("steck-save").innerHTML = "Speichern";
    }
    else{
        // sind sie ungleich, deaktiviere Speichern-Button mit Nachricht Code zu Überprüfen
        document.getElementById("steck-save").disabled = true;
        document.getElementById("steck-save").innerHTML = "Pr&uuml;fe Code";
    }
}

/**
 * checkCodeIndex
 * funktioniert wie checkCode
 * @param index Index, an welcher Stelle der zu überprüfender Code steht
 */
function checkCodeIndex(index){
    var code = $("#steck"+index+"code").val();
    var regex = '^[0-1]{10}$';
    var constraint = new RegExp(regex);

    if(constraint.test(code)){
        document.getElementById("steck"+index+"save").disabled = false;
        document.getElementById("steck"+index+"save").innerHTML = "Speichern";
    }
    else{
        document.getElementById("steck"+index+"save").disabled = true;
        document.getElementById("steck"+index+"save").innerHTML = "Pr&uuml;fe Code";
    }
}

/**
 * checkMac
 * analog zu CheckCode, überprüft Gültigkeit einer MAC-ID
 * Gültige Formate: Getrennt mit Bindestrich oder ganz ohne Trennzeichen
 */
function checkMac(){
    var code = $("#mac-id").val();
    var regex = '^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}){6}$';
    var constraint = new RegExp(regex);

    if(constraint.test(code)){
        document.getElementById("wol-save").disabled = false;
        document.getElementById("wol-save").innerHTML = "Speichern";
    }
    else{
        document.getElementById("wol-save").disabled = true;
        document.getElementById("wol-save").innerHTML = "Pr&uuml;fe MAC-ID";
    }
}

/**
 * checkMacIndex
 * funktioniert wie checkMac
 * @param index Index, an welcher Stelle zu überprüfende MAC-Adresse steht
 */
function checkMacIndex(index){
    var code = $("#wol"+index+"mac-id").val();
    var regex = '^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}){6}$';
    var constraint = new RegExp(regex);

    if(constraint.test(code)){
        document.getElementById("wol"+index+"save").disabled = false;
        document.getElementById("wol"+index+"save").innerHTML = "Speichern";
    }
    else{
        document.getElementById("wol"+index+"save").disabled = true;
        document.getElementById("wol"+index+"save").innerHTML = "Pr&uuml;fe MAC-ID";
    }
}