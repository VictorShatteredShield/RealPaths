document.addEventListener('DOMContentLoaded', function () {

if(localStorage.getItem("gridSize") == null){
    localStorage.setItem("gridSize", 25);
}

const gridSizeInput = document.getElementById('gridSize');

gridSizeInput.addEventListener('input', function () {
    const newSize = parseInt(gridSizeInput.value);
    console.log("Change in size");
    if (newSize >= 1 && newSize <= 50) { localStorage.setItem("gridSize", newSize); }})
});