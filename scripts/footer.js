var s = document.createElement("script");
s.src = "1.js";
document.getElementsByTagName("head")[0].appendChild(s);

function getLastUpdateTimestamp() {
    if (location.pathname.endsWith("/")) {
        filepath = location.pathname.substring(1) + "index.html";
    } else {
        filepath = location.pathname.endsWith(".html")
            ? location.pathname.substring(1)
            : location.pathname.substring(1) + ".html";
    }
    fetch(
        `https://api.github.com/repos/ALTCODE255/altcode255.github.io/commits?path=${filepath}`
    )
        .then((res) => res.json())
        .then((res) => {
            date = new Date(res[0].commit.committer.date);
            formatDate = date.toLocaleString("sv-SE").split(" ")[0];
            formatTime = date.toLocaleTimeString();
            document.getElementById("last-updated").innerHTML =
                formatDate + " @ " + formatTime;
        });
}

function getHits() {
    path =
        location.pathname == "/"
            ? "/index"
            : location.pathname.replace(".html", "");
    if (path != "/template" && path != "/404") {
        fetch(u, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: k },
            body: JSON.stringify({ site: "altcode255.github.io", page: path }),
        })
            .then((res) => res.text())
            .then((res) => {
                document.getElementById("visits").innerHTML = res;
            });
    }
}

function setFooter() {
    document.getElementById("footer").innerHTML = `
        <hr>
            <b>Total Page Visits: </b><span id="visits"></span><br>
            <b>Page Last Updated: </b><span id="last-updated"></span>
        <hr>
    `;
}

u = atob(u);
k = atob(k);
setFooter();
if (location.hostname == "altcode255.github.io") {
    getLastUpdateTimestamp();
    getHits();
}
