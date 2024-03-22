document.addEventListener('DOMContentLoaded', function () {
  const colorButtons = document.querySelectorAll('.small-box button');
  const gridContainer = document.getElementById('grid-container');
  let activeColor = 1;
  let isMouseDown = false;
  let startNode = null;
  let endNode = null;
  let xGridSize = 25;
  let yGridSize = 10;
  let gridButtons = []; // Store references to grid buttons for faster access
  let currentToolButton = null;

  function createGrid() {
    for (let i = 0; i < yGridSize; i++) {
      for (let j = 0; j < xGridSize; j++) {
        const button = document.createElement('button');
        button.className = 'grid-button';
        button.dataset.x = j;
        button.dataset.y = i;
        button.addEventListener('mousedown', handleMouseDown);
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseup', handleMouseUp);
        gridContainer.appendChild(button);
        gridButtons.push(button); // Store the button reference
      }
      gridContainer.appendChild(document.createElement('br'));
    }
  }

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

  function setActiveColor(color, button) {
    activeColor = color;
    if (currentToolButton) {
      currentToolButton.classList.remove('active');
    }
    button.classList.add('active');
    currentToolButton = button;
    switch (color) {
      case 0:
        button.innerText = 'Eraser';
        break;
      case 1:
        button.innerText = 'Place wall';
        break;
      case 2:
        button.innerText = 'Place end';
        break;
      case 3:
        button.innerText = 'Place start';
        break;
    }
  }


  function clearAll() {
    gridButtons.forEach(button => {
      button.className = 'grid-button';
    });
    startNode = null;
    endNode = null;
    activeColor = 0;
  }

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
      else if(button.classList.contains('color4')){
        button.classList.remove('color4');
      }
    });
  }

  function logPath(path) {
    if (path) {
      console.log('A* Path:', path.map(node => ({ x: node.x, y: node.y })));
    } else {
      console.log('No path found.');
    }
  }

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

  function calculatePath(event) {
    if (event.key === '1') {
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

  function calculateAStarPath() {
    const width = xGridSize;
    const height = yGridSize;

    function aStar(start, goal) {
      let explored = [];
      let frontier = [{
        state: start,
        cost: 0,
        estimate: heuristic(start, goal),
        path: [start]
      }];

      function colorExploredNode(node) {
        const x = parseInt(node.state.x);
        const y = parseInt(node.state.y);
        const button = gridButtons.find(btn => btn.dataset.x === `${x}` && btn.dataset.y === `${y}`);
        if (button) {
          activeColor = 5;
          changeColor(button);
          console.log('Colored');
        }
      }

      while (frontier.length > 0) {
        frontier.sort((a, b) => a.cost + a.estimate - (b.cost + b.estimate)); // Sort by total cost
        let node = frontier.shift();
        explored.push(node);

        colorExploredNode(node);

        if (node.state.x == goal.x && node.state.y == goal.y) {
          return node.path;
        }

        let next = generateNextSteps(node.state);
        for (let i = 0; i < next.length; i++) {
          let step = next[i];
          let cost = step.cost + node.cost;

          let isExplored = explored.find(e => e.state.x == step.state.x && e.state.y == step.state.y);
          let isFrontier = frontier.find(e => e.state.x == step.state.x && e.state.y == step.state.y);

          if (!isExplored && !isFrontier) {
            colorExploredNode({
              state: step.state
            });

            frontier.push({
              state: step.state,
              cost: cost,
              estimate: heuristic(step.state, goal),
              path: [...node.path, step.state]
            });
          }
        }
      }

      return null;
    }

    function heuristic(current, goal) {
      return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y);
    }

    function generateNextSteps(state) {
      let next = [];

      if (state.x > 0 && !isObstacle(state.x - 1, state.y)) {
        next.push({
          state: {
            x: state.x - 1,
            y: state.y
          },
          cost: 1
        });
      }
      if (state.x < width - 1 && !isObstacle(state.x + 1, state.y)) {
        next.push({
          state: {
            x: state.x + 1,
            y: state.y
          },
          cost: 1
        });
      }
      if (state.y > 0 && !isObstacle(state.x, state.y - 1)) {
        next.push({
          state: {
            x: state.x,
            y: state.y - 1
          },
          cost: 1
        });
      }
      if (state.y < height - 1 && !isObstacle(state.x, state.y + 1)) {
        next.push({
          state: {
            x: state.x,
            y: state.y + 1
          },
          cost: 1
        });
      }

      return next;
    }

    function isObstacle(x, y) {
      return gridButtons.some(btn => btn.dataset.x === `${x}` && btn.dataset.y === `${y}` && btn.classList.contains('color1'));
    }

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

    const path = aStar(start, goal);
    logPath(path);

    return path;
  }

  colorButtons.forEach(function (button, index) {
    setActiveColor(parseInt(button.dataset.color), button);
  });

  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setActiveColor(parseInt(this.dataset.color), this);
      this.classList.add('color-button');
    });
  });

  document.addEventListener('keydown', function (event) {
    calculatePath(event);
  });

  gridContainer.addEventListener('mousedown', function () {
    isMouseDown = true;
  });

  gridContainer.addEventListener('mouseup', function () {
    isMouseDown = false;
  });

  gridContainer.addEventListener('mouseleave', function () {
    isMouseDown = false;
  });

  gridContainer.addEventListener('click', function (event) {
    if (event.target.matches('.grid-button')) {
      changeColor(event.target);
    }
  });

  createGrid();
  setActiveColor(0, colorButtons[0]);
});
