// Basic Config
const canvasWidth = 500
    , canvasHeight = 600

// Element references
const bodyEl = document.querySelector("body")
    , canvas = document.querySelector("canvas")
    , ctx = canvas.getContext("2d", { alpha: false })
    , svgScene = document.querySelector(".svg-canvas")
    , svgImage = document.querySelector(".svg-image")
    , svgPoints = document.querySelector(".svg-points");

canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("width",  canvasWidth);

let cloning = false;
let cloners = [];
let wobble = false;
let pointSelected = false;
let gridSelected = false;
let newGrid;
let distanceTraveled;

let clonedGrid = {
  newGrid : "",
  startPoint : {
    x : 0,
    y : 0
  },
  distanceTraveled : 0
}

canvas.addEventListener("mousedown", (e) => {

  if(selectedTool == "paintbrush") {
    grids.map(grid => {
      if(grid.hovered) {
        grid.fillColor = selectedColor;
      }
    });
    return;
  }

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
      newOne = { x: parseInt(cloners[0].x), y: parseInt(cloners[0].y)}
      newTwo = { x: parseInt(cloners[1].x), y: parseInt(cloners[1].y)}

      newOne = createPoint(newOne);
      newTwo = createPoint(newTwo);

      newOne.cloning = true;
      newTwo.cloning = true;

      points.push(newTwo);
      points.push(newOne);
      newPoints.push(newTwo);
      newPoints.push(newOne);
      
    } else if (settings.extrudeMode == "point") {
      newOne = { x: parseInt(mouse.x), y: parseInt(mouse.y)}

      newOne = createPoint(newOne);
      newOne.cloning = true;

      points.push(newOne);
      newPoints.push(newOne);
    }

    newPoints.push(cloners[0]);
    newPoints.push(cloners[1]);

    mouse.dragging = false;

    // Create a grid tile from it
    // newPoints = newPoints.map(p => createPoint(p));

    newGrid = new Grid(newPoints, "top");
    newGrid.mode = "ghost";
    newGrid.fillColor = selectedColor;

    // Keep track of the cloned grid...
    clonedGrid.grid = newGrid;
    clonedGrid.distanceTraveled = 0;
    clonedGrid.startPoint.x = parseInt(mouse.x);
    clonedGrid.startPoint.y = parseInt(mouse.y);

    grids.push(newGrid);
  }

});



canvas.addEventListener("mousemove", (e) => {

  let dX =  e.offsetX - mouse.x;
  let dY =  e.offsetY - mouse.y;

  if(clonedGrid.grid) {
    let cloneDist = distPoints(clonedGrid.startPoint, { x: mouse.x, y : mouse.y});
    if(cloneDist > 18) {
      clonedGrid.grid.mode = "normal";
    } else {
      clonedGrid.grid.mode = "ghost";
    }
  }

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
  mouse.dragging = false;
  cloning = false;

  points = points.map(p => {
    if(p.stickyHovered) {
      p.stickyHovered = false;
      p.selected = true;
    }
    p.cloning = false;
    
    return p;
  });

});


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
  

  // grids = grids.filter(grid => {
  //   let keep = !grid.selected;
  //   if(!keep) {
  //     grid.svgEl.remove();
  //   }
  //   return keep;
  // });

  grids = customFilter(grids, (g => !g.selected));
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
    let shouldKeep = selectedPoints.indexOf(p) == -1;
    
    if(shouldKeep == false) {
      console.log("kill it");
      p.svgEl.remove();
    }
    return shouldKeep;
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
    grid.canvasDraw();
  });
  
  grids.map(grid => grid.drawOutLines("same")); // Fills in gaps between shapes
  grids.map(grid => grid.drawOutLines("dark")); // Draws lines around shapes

  // Draws hovered or selected lines

  grids.map(grid => {
    if(grid.hovered && !grid.selected && hoverSegments.length == 0) {
      grid.drawOutLines("hovered");
    }
    if(grid.selected) {
      grid.drawOutLines("selected");
    }
  });

  points.map(p => {
      drawVertex(p);
  });


  if(hoveredVertex == false ) {
    drawHoverSegment(); // Draw the hovered line segment
  }

  if(mouse.pressed == false && wobble) {
    points = points.map(p => {
      p.y = p.y - p.delta;
      p.delta = 0;
      return p;
    })
  }

  if(mouse.pressed == false) {
    killGhosts();        // Kill shapes that are ghosts
    cleanupPoints();     // Get rid of orphan points
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



// Check if there are any overlapping points...
const consolidatePoints = () => {

  let x, y;
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
  let newPoint = { x: x, y: y};
  newPoint = createPoint(newPoint);
  newPoint.new = true;
  let alreadyReturned;

  // this does NOT update the 'grids value'
  // might as well do it the mapped way...

  points = points.filter(p => {
    if(p.x == newPoint.x && p.y == newPoint.y) {
      p.svgEl.remove();
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

const killGhosts = () => {
  clonedGrid.grid = false;
  grids = customFilter(grids, (g => g.mode != "ghost"));
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
    let keep = grid.points.length > 2;
    if(keep == false ) {
      grid.svgEl.remove();
    }
    return keep;
  });
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
    if(contained == false) {
      p.svgEl.remove();
    }
    return contained;
  });
}

start();

