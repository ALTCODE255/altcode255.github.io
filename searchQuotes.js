var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.7.1.min.js"; // Check https://jquery.com/ for the current version
document.getElementsByTagName("head")[0].appendChild(script);

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
  if (document.getElementById("search").disabled) {
    document.getElementById("search").disabled = false;
    document.getElementById("search").placeholder =
      "Type here to filter quotes...";
  }
  window.location.hash = id;
  activeSection = document.getElementById(id);

  // disable other sections
  $(`#quoteSets > div:not(#${id})`).hide();
  // activate section
  $("#" + id).show();

  countQuotes();
}

function countQuotes() {
  document.getElementById("results").innerHTML =
    "Results: " +
    $(
      "#quoteSets > div:not([style*='display: none;']) li:not([style*='display: none;'])"
    ).length +
    " quote(s)";
}

function filterText() {
  let regex = this.value;
  $("#quoteSets").find("li, h2, h3, h4, h5, h6").hide();
  let filteredQuotes = $("#quoteSets li").filter(function () {
    return this.innerHTML.match(new RegExp(regex, "i"));
  });
  filteredQuotes.css("display", "list-item");
  filteredQuotes.each(function () {
    displayHeadingRecur($(this).parent().prev());
  });
  countQuotes();
}

function displayHeadingRecur(obj) {
  if (obj.length) {
    obj.show();
    let size = parseInt(obj[0].nodeName[1]);
    if (size > 2) {
      let prevHeader = obj.prevAll(`h${size - 1}`).first();
      displayHeadingRecur(prevHeader);
    }
  }
}
