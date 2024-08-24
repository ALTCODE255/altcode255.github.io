let html;

addEventListener("DOMContentLoaded", fetchText, false);
window.addEventListener("hashchange", (event) => {
    fetchText();
})

function fetchText() {
  if (window.location.hash) {
    var converter = new showdown.Converter();
    converter.setOption("simpleLineBreaks", true);
    var url =
      "https://raw.githubusercontent.com/ALTCODE255/namelessquotebots/main/tweets/" +
      window.location.hash.substring(1) +
      ".txt";
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
    document.getElementById("search").disabled = false;
  }
  return false;
}

function filterText() {
  var re = new RegExp(String.raw`<li>(?!.*${this.value}).*</li>`, "gmi");
  document.getElementById("quotes").innerHTML = html
    .replaceAll(re, "")
    .replaceAll(/<ul>\s*<\/ul>/gm, "")
    .replaceAll(/<h3 id=.*>.*<\/h3>(?!\s*<ul>)/gm, "")
    .replaceAll(/<h2 id=.*>.*<\/h2>(?=(\s*<h2))/gm, "");
}

el = document.getElementById("search");
el.addEventListener("input", filterText, false);
