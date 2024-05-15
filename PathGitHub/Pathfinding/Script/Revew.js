document.addEventListener('DOMContentLoaded', function () {
    //DarkMode
    let DarkModeHandler = document.querySelectorAll(".darkMode");
    if(localStorage.getItem("darkMode") == null){
        localStorage.setItem("darkMode", 1);
        for(let x = 0; x <= DarkModeHandler.length; x++){
            DarkModeHandler[x].classList.toggle("darkMode");
        }
    }
    else if(localStorage.getItem("darkMode") == 1){
        for(let x = 0; x < DarkModeHandler.length; x++){
            DarkModeHandler[x].classList.toggle("darkMode");
        }
    }

    //Cat pictures api
const url = `https://api.thecatapi.com/v1/images/search?limit=10`;
const api_key = "DEMO_API_KEY"

 fetch(url,{headers: {
      'x-api-key': api_key
    }})
 .then((response) => {
   return response.json();
 })
 .then((data) => {
    let imagesData = data;
    imagesData.map(function(imageData) {
      let image = document.createElement('img');
      //use the url from the image object
      image.src = `${imageData.url}`;    
      let gridCell = document.createElement('div');
      gridCell.classList.add('col');
      gridCell.classList.add('col-lg');
      gridCell.appendChild(image)
      document.getElementById('grid').appendChild(gridCell);
      });
})
.catch(function(error) {
   console.log(error);
});
});

// function to save review text 
function saveReview() {
    const reviewText = document.getElementById('reviewInput').value;
    localStorage.setItem('savedReview', reviewText);
    alert('Review saved successfully!');
  }
  
  // unction to load review text 
  function loadReview() {
    const savedReview = localStorage.getItem('savedReview');
    if (savedReview) {
        document.getElementById('reviewInput').value = savedReview;
        alert('Review loaded from storage!');
    } else {
        alert('No review found in storage.');
    }
  }