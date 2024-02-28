document.addEventListener('DOMContentLoaded', function () {
  const colorButtons = document.querySelectorAll('.small-box button');
  const gridContainer = document.getElementById('grid-container');
  let activeColor = 1;
  let isMouseDown = false;
  let startNode = null;
  let endNode = null;

  function createGrid() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 25; j++) {
        const button = document.createElement('button');
        button.className = 'grid-button';
        button.dataset.x = j;
        button.dataset.y = i;
        button.addEventListener('mousedown', function () {
          isMouseDown = true;
          changeColor(this);
        });
        button.addEventListener('mouseenter', function () {
          if (isMouseDown) {
            changeColor(this);
          }
        });
        button.addEventListener('mouseup', function () {
          isMouseDown = false;
        });
        gridContainer.appendChild(button);
      }
      gridContainer.appendChild(document.createElement('br'));
    }
  }

  function changeColor(button) {
    const currentColor = activeColor;

    if (currentColor === 2 || currentColor === 3) {
      gridContainer.querySelectorAll(`.ChangeColor.color${currentColor}`).forEach(function (existingButton) {
        existingButton.className = 'grid-button ChangeColor color0';
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

    switch (color) {
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
    gridContainer.querySelectorAll('.grid-button').forEach(function (button) {
      button.className = 'grid-button';
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
          const button = gridContainer.querySelector(`.grid-button[data-x="${x}"][data-y="${y}"]`);
          if (button) {
            activeColor = 4; // Change color for the final path
            changeColor(button);
            console.log('Colored');
          }
        }, index * 20);
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
          path.forEach((node, index) => {
            setTimeout(() => {
              const x = parseInt(node.x);
              const y = parseInt(node.y);
              const button = gridContainer.querySelector(`.grid-button[data-x="${x}"][data-y="${y}"]`);
              if (button) {
                activeColor = 5;
                changeColor(button);
                console.log('Colored');
              }
            }, index * 20);
          });
          activeColor = 0;
          setTimeout(() => {
            highlightFastestPath(path);
          }, path.length * 20); // Adjust the delay if needed
        }
      } else {
        console.error('startNode or endNode is not initialized.');
      }
    } else if (event.key === '2') {
      clearAll();
    }
  }

  function calculateAStarPath() {
    const width = 25;
    const height = 10;

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
        const button = gridContainer.querySelector(`.grid-button[data-x="${x}"][data-y="${y}"]`);
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

      return gridContainer.querySelector(`.grid-button[data-x="${x}"][data-y="${y}"]`).classList.contains('color1');
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