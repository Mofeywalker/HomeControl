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
        case "navCamera":
            $("#content").load("camera.html");
        default: break;
    }
    closeCollapse();
}

function closeCollapse(){
    $("#bs-example-navbar-collapse-1").attr("aria-expanded", "false");
    $("#bs-example-navbar-collapse-1").attr("class", "navbar-collapse collapse");
}