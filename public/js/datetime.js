function writeDateTime(){
    var dt = new Date;

    var d = dt.getDate();
    var m = dt.getMonth();
    m++;
    var y = dt.getFullYear();

    var hh = dt.getHours();
    var mm = dt.getMinutes();
    var ss = dt.getSeconds();

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

    res = d+'.'+m+'.'+y+"<br>"+hh+':'+mm+':'+ss;

    try{
        document.getElementById("date").innerHTML = res;
    }
    catch (e) {
        clearInterval(timeinterval);
    }
}