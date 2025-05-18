function getLastUpdateTimestamp(id, filepath) {
    fetch(
        `https://api.github.com/repos/ALTCODE255/altcode255.github.io/commits?path=${filepath}`
    )
        .then((res) => res.json())
        .then((res) => {
            date = new Date(res[0].commit.committer.date);
            formatDate = date.toLocaleString("sv-SE").split(" ")[0];
            formatTime = date.toLocaleTimeString();
            document.getElementById(id).innerHTML = formatDate + " @ " + formatTime;
        });
}


function getHits(path) {
    path = path.replace("/", "%2F");
    document.getElementById("hits").src = `https://hitscounter.dev/api/hit?url=altcode255.github.io${path}&label=Page+Visits&color=%23f5b52c`;
}