/**
 * Created by informaniac on 23.03.15.
 */

function checkCode(){
    var code = $("#code").val();
    var regex = '^[0-1]{10}$';
    var constraint = new RegExp(regex);

    if(constraint.test(code)){
        document.getElementById("steck-save").disabled = false;
        document.getElementById("steck-save").innerHTML = "Speichern";
    }
    else{
        document.getElementById("steck-save").disabled = true;
        document.getElementById("steck-save").innerHTML = "Pr&uuml;fe Code";
    }
}

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

function checkMac(){
    var code = $("#mac-id").val();
    var regex = '^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}){6}$';
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

function checkMacIndex(index){
    var code = $("#wol"+index+"mac-id").val();
    var regex = '^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}){6}$';
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