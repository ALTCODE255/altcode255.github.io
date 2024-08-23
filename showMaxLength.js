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
  this.style.height = fontSize * 6 + "px";
  this.style.height = this.scrollHeight + "px";
}

el = document.getElementById("textinput");
el.addEventListener("keyup", countCharacters, false);
el.addEventListener("input", autoGrow, false);
