function getData(update_id) {
    fetch("https://api.github.com/gists/f674d02b89b93cdeb51ea782e03f06ff")
        .then((res) => res.json())
        .then((res) => {
            date = new Date(res.updated_at);
            formatDate = date.toLocaleString("sv-SE").split(" ")[0];
            formatTime = date.toLocaleTimeString();
            document.getElementById(update_id).innerHTML =
                formatDate + " @ " + formatTime;
        });
    return fetch(
        "https://gist.githubusercontent.com/ALTCODE255/f674d02b89b93cdeb51ea782e03f06ff/raw/",
        {
            headers: {
                Accept: "application/json",
            },
        }
    )
        .then((res) => res.json())
        .then((data) => data.slice(0, 30));
}

function createTable(id, array) {
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
    array.forEach((item) => {
        table += `
            <tr>
                <td class="px-3">${item.date}</td>
                <td class="px-3">${item.akechi}</td>
                <td class="px-3">${item.sonic}</td>
                <td class="px-3">${item.shuuen}</td>
            </tr>`;
    });
    document.getElementById(id).innerHTML = table;
}

function createPlot(id, array) {
    let x_val = new Array();
    let y_akc = new Array();
    let y_sth = new Array();
    let y_sp = new Array();

    array.forEach((item) => {
        x_val.push(item.date);
        y_akc.push(item.akechi);
        y_sth.push(item.sonic);
        y_sp.push(item.shuuen);
    });

    plot = document.getElementById(id);

    layout = {
        title: "Mention Count Over Past 30 Days",
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        font: {
            color: "white",
        },
        margin: {
            l: 20,
            r: 20,
            t: 40,
            b: 40
        },
        xaxis: {
            fixedrange: true,
            showgrid: false,
        },
        yaxis: {
            fixedrange: true,
            showgrid: false,
        },
        legend: {
            y: 0.99,
            x: 0.05
        }
    };

    plot_data = [
        {
            x: x_val,
            y: y_akc,
            mode: "lines",
            name: "Akechi",
            marker: {
                color: "rgb(216, 59, 59)",
            },
        },
        {
            x: x_val,
            y: y_sth,
            mode: "lines",
            name: "Sonic",
            marker: {
                color: "rgb(22, 99, 162)",
            },
        },
        {
            x: x_val,
            y: y_sp,
            mode: "lines",
            name: "Shuuen",
            marker: {
                color: "rgb(214, 51, 132)",
            },
        },
    ];

    config = {
        displayModeBar: false,
    };

    Plotly.newPlot(plot, plot_data, layout, config);
}
