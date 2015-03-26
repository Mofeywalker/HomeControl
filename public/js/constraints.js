/**
 * Created by informaniac on 23.03.15.
 */

function checkCode(){
    alert("checkCode aufgerufen");
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

// jetzt im <input> selbst (onkeyup="fkt()")
//$("#code").keyup(checkCode);

function checkCodeIndex(index){
    alert("checkCodeIndex aufgerufen");
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