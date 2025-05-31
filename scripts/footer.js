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
        location.pathname == "/" ? "" : location.pathname.replace("/", "%2F");
    if (path != "%2Ftemplate" && path != "%2F404") {
        fetch(
            `https://hitscounter.dev/api/hit?url=altcode255.github.io${path}&output=json`
        )
            .then((res) => res.json())
            .then((res) => {
                document.getElementById("visits").innerHTML = res.total_visits;
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

setFooter();
if (location.hostname == "altcode255.github.io") {
    getLastUpdateTimestamp();
    getHits();
}
