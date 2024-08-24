

let html;
var items = document.getElementsByClassName("page-link");
for (let i = 0; i < items.length; i++) {
    items.item(i).addEventListener("click", fetchText, false);
  }


function fetchText() {
  var converter = new showdown.Converter();
  converter.setOption("simpleLineBreaks", true);
  var url = "https://raw.githubusercontent.com/ALTCODE255/namelessquotebots/main/tweets/" + this.innerHTML.substring(1) + ".txt";
  fetch(url)
    .then((response) => response.text())
    .then((text) =>
      text
        .replaceAll(/\s+$/gm, "")
        .replaceAll(/^(?!#.*$)(\S.*)/gm, "- $1")
        .replaceAll(/^#/gm, "##")
    )
    .then((cleanText) => {
      html = converter.makeHtml(cleanText);
      document.getElementById("quotes").innerHTML = html;
    });
}

function filterText() {
  var re = new RegExp(String.raw`<li>(?!.*${this.value}).*</li>`, "gmi");
  document.getElementById("quotes").innerHTML = html.replaceAll(re, "");
}

el = document.getElementById("search");
el.addEventListener("input", filterText, false);
