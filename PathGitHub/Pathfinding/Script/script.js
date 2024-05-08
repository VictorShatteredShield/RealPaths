document.addEventListener('DOMContentLoaded', function () {
  // Selecting elements
  const colorButtons = document.querySelectorAll('.small-box button'); // Color buttons
  const gridContainer = document.getElementById('grid-container'); // Grid container
  const GreButtons = document.getElementById("GreButtons"); // Buttons related to saving and loading
  let activeColor = 1; // Active color for painting
  let isMouseDown = false; // Mouse button state
  let startNode = endNode = null; // Start and end nodes for pathfinding
  const Deletes = [];
  const Loades = [];

  for (let a = 1; a < 6; a++) {
    Deletes.push(document.getElementById("del" + a));
    Loades.push(document.getElementById("ld" + a));
  }


  // Dark mode handling
  let DarkModeHandler = document.querySelectorAll(".darkMode");
  let helpDarkModeHandler = document.getElementById("helpText");
  if (localStorage.getItem("darkMode") == null) {
    localStorage.setItem("darkMode", 1);
    helpDarkModeHandler.classList.toggle("helpDarkMode");
    for (let x = 0; x <= DarkModeHandler.length; x++) {
      DarkModeHandler[x].classList.toggle("darkMode");
    }
  }
  else if (localStorage.getItem("darkMode") == 1) {
    for (let x = 0; x < DarkModeHandler.length; x++) {
      DarkModeHandler[x].classList.toggle("darkMode");
    }
    helpDarkModeHandler.classList.toggle("helpDarkMode");
  }



  if (localStorage.getItem("gridSize") == null) {
    localStorage.setItem("gridSize", 25);
  }
  let SetXGridSize = localStorage.getItem("gridSize");
  let xGridSize = SetXGridSize;
  let yGridSize = 1;

  // Handling window resize
  window.onresize = window.onload = function () {
    // Adjust grid size based on window width
    if (window.innerWidth < 950 && SetXGridSize > 35) {
      xGridSize = 35;
    }
    else if (window.innerWidth < 700 && SetXGridSize > 20) {
      xGridSize = 20;
    }
    else if (window.innerWidth < 500 && SetXGridSize > 15) {
      xGridSize = 15;
    }
    else {
      xGridSize = SetXGridSize;
    }
    let Ratio = window.innerWidth / window.innerHeight;
    yGridSize = Math.round(xGridSize / Ratio);

    // Calculate button size based on grid size
    let buttonSize = (window.innerWidth / xGridSize) - 150 / xGridSize - 0.02 * xGridSize;

    // Recreate grid with updated size
    deleteGrid();
    createGrid(Math.round(buttonSize));
  }

  let gridButtons = []; // Store references to grid buttons for faster access
  let currentToolButton = null;

  // Function to create the grid
  function createGrid(ButtonSize) {
    let widthheight = ButtonSize + "px";
    for (let i = 0; i < yGridSize; i++) {
      for (let j = 0; j < xGridSize; j++) {
        const button = document.createElement('button');
        button.className = 'grid-button';
        button.dataset.x = j;
        button.dataset.y = i;
        button.style.width = widthheight;
        button.style.height = widthheight;
        button.addEventListener('mousedown', handleMouseDown);
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseup', handleMouseUp);
        gridContainer.appendChild(button);
        gridButtons.push(button); // Store the button reference
      }
      gridContainer.appendChild(document.createElement('br'));
    }
  }

  // Function to delete the grid
  function deleteGrid() {
    // Remove all grid buttons
    gridButtons.forEach(button => {
      button.remove();
    });

    // Remove all line breaks
    const lineBreaks = document.querySelectorAll('#grid-container br');
    lineBreaks.forEach(lineBreak => {
      lineBreak.remove();
    });

    // Clear references
    gridButtons = [];
    startNode = null;
    endNode = null;
    activeColor = 0;
  }

  // Event handlers for mouse actions
  function handleMouseDown() {
    isMouseDown = true;
    changeColor(this);
  }

  function handleMouseEnter() {
    if (isMouseDown) {
      changeColor(this);
    }
  }

  function handleMouseUp() {
    isMouseDown = false;
  }

  // Function to change color of buttons
  function changeColor(button) {
    const currentColor = activeColor;
    if (currentColor === 2 || currentColor === 3) {
      gridButtons.forEach(existingButton => {
        if (existingButton.classList.contains(`color${currentColor}`)) {
          existingButton.className = 'grid-button ChangeColor color0';
        }
      });
    }

    if (!button.classList.contains('color-button')) {
      button.className = `grid-button ChangeColor color${currentColor}`;
      if (currentColor === 2) {
        startNode = button;
      } else if (currentColor === 3) {
        endNode = button;
      }
    }
  }

  // Function to set active color
  function setActiveColor(color, button) {
    activeColor = color;
    if (currentToolButton) {
      currentToolButton.classList.remove('active');
    }
    button.classList.add('active');
    currentToolButton = button;
  }

  // Function to clear all colors
  function clearAll() {
    gridButtons.forEach(button => {
      button.className = 'grid-button';
    });
    startNode = null;
    endNode = null;
    activeColor = 0;
  }

  // Function to clear path
  function clearPath() {
    if (startNode) {
      startNode.classList.remove('color2');
      startNode = null;
    }
    if (endNode) {
      endNode.classList.remove('color3');
      endNode = null;
    }
    gridButtons.forEach(button => {
      if (button.classList.contains('color5')) {
        button.classList.remove('color5');
      }
      else if (button.classList.contains('color4')) {
        button.classList.remove('color4');
      }
    });
  }

  // Function to log path
  function logPath(path) {
    if (path) {
      console.log('A* Path:', path.map(node => ({ x: node.x, y: node.y })));
    } else {
      console.log('No path found.');
    }
  }

  // Function to highlight fastest path
  function highlightFastestPath(path) {
    if (path) {
      path.forEach((node, index) => {
        setTimeout(() => {
          const x = parseInt(node.x);
          const y = parseInt(node.y);
          const button = gridButtons.find(btn => btn.dataset.x === `${x}` && btn.dataset.y === `${y}`);
          if (button) {
            activeColor = 4; // Change color for the final path
            changeColor(button);
            console.log('Colored');
          }
        }, index * 40);
      });
      activeColor = 0; // Reset activeColor after highlighting
    } else {
      console.log('No path found.');
    }
  }

  // Function to calculate path
  function calculatePath(event) {
    if (event.key === '1' || event.pointerId == '1') {
      if (startNode && endNode) {
        const path = calculateAStarPath();
        if (path) {
          activeColor = 5;
          path.forEach((node, index) => {
            setTimeout(() => {
              const x = parseInt(node.x);
              const y = parseInt(node.y);
              const button = gridButtons.find(btn => btn.dataset.x === `${x}` && btn.dataset.y === `${y}`);
              if (button) {
                changeColor(button);
              }
            }, index * 40);
          });
          activeColor = 0;
          highlightFastestPath(path);
        }
      } else {
        console.error('startNode or endNode is not initialized.');
      }
    } else if (event.key === '2') {
      clearAll();
    } else if (event.key === '3') {
      clearPath();
    }
  }

  // Function to calculate A* pathfinding
  function calculateAStarPath() {
    const width = xGridSize;
    const height = yGridSize;

    // A* algorithm implementation
    function aStar(start, goal) {
      let explored = []; // List of explored nodes
      let frontier = [{ // Priority queue for nodes to explore
        state: start, // Current state (node)
        cost: 0, // Cost from start to current node
        estimate: heuristic(start, goal), // Heuristic estimate of remaining cost
        path: [start] // Path from start to current node
      }];

      // Function to color explored nodes
      function colorExploredNode(node) {
        const x = parseInt(node.state.x);
        const y = parseInt(node.state.y);
        const button = gridButtons.find(btn => btn.dataset.x === `${x}` && btn.dataset.y === `${y}`);
        if (button) {
          activeColor = 5; // Color for explored nodes
          changeColor(button);
          console.log('Colored');
        }
      }

      // Main loop of A* algorithm
      while (frontier.length > 0) {
        frontier.sort((a, b) => a.cost + a.estimate - (b.cost + b.estimate)); // Sort by total cost
        let node = frontier.shift(); // Pop the node with the lowest total cost
        explored.push(node); // Add node to explored list

        colorExploredNode(node); // Color the explored node

        if (node.state.x == goal.x && node.state.y == goal.y) {
          return node.path; // Path found, return the path
        }

        let next = generateNextSteps(node.state); // Generate possible next steps from current node
        for (let i = 0; i < next.length; i++) {
          let step = next[i];
          let cost = step.cost + node.cost; // Calculate total cost of the step

          let isExplored = explored.find(e => e.state.x == step.state.x && e.state.y == step.state.y);
          let isFrontier = frontier.find(e => e.state.x == step.state.x && e.state.y == step.state.y);

          if (!isExplored && !isFrontier) { // Check if the step is not already explored or in the frontier
            colorExploredNode({ // Color the explored node
              state: step.state
            });

            frontier.push({ // Add the step to the frontier
              state: step.state,
              cost: cost,
              estimate: heuristic(step.state, goal), // Estimate the remaining cost using heuristic function
              path: [...node.path, step.state] // Update the path
            });
          }
        }
      }

      return null; // No path found
    }

    // Heuristic function to estimate remaining cost (Manhattan distance)
    function heuristic(current, goal) {
      return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y);
    }

    // Function to generate possible next steps from current node
    function generateNextSteps(state) {
      let next = [];

      // Check if moving left is possible and not an obstacle
      if (state.x > 0 && !isObstacle(state.x - 1, state.y)) {
        next.push({
          state: {
            x: state.x - 1,
            y: state.y
          },
          cost: 1 // Cost of moving left
        });
      }

      // Check if moving right is possible and not an obstacle
      if (state.x < width - 1 && !isObstacle(state.x + 1, state.y)) {
        next.push({
          state: {
            x: state.x + 1,
            y: state.y
          },
          cost: 1 // Cost of moving right
        });
      }

      // Check if moving up is possible and not an obstacle
      if (state.y > 0 && !isObstacle(state.x, state.y - 1)) {
        next.push({
          state: {
            x: state.x,
            y: state.y - 1
          },
          cost: 1 // Cost of moving up
        });
      }

      // Check if moving down is possible and not an obstacle
      if (state.y < height - 1 && !isObstacle(state.x, state.y + 1)) {
        next.push({
          state: {
            x: state.x,
            y: state.y + 1
          },
          cost: 1 // Cost of moving down
        });
      }

      return next; // Return the list of possible next steps
    }

    // Function to check if a position is an obstacle
    function isObstacle(x, y) {
      return gridButtons.some(btn => btn.dataset.x === `${x}` && btn.dataset.y === `${y}` && btn.classList.contains('color1'));
    }

    // Extract start and goal positions from startNode and endNode
    const start = {
      x: parseInt(startNode.dataset.x),
      y: parseInt(startNode.dataset.y)
    };
    const goal = {
      x: parseInt(endNode.dataset.x),
      y: parseInt(endNode.dataset.y)
    };

    console.log('Start Node:', start);
    console.log('End Node:', goal);

    const path = aStar(start, goal); // Call A* algorithm
    logPath(path); // Log the found path

    return path; // Return the found path
  }


  // Setting active color for buttons
  colorButtons.forEach(function (button, index) {
    setActiveColor(parseInt(button.dataset.color), button);
  });

  // Adding event listeners to color buttons
  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setActiveColor(parseInt(this.dataset.color), this);
      this.classList.add('color-button');
    });
  });

  // Handling keydown event
  document.addEventListener('keydown', function (event) {
    calculatePath(event);
  });

  // Mouse event listeners for grid container
  gridContainer.addEventListener('mousedown', function () {
    isMouseDown = true;
  });

  gridContainer.addEventListener('mouseup', function () {
    isMouseDown = false;
  });

  gridContainer.addEventListener('mouseleave', function () {
    isMouseDown = false;
  });

  // Click event listener for grid buttons
  gridContainer.addEventListener('click', function (event) {
    if (event.target.matches('.grid-button')) {
      changeColor(event.target);
    }
  });

  let GridLayout = [];
  let tracker = 0;

  // Event listener for save/load buttons
  GreButtons.addEventListener('click', function (event) {
    if (event.target.matches('.Calc')) {
      calculatePath(event);
    }
    else if (event.target.matches('.Save')) {
      // Saving grid layout to local storage
      GridLayout = [];
      gridButtons.forEach(element => {
        if (element.classList.contains('color1')) {
          GridLayout.push(1);
        }
        else {
          GridLayout.push(0);
        }
      });
      GridLayout.push(parseInt(xGridSize));
      GridLayout.push(yGridSize);
      console.log(GridLayout);

      tracker = 1;
      while(true){
        console.log(tracker);f
        if(tracker > 5){
          console.log("Storage full");
          break;
        }
        console.log(localStorage.getItem("mn" + tracker))
        if(localStorage.getItem("mn" + tracker) == "null") {
          localStorage.setItem("mn" + tracker, JSON.stringify(GridLayout))
          console.log("Set new map for: mn" + tracker);
          break;
        }
        tracker++;
      }
    }
    /*else if(event.target.matches('.Load')){
      // Loading grid layout from local storage
      GridLayout = JSON.parse(localStorage.getItem('grid'));
      console.log(GridLayout);
      if(GridLayout[GridLayout.length -1] == yGridSize && GridLayout[GridLayout.length -2] == xGridSize){
        clearAll();
        tracker = 0;
        gridButtons.forEach(element => {
         if(GridLayout[tracker] == 1){
          activeColor = 1;
            changeColor(element);
         }
         tracker++;
      });
      }
    }*/
  });


  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

  // Initial grid creation
  createGrid(30);
  setActiveColor(0, colorButtons[0]);
});