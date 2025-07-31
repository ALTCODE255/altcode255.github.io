const url =
    "https://script.google.com/macros/s/AKfycbzDzcZhUWzTb8YHojLLKXinYr-qqrPWpoz3V9ChAFVO74Lpg0e8MlECo6sUhDvGEWpmtw/exec";

document.getElementById("ask-box").addEventListener("submit", function (event) {
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
            console.log("Successful", data);
        })
        .catch((err) => console.log("err", err));
    var inputs = document.getElementsByClassName("form-control");
    for (i of inputs) {
        if (i.getAttribute("type") != "color") {
            i.value = "";
        }
    }
});

var el;

function countCharacters() {
    var textEntered, countRemaining, counter;
    textEntered = this.value;
    counter = textEntered.length + "/4000";
    countRemaining = document.getElementById("charactersRemaining");
    countRemaining.textContent = counter;
}

function autoGrow() {
    var fontSize = parseInt(window.getComputedStyle(this).fontSize);
    this.style.height = fontSize * 7 + "px";
    this.style.height = this.scrollHeight + "px";
}

el = document.getElementById("textinput");
el.addEventListener("keyup", countCharacters, false);
el.addEventListener("input", autoGrow, false);
