const url =
    "https://script.google.com/macros/s/AKfycbzDzcZhUWzTb8YHojLLKXinYr-qqrPWpoz3V9ChAFVO74Lpg0e8MlECo6sUhDvGEWpmtw/exec";

var textarea = document.getElementById("textinput");
var countRemaining = document.getElementById("charactersRemaining");

function submitForm(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Form submit success", data);
        })
        .catch((err) => console.log("err", err));
    textarea.value = "";
    countRemaining.textContent = "0/4000";
}

function countCharacters() {
    var textEntered, counter;
    textEntered = this.value;
    counter = textEntered.length + "/4000";
    countRemaining.textContent = counter;
}

function autoGrow() {
    var fontSize = parseInt(window.getComputedStyle(this).fontSize);
    this.style.height = fontSize * 7 + "px";
    this.style.height = this.scrollHeight + "px";
}

textarea.addEventListener("keyup", countCharacters, false);
textarea.addEventListener("input", autoGrow, false);

document.getElementById("ask-box").addEventListener("submit", submitForm);
