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
/**/
async function fetchAPI() {
    fetch('https://en.wikipedia.org/w/api.php?action=query&origin=*&titles=A*_search_algorithm&prop=extracts&format=json&exintro=1', {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

        .then(response => response.json())
        .then(data => {
            const page = data.query.pages['100558'];
            const extract = page.extract;
            document.querySelector('.text-box').innerHTML = extract;
            console.log(data);

        })

        .catch(error => console.error(error));
}