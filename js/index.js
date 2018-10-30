/* TO-DO


* Bugs
  * When you have triangle mode on, and click on a segment if often makes a new triangle
  ... even when you don't want it. Maybe make it so you have to drag a bit?
  * When clicking planes, you can click two at once (the one below what you clicked)

* Allow dragging a plane

*/

// Basic Config
const canvasWidth = 900
    , canvasHeight = 600

// Element references
const bodyEl = document.querySelector("body")
    , canvas = document.querySelector("canvas")
    , ctx = canvas.getContext("2d", { alpha: false });

canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("width",  canvasWidth);


let cloning = false;
let cloners = [];
let wobble = false;
let pointSelected = false;
let gridSelected = false;

canvas.addEventListener("mousedown", (e) => {
  cloners = [];
  cloning = false;
  mouse.pressed = true;
  pointSelected = false;
  gridSelected = false;

  let gridClicked = false;
  let clickedSelectedPoint = false;

  points.map(p => {
    if(p.hovered && p.selected) {
      clickedSelectedPoint = true;
    }
  });

  // If a non-selected point is clicked, clear all selected points.
  if(clickedSelectedPoint == false) {
    points = points.map(p => {
      p.selected = false;
      return p;
    });
  }

  // Select clicked point.
  points = points.map(p => {
    if(p.hovered) {
      p.selected = true;
      pointSelected = true;
    } 
    return p;
  });

  if(pointSelected == false) {
    points = points.map(p => {
      p.selected = false;
      p.hovered = false;
      return p;
    });
  }

  if(pointSelected == false) {

      grids.map(grid => {

        // Select grids
        if(grid.hovered) {
          grids = grids.map(nGrid => {
            if(nGrid != grid) {
              nGrid.selected = false;
            }
            return nGrid;
          });
          grid.click();
          gridClicked = true;
        }

        for(var i = 0; i < grid.points.length; i++){

          let thisP = grid.points[i];
          let nextP = grid.points[i + 1];
          let start, end, dist;
          dist = 0;
          
          if(!nextP) {
            nextP = grid.points[0];
          }

          start = {x: thisP.x, y: thisP.y};
          end = {x: nextP.x, y: nextP.y};

          dist = distToSegment({x : mouse.x, y : mouse.y}, start, end);

          if(dist <= lineHoverDistance) {
            if(cloners.length < 2) {
              cloners.push(thisP);
              cloners.push(nextP);
            }
          }
        }
      });

      if(gridClicked == false) {
        deselectGrids();
      }
  } else {
    deselectGrids();
  }

  if(pointSelected == false ) {
    mouse.dragging = true;
    mouse.dragZone.start.x = e.offsetX;
    mouse.dragZone.start.y = e.offsetY;
    mouse.dragZone.end.x = e.offsetX;
    mouse.dragZone.end.y = e.offsetY;
  }

  // For cloning
  if(cloners.length == 2 && pointSelected == false) {
    deselectGrids();
    cloning = true;
    // Add new points to the points array
    let newPoints = [];
    let newOne, newTwo;

    if(settings.extrudeMode == "line") {
      newOne = { x: parseInt(cloners[0].x), y: parseInt(cloners[0].y), cloning: true}
      newTwo = { x: parseInt(cloners[1].x), y: parseInt(cloners[1].y), cloning: true}
      points.push(newTwo);
      points.push(newOne);
      
      newPoints.push(newTwo);
      newPoints.push(newOne);
      
    } else if (settings.extrudeMode == "point") {
      newOne = { x: parseInt(mouse.x), y: parseInt(mouse.y), cloning: true}
      points.push(newOne);
      newPoints.push(newOne);
    }

    newPoints.push(cloners[0]);
    newPoints.push(cloners[1]);

    mouse.dragging = false;
    // Create a grid tile from it

    let newGrid = new Grid(newPoints, "top")
    newGrid.fillColor = selectedColor;
    grids.push(newGrid);


  }

});



canvas.addEventListener("mousemove", (e) => {

  let dX =  e.offsetX - mouse.x;
  let dY =  e.offsetY - mouse.y;

  if(mouse.dragging) {
    mouse.dragZone.end.x += dX;
    mouse.dragZone.end.y += dY;
  }

  points = points.map(p => {

    if(mouse.dragging) {
      p.hovered = false;
      p.stickyHovered = checkDragZone(p);
    }

    if(mouse.dragging == false) {
      let distance = Math.sqrt(Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2));

      if(distance < hoverRadius) {
        p.hovered = true;
      } else {
        p.hovered = false;
      }
    }

    if((p.selected || p.cloning) && mouse.pressed) {
      p.x += dX;
      p.y += dY;
      moveSticky(dX,dY);
    }

    return p;
  });

  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});



// Deselect all points on mouseup
window.addEventListener("mouseup", (e) => {
  mouse.pressed = false;

  for(var i = 0; i < grids.length; i++) {
    let g = grids[i];
  }

  cloning = false;

  points = points.map(p => {
    if(p.stickyHovered) {
      p.stickyHovered = false;
      p.selected = true;
    }
    p.cloning = false;
    return p;
  });


  if(mouse.dragging == true) {
    mouse.dragging = false;
  } else if(mouse.dragging == false) {
    // points = points.map(p => {
    //   p.selected = false;
    //   return p;
    // });
  }
});


const clearSticky = () => {
   points = points.map(p => {
      if(p.stickyHovered) {
        p.stickyHovered = false;
      }
      return p;
  });
}

const moveSticky = (dX, dY) => {
   points = points.map(p => {
      if(p.stickyHovered && !p.selected) {
        p.x += dX;
        p.y += dY;
      }
      return p;
  });
}

const keyMap = {
  37 : "left",
  38 : "up",
  39 : "right",
  40 : "down",
  16 : "shift",
  68 : "delete",
  8  : "delete",
  187 : "plus",
  189 : "minus",
}

const getKey = keyCode => {
  return keyMap[keyCode];
}

window.addEventListener("keydown", e => {

  let key = getKey(e.keyCode);

  if(key == "delete") {
    let selectedPoints = points.filter(p => {
      return p.selected;
    });
    deletePoints(selectedPoints);
    deleteSelectedGrids();
  }

  if(key == "plus") {
    scalePoints(.05);
  }

  if(key == "minus") {
    scalePoints(-.05);
  }

});


const deleteSelectedGrids = () => {
  grids = grids.filter(grid => {
    return !grid.selected;
  });
}

// Delete an array of points
const deletePoints = (selectedPoints) => {

  grids = grids.map(grid => {
    grid.points = grid.points.filter(p => {
      return selectedPoints.indexOf(p) == -1;
    });
    return grid;
  });
  
  points = points.filter(p => {
    return selectedPoints.indexOf(p) == -1;
  });
}

window.addEventListener("keyup", e => {
  let key = getKey(e.keyCode);
});

const mouse = {
  x : 0,
  y: 0,

  pressed : false,
  dragging : false,

  dragZone : {
    start : {
      x : 0,
      y : 0,
    },
    end : {
      x : 0,
      y : 0
    }
  }
}

// Check if there are any overlapping points...
const consolidatePoints = () => {

  let x;
  let y;
  let haveNewPoint = false;

  let samePoints = points.filter(thisPoint => {
    for(var i = 0; i < points.length; i++) {
      let otherPoint = points[i];
      if(otherPoint != thisPoint) {
        if(otherPoint.x == thisPoint.x && otherPoint.y == thisPoint.y) {
          x = thisPoint.x;
          y = thisPoint.y;
          haveNewPoint = true;
          return thisPoint;
        }
      }
    }
  });

  if(haveNewPoint == false) {
    return;
  }

  // replace with new reference...
  let newPoint = { x: x, y: y, new: true};
  let alreadyReturned;

  // this does NOT update the 'grids value'
  // might as well do it the mapped way...

  points = points.filter(p => {
    if(p.x == newPoint.x && p.y == newPoint.y) {
      return false;
    } else {
      return true;
    }
  });

  grids = grids.map(grid => {
    grid.points = grid.points.map(p => {
      if(p.x == newPoint.x && p.y == newPoint.y) {
        return newPoint;
      } else {
        return p;
      }
    });

    return grid;
  })

  points.push(newPoint);
}


// Get rid of shapes with 2 or fewer points
const cleanupGrids = () => {

  grids = grids.map(grid => {
    let newPoints = [];
    grid.points.map(point => {
      if(newPoints.indexOf(point) === -1) {
        newPoints.push(point);
      }
    });
    grid.points = newPoints;
    return grid;
  });

  grids = grids.filter(grid => {
    return grid.points.length > 2;
  })
}


// Filter out points that aren't associated with any shapes
const cleanupPoints = () => {
  
  points = points.filter(p => {
    let contained = false;
    for(var i = 0; i < grids.length; i++) {
      
      let gridPoints = grids[i].points;
      if(gridPoints.includes(p)) {
        contained = true;
      }
    }
    return contained;
  });
}

let points = [];
let grids = [];
let frameCount = 0;
let hoverSegments = [];
let hoveredVertex = false;

const frameLoop = () => {
  hoverSegments = [];
  hoveredVertex = false;
  frameCount++;

  if(mouse.pressed == false && wobble) {
    points = points.map(p => {
      let delta = Math.sin(p.x/100 + frameCount/10) * 10;
      p.delta = delta;
      p.y = p.y + delta;
      return p;
    })
  }

  clearCanvas();

  // Draw each grid
  grids.map(grid => {
    grid.drawFill();
    grid.draw();
  });
  
  grids.map(grid => grid.drawOutLines("same"));
  grids.map(grid => grid.drawOutLines("dark"));

  // Draw the selected grid's outlines
  // if(hoverSegments.length === 0) {
  // }

  grids.map(grid => {
    if(grid.hovered && !grid.selected) {
      grid.drawOutLines("hovered");
    }
    if(grid.selected) {
      grid.drawOutLines("selected");
    }
  });


  drawControls();

  if(hoveredVertex == false ) {
    drawHoverSegment();
  }

  if(mouse.pressed == false && wobble) {
    points = points.map(p => {
      p.y = p.y - p.delta;
      p.delta = 0;
      return p;
    })
  }

  if(mouse.pressed == false) {
    mergeSamePoints();   // Make points close to each other have the same x,y values
    consolidatePoints(); // Make points with same x,y be the same points
    cleanupGrids();      // Throw out grids with less than 3 points
    cleanupPoints();     // Get rid of orphan points
  }

  drawDragZone();
  requestAnimationFrame(frameLoop);
}

const mergeSamePoints = () => {
  points = points.map(p => {
    points.map(otherP => {
      if(p != otherP) {
        let distance = Math.sqrt(Math.pow(p.x - otherP.x, 2) + Math.pow(p.y - otherP.y, 2));
        if(distance <= mergeDistance) {
          p.x = otherP.x;
          p.y = otherP.y;
        }
      }
    })
    return p;
  });
}

const drawDragZone = () => {
  if(mouse.dragging) {
    ctx.beginPath();
    ctx.fillStyle = dragZoneFillStyle;
    ctx.moveTo(mouse.dragZone.start.x, mouse.dragZone.start.y);
    ctx.lineTo(mouse.dragZone.end.x, mouse.dragZone.start.y);
    ctx.lineTo(mouse.dragZone.end.x, mouse.dragZone.end.y);
    ctx.lineTo(mouse.dragZone.start.x, mouse.dragZone.end.y);
    ctx.fill();
    ctx.closePath();
  }
}

const drawControls = () => {
  points.map(p => drawVertex(p));
}


const checkDragZone = p => {
  let startX  = Math.min(mouse.dragZone.start.x, mouse.dragZone.end.x);
  let endX    = Math.max(mouse.dragZone.start.x, mouse.dragZone.end.x);
  let startY  = Math.min(mouse.dragZone.start.y, mouse.dragZone.end.y);
  let endY    = Math.max(mouse.dragZone.start.y, mouse.dragZone.end.y);

  return (
     p.x > startX
  && p.x < endX
  && p.y > startY
  && p.y < endY
  )
}

const start = () => {
  let loaded = loadPicture();
  if(loaded == false) {
    resetPicture();
  }
  frameLoop();
}

start();