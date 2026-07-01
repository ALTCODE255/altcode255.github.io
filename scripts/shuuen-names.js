// Update URL parameters based on user inputs
function updateURL(letter = false, ending = false, meaning = false) {
    if (userTriggered) {
        url.search = "";
        if (letter == true && letterInput.value)
            url.searchParams.set("letter", letterInput.value);
        if (ending == true && endingInput.value)
            url.searchParams.set("ending", endingInput.value);
        if (meaning == true && meaningInput.value)
            url.searchParams.set("meaning", meaningInput.value);
        window.history.pushState({}, "", url);
    }
}

// Generate a random name
function generateName(event) {
    event.preventDefault();
    updateURL((letter = true));

    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        formData.get("letter") ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));
    meaning = null;

    hidden_nav.classList.add("d-none");

    // Randomly pick kanji
    nameData.then((data) => {
        const keys = Object.keys(data);
        ending = keys[Math.floor(Math.random() * keys.length)];
        showNameInfo(ending);
    });

    return false;
}

// Lookup info for specified name ending
function lookupEnding(event) {
    event.preventDefault();
    updateURL((letter = true), (ending = true));

    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        document.getElementById("letter").value ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    ending = formData.get("ending");
    if (!ending) return false;
    meaning = null;

    // If user supplied a romanized name ending, search it
    if (isAlpha(ending)) {
        nameData.then((data) => {
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

        hidden_nav.classList.remove("d-none");
    } else {
        // else use supplied kanji
        showNameInfo(ending);
        hidden_nav.classList.add("d-none");
    }
    return false;
}

// Lookup kanji that match a meaning
function lookupMeaning(event) {
    event.preventDefault();
    updateURL((letter = true), (ending = false), (meaning = true));

    const formData = new FormData(this);

    // Randomly pick letter if not user-submitted
    letter =
        document.getElementById("letter").value ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    ending = null;
    meaning = formData.get("meaning");
    if (!meaning) return false;

    // If user supplied a meaning, search it
    nameData.then((data) => {
        search_results = [];
        search_idx = 0;
        let re = new RegExp(String.raw`\b${meaning}\b`, "i");
        for (const kanji in data) {
            const values = data[kanji];
            if (values.meanings.some((el) => re.test(el))) {
                search_results.push(kanji);
            }
        }
        showSearchRes();
    });
    hidden_nav.classList.remove("d-none");
    return false;
}

// Copy name to clipboard
function copyName() {
    var copyText = document.getElementById("name");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
}

// Copy link of corresponding name to clipboard
function copyLink() {
    navigator.clipboard.writeText(
        `${location.origin}${location.pathname}?letter=${letter}&ending=${ending}`,
    );
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

        if (!values) {
            nameEl.value =
                jishoEl.href =
                meaningsEl.innerHTML =
                namesEl.innerHTML =
                    "";
            readingsEl.textContent = "(Given name ending/meaning not found.)";
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
const meaningForm = document.getElementById("meaning-search");
const letterInput = document.getElementById("letter");
const endingInput = document.getElementById("ending");
const meaningInput = document.getElementById("meaning");
const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

const hidden_nav = document.getElementById("search-indicators");

// Add event listeners
letterForm.addEventListener("submit", generateName);
endingForm.addEventListener("submit", lookupEnding);
meaningForm.addEventListener("submit", lookupMeaning);

let search_results = [];
let search_idx = -1;

// Fill in form fields from URL parameters if applicable
const url = new URL(window.location);
let letter = url.searchParams.get("letter");
let ending = url.searchParams.get("ending");
let meaning = url.searchParams.get("meaning");

document.getElementById("letter").value = letter;
document.getElementById("ending").value = ending;
document.getElementById("meaning").value = meaning;

// Submit form if any field is filled
let userTriggered = false;
if (meaning) meaningForm.requestSubmit();
else if (ending) endingForm.requestSubmit();
else if (letter) letterForm.requestSubmit();
userTriggered = true;
