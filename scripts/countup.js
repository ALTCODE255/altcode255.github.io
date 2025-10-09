var start = new Date(2019, 1, 11, 0, 0, 0, 0); // February 11th, 2019

function updateClock() {
    now = new Date();
    var sec = Math.round((now.getTime() - start.getTime()) / 1000);

    var y = Math.floor(sec / (86400*365));
    sec = sec - (y * (86400*365));
    var d = Math.floor(sec / 86400);
    sec = sec - (d * 86400);
    var h = Math.floor(sec / 3600);

    document.getElementById("time-elapsed").innerHTML =
        y + " year(s), " + d + " day(s), " + h + " hour(s)";
}

updateClock();
