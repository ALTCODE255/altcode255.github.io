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
            let x_val = new Array();
            let y_akc = new Array();
            let y_sth = new Array();
            let y_sp = new Array();

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
                item = Object.values(data)[idx];
                table += `
                    <tr>
                        <td class="px-3">${item.date}</td>
                        <td class="px-3">${item.akechi}</td>
                        <td class="px-3">${item.sonic}</td>
                        <td class="px-3">${item.shuuen}</td>
                    </tr>`;
                x_val.push(item.date);
                y_akc.push(item.akechi);
                y_sth.push(item.sonic);
                y_sp.push(item.shuuen);
            }

            graph = document.getElementById("graph");
            layout = {
                title: "Word Count Over Past 30 Days",
                paper_bgcolor: "rgba(0, 0, 0, 0)",
                plot_bgcolor: "rgba(0, 0, 0, 0)",
                font: {
                    color: 'white',
                },
                xaxis: {
                    fixedrange: true,
                    showgrid: false,
                },
                yaxis: {
                    fixedrange: true,
                    showgrid: false,
                },
            };
            plot_data = [
                {
                    x: x_val,
                    y: y_akc,
                    mode: "lines",
                    name: "Akechi",
                    marker: {
                        color: "rgb(216, 59, 59)"
                    }
                },
                {
                    x: x_val,
                    y: y_sth,
                    mode: "lines",
                    name: "Sonic",
                    marker: {
                        color: "rgb(22, 99, 162)"
                    }
                },
                {
                    x: x_val,
                    y: y_sp,
                    mode: "lines",
                    name: "Shuuen",
                    marker: {
                        color: "rgb(214, 51, 132)"
                    }
                },
            ];
            config = {
                displayModeBar: false,
            };
            Plotly.newPlot(
                graph,
                plot_data,
                layout,
                config
            );

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
