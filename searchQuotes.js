let html;
let searchDisabled = true;

function loadQuotes() {
  let quoteSets = document.getElementById("quoteSets").children;
  for (let set of quoteSets) {
    let url = `https://gist.githubusercontent.com/ALTCODE255/947280561356cf037ce6f749638277d5/raw/${set.id}.txt`;
    fetchQuotes(url, set);
  }
  document
    .getElementById("search")
    .addEventListener("input", filterText, false);
}

function fetchQuotes(url, el) {
  let converter = new showdown.Converter();
  converter.setOption("simpleLineBreaks", true);
  fetch(url)
    .then((response) => {
      if (response.status == 200) {
        return response.text();
      } else {
        throw new Error("Status code " + response.status);
      }
    })
    .then((text) => {
      el.innerHTML = converter
        .makeHtml(text)
        .replaceAll(/<em>|<\/em>/g, "*")
        .replaceAll("\\n", "<br>");
      if (window.location.hash.substring(1) == el.id) {
        updateActiveSection(el.id);
        document.getElementById(el.id + "-radio").checked = "true";
      }
    });
}

function updateActiveSection(id) {
  activeSection = document.getElementById(id);

  // disable other sections
  let sections = document.querySelectorAll(`#quoteSets > div:not(#${id})`);
  for (let s of sections) {
    if (s.className == "active") {
      s.innerHTML = html;
    }
    s.removeAttribute("class");
  }

  // activate section
  activeSection.className = "active";
  if (searchDisabled) {
    document.getElementById("search").disabled = false;
  }
  html = activeSection.innerHTML;
  countQuotes(activeSection);
}

function countQuotes(el) {
  document.getElementById("results").innerHTML =
    "Results: " + el.querySelectorAll("li").length + " quote(s)";
}

function filterText() {
  let activeSection = document.querySelector("#quoteSets > div.active");
  let nonmatch = new RegExp(String.raw`<li>(?!.*${this.value}).*</li>`, "gmi");
  activeSection.innerHTML = html
    .replaceAll(nonmatch, "")
    .replaceAll(/<ul>\s*<\/ul>/gm, "")
    .replaceAll(/<h3.*h3>(?![\s]*<ul>)/gm, "")
    .replaceAll(/<h2.*h2>(?![\s]*(<ul>|<h3.*h3>))/gm, "");
  countQuotes(activeSection);
}
