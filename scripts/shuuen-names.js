// Update URL parameters
function updateURL() {
    if (letter) {
        url.searchParams.set("letter", letter);
    }
    if (ending) {
        url.searchParams.set("ending", ending);
    }
    window.history.pushState({}, "", url);
}

// Generate a random name
function generateName(event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        formData.get("letter") ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    hidden_nav.classList.add("d-none");

    // Randomly pick kanji
    nameData.then((data) => {
        const keys = Object.keys(data);
        ending = keys[Math.floor(Math.random() * keys.length)];
        showNameInfo(ending);
        updateURL();
    });

    return false;
}

// Lookup info for specified name ending
function lookupEnding(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        document.getElementById("letter").value ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    ending = formData.get("ending");
    if (!ending) {
        return false;
    }

    // If user supplied a romanized name ending, search it
    if (isAlpha(ending)) {
        searchName(ending);
        hidden_nav.classList.remove("d-none");
    } else {
        // else use supplied kanji
        showNameInfo(ending);
        hidden_nav.classList.add("d-none");
    }

    updateURL();
    return false;
}

// Copy name to clipboard
function copyName() {
    var copyText = document.getElementById("name");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
}

function searchName(romaji) {
    nameData.then((data) => {
        search_results = [];
        search_idx = 0;
        for (const kanji in data) {
            const values = data[kanji];
            if (values.readings.some((el) => el == romaji)) {
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
    nameData.then((data) => {
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
            readingsEl.textContent = "(Unknown given name ending.)";
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

// Get name data from JSON file
const nameData = fetch("./scripts/JP-given-name-endings.json").then((res) =>
    res.json(),
);

// Other constants
const letterForm = document.getElementById("name-gen");
const endingForm = document.getElementById("ending-lookup");
const hidden_nav = document.getElementById("search-indicators");
const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

// Add event listeners
letterForm.addEventListener("submit", generateName);
endingForm.addEventListener("submit", lookupEnding);

let search_results = [];
let search_idx = -1;

// Fill in form fields from URL parameters if applicable
const url = new URL(window.location);
let letter = url.searchParams.get("letter");
let ending = url.searchParams.get("ending");

document.getElementById("letter").value = letter;
document.getElementById("ending").value = ending;

// Submit form if either field is filled
if (ending) {
    endingForm.requestSubmit();
} else if (letter) {
    letterForm.requestSubmit();
}
