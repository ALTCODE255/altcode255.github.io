function getLiveTable() {
    fetch(
        "https://gist.githubusercontent.com/ALTCODE255/f674d02b89b93cdeb51ea782e03f06ff/raw/",
        {
            headers: {
                Accept: "application/json",
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            table = `
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th class="px-3">Date</th>
                            <th class="px-3">Akechi</th>
                            <th class="px-3">Sonic</th>
                            <th class="px-3">Shuuen</th>
                        </tr>
                    </thead>
                `;
            for (let idx = 0; idx <= 30; idx++) {
                value = Object.values(data)[idx];
                table += `
                    <tr>
                        <td class="px-3">${value.date}</td>
                        <td class="px-3">${value.akechi}</td>
                        <td class="px-3">${value.sonic}</td>
                        <td class="px-3">${value.shuuen}</td>
                    </tr>`;
            }

            document.getElementById("s-table").innerHTML = table;
        });

    fetch("https://api.github.com/gists/f674d02b89b93cdeb51ea782e03f06ff")
        .then((res) => res.json())
        .then((res) => {
            date = new Date(res.updated_at);
            formatDate = date.toLocaleString("sv-SE").split(" ")[0];
            formatTime = date.toLocaleTimeString();
            document.getElementById("table-updated").innerHTML =
                formatDate + " @ " + formatTime;
        });
}
