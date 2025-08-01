let DATA_ARRAY = getData();
var max_days;
var current_num_days = 30;

function getData() {
    fetch("https://api.github.com/gists/f674d02b89b93cdeb51ea782e03f06ff")
        .then((res) => res.json())
        .then((res) => {
            date = new Date(res.updated_at);
            formatDate = date.toLocaleString("sv-SE").split(" ")[0];
            formatTime = date.toLocaleTimeString();
            document.getElementById("table-updated").innerHTML =
                formatDate + " @ " + formatTime;
        });
    promise = fetch(
        "https://gist.githubusercontent.com/ALTCODE255/f674d02b89b93cdeb51ea782e03f06ff/raw/",
        {
            headers: {
                Accept: "application/json",
            },
        }
    )
        .then((res) => res.json())
        .then(data);
    promise.then((data) => {
        max_days = data.length;
        document.getElementById("num-days").innerHTML = max_days;
    });
    return promise;
}

function createStatsTable(id) {
    fetch(
        "https://gist.githubusercontent.com/ALTCODE255/f674d02b89b93cdeb51ea782e03f06ff/raw/Stats.json",
        {
            headers: {
                Accept: "application/json",
            },
        }
    )
        .then((res) => res.json())
        .then(data)
        .then((array) => {
            table = `
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th class="px-3">Start</th>
                    <th class="px-3">Word</th>
                    <th colspan=2 class="px-3">Average<br>(30D vs All)</th>
                    <th class="px-3">Best</th>
                    <th class="px-3">Total</th>
                </tr>
            </thead>
        `;
            array.forEach((item) => {
                table += `
            <tr>
                <td class="px-3">${item.start_date}</td>
                <td class="px-3">${item.word}</td>
                <td class="px-3">${item.avg_30d}</td>
                <td class="px-3">${item.average}</td>
                <td class="px-3">${item.best}</td>
                <td class="px-3">${item.total}</td>
            </tr>`;
            });
            document.getElementById(id).innerHTML = table;
        });
}

function createFromData(plot_id, table_id, num_id) {
    num_days = parseInt(document.getElementById(num_id).value) || 30;
    if (num_days >= max_days) {
        if (current_num_days >= max_days) return false;
        DATA_ARRAY.then((array) => {
            createTable(table_id, array);
            createPlot(plot_id, array);
        });
    } else {
        DATA_ARRAY.then((data) => data.slice(0, num_days)).then((array) => {
            createTable(table_id, array);
            createPlot(plot_id, array);
        });
    }
    current_num_days = num_days;
    return false;
}

function createTable(id, array) {
    table = `
    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th class="px-3">Date</th>
                <th class="px-3">Sonic</th>
                <th class="px-3">Shuuen</th>
            </tr>
        </thead>
    `;
    array.forEach((item) => {
        table += `
            <tr>
                <td class="px-3">${item.date}</td>
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
        title: {
            text: `Mention Count Over Past ${array.length} Days`,
        },
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        font: {
            color: "white",
        },
        margin: {
            l: 20,
            r: 20,
            t: 40,
            b: 40,
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
            x: 0.05,
        },
    };

    plot_data = [
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
