document.addEventListener('DOMContentLoaded', function () {

  if (localStorage.getItem("gridSize") == null) {
    localStorage.setItem("gridSize", 25);
  }

  const gridSizeInput = document.getElementById('gridSize');

  gridSizeInput.addEventListener('input', function () {
    const newSize = parseInt(gridSizeInput.value);
    console.log("Change in size");
    if (newSize >= 1 && newSize <= 50) { localStorage.setItem("gridSize", newSize); }
  })
});

let checkbox = document.querySelector("input[id=toggleSwitch]");
let Header = document.getElementById("darkMode");


if (localStorage.getItem("darkMode") == null) {
  document.body.classList.toggle("darkMode");
  localStorage.setItem("darkMode", 1);
}
else if (localStorage.getItem("darkMode") == 2) {
  checkbox.checked = true;
}
else {
  checkbox.checked = false;
  document.body.classList.toggle("darkMode");
}

checkbox.addEventListener('change', function () {
  var Body = document.body;

  if (this.checked) {
    Body.classList.toggle("darkMode");
    localStorage.setItem("darkMode", 2);
  } else {
    Body.classList.toggle("darkMode");
    localStorage.setItem("darkMode", 1);
  }
});