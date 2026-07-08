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
        },
    )
        .then((res) => res.json())
        .then(data);
    promise.then((data) => {
        max_days = data.length;
        document.getElementById("max-days").innerHTML = max_days;
    });
    return promise;
}

function populateStats() {
    fetch(
        "https://gist.githubusercontent.com/ALTCODE255/f674d02b89b93cdeb51ea782e03f06ff/raw/Stats.json",
        {
            headers: {
                Accept: "application/json",
            },
        },
    )
        .then((res) => res.json())
        .then((array) => {
            array.forEach((stats) => {
                document.getElementById("stats").innerHTML = `
                    <b>30-Day Average:</b> ${stats.avg_30d}<br>
                    <b>All-Time Average:</b> ${stats.average}<br>
                    <b>Personal Best:</b> ${stats.best}<br>
                    <b>Total:</b> ${stats.total}`;
                return;
            });
        });
}

function createFromData() {
    num_days = parseInt(document.getElementById("number-of-days").value) || 30;
    DATA_ARRAY.then((data) => data.slice(0, num_days)).then((array) => {
        createTable(array);
        createPlot(array);
    });
    current_num_days = num_days;
    return false;
}

function createTable(array) {
    table_rows = "";
    array.forEach((item) => {
        table_rows += `
            <tr>
                <td class="px-3">${item.date}</td>
                <td class="px-3">${item.total}</td>
            </tr>`;
    });
    document.getElementById("table-rows").innerHTML = table_rows;
}

function createPlot(array) {
    let x_val = new Array();
    let y_sp = new Array();

    array.forEach((item) => {
        x_val.push(item.date);
        y_sp.push(item.total);
    });

    plot = document.getElementById("plot");

    layout = {
        title: {
            text: `"Shuuen" Count Over Past ${array.length} Days`,
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
            fixedrange: false,
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
            y: y_sp,
            mode: "lines",
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
