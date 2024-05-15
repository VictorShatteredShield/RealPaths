document.addEventListener('DOMContentLoaded', function () {

    let DarkModeHandler = document.querySelectorAll(".darkMode");

    if (localStorage.getItem("darkMode") == null) {
        localStorage.setItem("darkMode", 1);

        for (let x = 0; x <= DarkModeHandler.length; x++) {
            DarkModeHandler[x].classList.toggle("darkMode");
        }

    }
    else if (localStorage.getItem("darkMode") == 1) {

        for (let x = 0; x < DarkModeHandler.length; x++) {
            DarkModeHandler[x].classList.toggle("darkMode");
        }
    }

});