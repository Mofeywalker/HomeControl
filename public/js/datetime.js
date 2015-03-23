function writeDateTime(){
    dt = new Date;

    d = dt.getDate();
    m = dt.getMonth();
    m++;
    y = dt.getFullYear();

    hh = dt.getHours();
    mm = dt.getMinutes();
    ss = dt.getSeconds();

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
    document.getElementById("date").innerHTML = res;
}