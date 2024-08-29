let html;
let activeSection;

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
        .replaceAll("\\n", "<br>")
        .replace("MES*GROUP7*04", "MES_GROUP7_04");
      if (window.location.hash.substring(1) == el.id) {
        updateActiveSection(el.id);
        document.getElementById(el.id + "-radio").checked = "true";
      }
    });
}

function updateActiveSection(id) {
  if (!activeSection) {
    document.getElementById("search").disabled = false;
    document.getElementById("search").placeholder = "Type here to search quotes...";
  }
  window.location.hash = id;
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

  html = activeSection.innerHTML;
  countQuotes(activeSection);
}

function countQuotes(el) {
  document.getElementById("results").innerHTML =
    "Results: " +
    el.querySelectorAll("li:not([style*='display: none;']").length +
    " quote(s)";
}

function filterText() {
  let elements = activeSection.querySelectorAll("li, h2, h3");
  for (let el of elements) {
    el.style.display = "none";
  }
  let items = Array.from(activeSection.querySelectorAll("li"));
  let filteredQuotes = items.filter((item) =>
    item.innerHTML.match(new RegExp(this.value, "i"))
  );
  for (let q of filteredQuotes) {
    q.style.display = "list-item";
    let heading = q.parentNode.previousElementSibling;
    displayHeadingRecur(heading);
  }
  countQuotes(activeSection);
}

function displayHeadingRecur(el) {
  if (el && el.tagName.match(/H[2-6]/)) {
    el.style.display = "block";
    displayHeadingRecur(el.previousElementSibling);
  }
}
