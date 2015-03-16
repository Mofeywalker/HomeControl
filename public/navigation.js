$(document).ready(function(){
    $("#content").load("dashboard.html");
    $('.navbar').click(function(e){
        //e.preventDefault();
        var cont = $(this).data('cont');
        switch(cont){
            case "navDashboard":
                $("#content").load("dashboard.html");
                break;
            case "navFernbedienung":
                $("#content").load("switch.html");
                break;
            case "navSysinfo":
                $("#content").load("sysinfo.html");
                break;
            default: break;
        }
    });
});