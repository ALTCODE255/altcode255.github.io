let html;

addEventListener("DOMContentLoaded", fetchText, false);
window.addEventListener("hashchange", (event) => {
  fetchText();
});

function fetchText() {
  if (
    [
      "#hourlygamesonic",
      "#hourlyshadowbot",
      "#coolsonicquotes",
      "#akechiquotebot",
      "#akechiyearning",
    ].includes(window.location.hash)
  ) {
    var converter = new showdown.Converter();
    converter.setOption("simpleLineBreaks", true);
    var url =
      "https://gist.githubusercontent.com/ALTCODE255/947280561356cf037ce6f749638277d5/raw/" +
      window.location.hash.substring(1) +
      ".txt";
    fetch(url)
      .then((response) => response.text())
      .then((cleanText) => {
        html = converter
          .makeHtml(cleanText)
          .replaceAll(/<em>|<\/em>/g, "*")
          .replaceAll("\\n", "<br>");
        document.getElementById("quotes").innerHTML = html;
        countQuotes();
      });
    document.getElementById("search").disabled = false;
    setActiveSection();
  }
  return false;
}

function setActiveSection() {
  document.querySelector(
    `.page-link[href='${window.location.hash}']`
  ).className = "page-link active";
  var anchors = document.querySelectorAll(
    `.page-link:not([href='${window.location.hash}'])`
  );
  for (var a of anchors) {
    a.className = "page-link";
  }
}

function countQuotes() {
  document.getElementById("results").innerHTML =
    "Results: " + document.getElementById("quotes").querySelectorAll("li").length + " quotes";
}

function filterText() {
  var nonmatch = new RegExp(String.raw`<li>(?!.*${this.value}).*</li>`, "gmi");
  document.getElementById("quotes").innerHTML = html
    .replaceAll(nonmatch, "")
    .replaceAll(/<ul>\s*<\/ul>/gm, "")
    .replaceAll(/<h3.*h3>(?![\s]*<ul>)/gm, "")
    .replaceAll(/<h2.*h2>(?![\s]*(<ul>|<h3.*h3>))/gm, "");
    countQuotes();
}

document.getElementById("search").addEventListener("input", filterText, false);
