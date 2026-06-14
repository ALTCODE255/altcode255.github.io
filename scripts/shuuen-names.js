const NAME_DATA = getNameData();
const keys = NAME_DATA.then((data) => Object.keys(data));

function getNameData() {
    return fetch("./JP-given-name-endings.json").then((res) => res.json());
}

function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(this);

    let letter =
        formData.get("letter") ||
        String.fromCharCode(65 + Math.floor(Math.random() * 26));

    let kanji = formData.get("kanji");
    if (!kanji) {
        NAME_DATA.then((data) => {
            const keys = Object.keys(data);
            kanji = keys[Math.floor(Math.random() * keys.length)];
            showNameInfo(letter, kanji);
        });
    } else showNameInfo(letter, kanji);
    return false;
}
document.getElementById("name-gen").addEventListener("submit", submitForm);

function copyName() {
    var copyText = document.getElementById("name");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
}

function showNameInfo(letter, kanji) {
    NAME_DATA.then((data) => {
        const values = data[kanji];

        const nameEl = document.getElementById("name");
        const meaningsEl = document.getElementById("meanings");
        const readingsEl = document.getElementById("readings");
        const namesEl = document.getElementById("names");
        const jishoEl = document.getElementById("jisho");

        meaningsEl.textContent =
        readingsEl.textContent =
        namesEl.textContent =
        jishoEl.href =
        nameEl.value = 
        "";
        
        if (!values) {
            readingsEl.textContent = "(Entered kanji is not a known given name ending.)"
        } else {
            nameEl.value = `${letter}${kanji}`;
            jishoEl.href = `https://jisho.org/search/${encodeURI(kanji)}`;
            meaningsEl.innerHTML = `<li>${values.meanings.join("</li><li>")}</li>`;
            readingsEl.textContent = values.readings
                .map((r) => `${letter}-${r}`)
                .join(", ");

            namesEl.innerHTML = Object.entries(values.names)
                .map(([key, arr]) => {
                    const items = arr.map((n) => `<li>${n}</li>`).join("");
                    return `
                        <details class="col-4">
                            <summary>${key}</summary>
                            <ul>${items}</ul>
                        </details>`;
                })
                .join("");
        }
    });
}
