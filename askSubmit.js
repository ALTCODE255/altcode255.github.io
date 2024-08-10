const url =
  "https://script.google.com/macros/s/AKfycbxLA3lB5Mbcc2Kfx0GUCqDbk8ksh9OEDYCrpFssrnPXXmkmALh0JLkBZh8MyqC87A9EFA/exec";

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
      this.reset();
    })
    .catch((err) => console.log("err", err));
});
