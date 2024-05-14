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

  
    async function fetchAPI() {
        const button = document.getElementById("apiThing");
        const textBox = document.querySelector('.text-box');
       /* const documentationText = document.querySelector('.test1').innerHTML;*/


        if (button.innerText === "A* Algorithm") {
           
            button.innerText = "Standard Documentation";
            // Fetch A* algorithm documentation
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
            
        } else if(button.innerText === "Standard Documentation") {
           button.innerText = "A* Algorithm";
            textBox.innerHTML = /*documentationText;*/"<h2>The JavaScript code sets up an interactive grid system with functionalities like drawing obstacles,clearing the grid, calculating and visualizing paths using the A* algorithm.The grid size dynamically adjusts based on the window size, and users can choose colors for different functionalities. It utilizes event listeners for mouse actions and keyboard inputs to interact with the grid.Additionally, it provides options to save and load grid configurations using localStorage. The A* pathfinding algorithm is implemented to find the shortest path between two points, with the option to clear the path or the entire grid.The code is structured with functions for creating the grid, handling user interactions, and executing pathfinding algorithms.</h2>";
        }
    }
    /*Att göra, fixa gränsnitt, fixa det sista med att kanske något mer med texten kanske ändra storleken på texten */