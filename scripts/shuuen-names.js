const NAME_DATA = getNameData();
let search_results = [];
let search_idx = -1;
let letter;
const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

function getNameData() {
    return fetch("./scripts/JP-given-name-endings.json").then((res) =>
        res.json(),
    );
}

function generateName(event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        formData.get("letter") ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    let hidden_nav = document.getElementById("search-indicators");
    hidden_nav.classList.add("d-none");

    // Randomly pick kanji
    NAME_DATA.then((data) => {
        const keys = Object.keys(data);
        let kanji = keys[Math.floor(Math.random() * keys.length)];
        showNameInfo(kanji);
    });
    return false;
}
document.getElementById("name-gen").addEventListener("submit", generateName);

function lookupEnding(event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        document.getElementById("letter").value ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    let ending = formData.get("ending");
    if (!ending) {
        return false;
    }
    // If user supplied a romanized name ending, search it
    if (isAlpha(ending)) {
        searchName(ending);
        let hidden_nav = document.getElementById("search-indicators");
        hidden_nav.classList.remove("d-none");
    } else { // else use supplied kanji
        let kanji = formData.get("kanji");
        showNameInfo(kanji);;
    }
    return false;
}
document
    .getElementById("ending-lookup")
    .addEventListener("submit", lookupEnding);

function copyName() {
    var copyText = document.getElementById("name");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
}

function searchName(ending) {
    NAME_DATA.then((data) => {
        search_results = [];
        search_idx = 0;
        for (const kanji in data) {
            const values = data[kanji];
            if (values.readings.some((el) => el == ending)) {
                search_results.push(kanji);
            }
        }
        showSearchRes();
    });
}

function prevSearchRes() {
    search_idx =
        (search_idx + search_results.length - 1) % search_results.length;
    showSearchRes();
}

function nextSearchRes() {
    search_idx =
        (search_idx + search_results.length + 1) % search_results.length;
    showSearchRes();
}

function showSearchRes() {
    let indicator = document.getElementById("item-number");
    indicator.textContent = `${search_idx + 1} out of ${search_results.length}`;
    showNameInfo(search_results[search_idx]);
}

function showNameInfo(kanji) {
    NAME_DATA.then((data) => {
        const values = data[kanji];

        const nameEl = document.getElementById("name");
        const meaningsEl = document.getElementById("meanings");
        const readingsEl = document.getElementById("readings");
        const namesEl = document.getElementById("names");
        const jishoEl = document.getElementById("jisho");

        meaningsEl.innerHTML =
            readingsEl.textContent =
            namesEl.textContent =
            jishoEl.href =
            nameEl.value =
                "";

        if (!values) {
            readingsEl.textContent =
                "(Unknown given name ending.)";
        } else {
            nameEl.value = `${letter}${kanji}`;
            jishoEl.href = `https://jisho.org/search/${encodeURI(kanji)}`;
            meaningsEl.innerHTML = values.meanings
                .map((m) => `<li>${m}</li>`)
                .join("");
            readingsEl.textContent = values.readings
                .map((r) => `${letter}-${r}`)
                .join(", ");

            namesEl.innerHTML = Object.entries(values.names)
                .map(([key, arr]) => {
                    const items = arr.map((n) => `<li>${n}</li>`).join("");
                    return `
                        <details class="col-md-5 col-lg-4">
                            <summary>${key}</summary>
                            <ul>${items}</ul>
                        </details>`;
                })
                .join("");
        }
    });
}
