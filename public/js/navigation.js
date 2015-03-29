/*
 * Einfache Navigation durch Laden der HTML-Dateien in Content-Div
 */

// Beim Laden der Seite Dashboard anzeigen
$(document).ready(function(){
    $("#content").load("dashboard.html");
});

// Unterscheidung, welcher Button gedrückt wurde und hineinladen in Content-Div
function navLoad($what){
    switch($what){
        case "navDashboard":
            $("#content").load("dashboard.html");
            break;
        case "navSwitch":
            $("#content").load("switch.html");
            break;
        case "navWol":
            $("#content").load("wakeonlan.html");
            break;
        case "navSysinfo":
            $("#content").load("sysinfo.html");
            break;
        case "navCamera":
            $("#content").load("camera.html");
            break;
        case "navSettings":
            $("#content").load("settings.html");
        default: break;
    }
    // Schließen der Navbar (mobil)
    closeCollapse();
}

// Funktion um die ausgefahrene Navbar (Mobil) zu schileßen
function closeCollapse(){
    $("#bs-example-navbar-collapse-1").attr("aria-expanded", "false");
    $("#bs-example-navbar-collapse-1").attr("class", "navbar-collapse collapse");
}