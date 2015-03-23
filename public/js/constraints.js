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

$("#code").keyup(checkCode);