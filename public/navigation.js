$(document).ready(function(){
    $("#content").load("dashboard.html");
        //e.preventDefault();

});

function navLoad($what){

    switch($what){
        case "navDashboard":
            $("#content").load("dashboard.html");
            break;
        case "navSwitch":
            $("#content").load("switch.html");
            break;
        case "navSysinfo":
            $("#content").load("sysinfo.html");
            break;
        default: break;
    }
}