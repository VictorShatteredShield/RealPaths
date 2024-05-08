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




class DivClick {
  constructor() {
    this.boxes = document.querySelectorAll('#Info .box');
    this.addClickEvent();
  }

  addClickEvent() {
    console.log("sadasd")
    this.boxes.forEach(box => {
      box.addEventListener('click', () => {
        console.log("sadasd")
        this.toggleActive(box);
      });
    });
  }

  toggleActive(box) {
    // Remove 'active' class from all boxes
    this.boxes.forEach(b => {
      b.classList.remove('active');
      console.log("sadasd")
    });
    // Add 'active' class to the clicked box
    box.classList.add('active');
    console.log("sadasd")
  }
}

// Create an instance of the class
const divClick = new DivClick();