// Basic Config


let canvasWidth = svgImage.getBoundingClientRect().width;
let canvasHeight = svgImage.getBoundingClientRect().height;

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

svgScene.addEventListener("mousedown", (e) => {

  mouse.pressed = true;

  if(selectedTool == "paintbrush") {
    let clickedGrids = [];
    grids.map(grid => { 
      if(grid.hovered) {
        clickedGrids.push(grid)
      }
    });
    if(clickedGrids.length >0 ) {
      highestZIndexItem(clickedGrids).fillColor = selectedColor;
    }
  }

  if(selectedTool == "selector") {

    cloners = [];
    cloning = false;

    pointSelected = false;
    gridSelected = false;

    let gridClicked = false;
    let clickedSelectedPoint = false;

    // Check if we are clicking a selected
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

        let clickedGrids = [];

        grids.map(grid => {

          // Push all the clicked grids into an array
          if(grid.hovered) {
            grids = grids.map(nGrid => {
              if(nGrid != grid) {
                nGrid.selected = false;
              }
              return nGrid;
            });
            clickedGrids.push(grid);
          }

          // Figure out segment hovering
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
        }); // end grid.map...

        // Click the Grid with the highest z index
        if(clickedGrids.length > 0) {
          highestZIndexItem(clickedGrids).click();
          gridClicked = true;
        }

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
      let newGrid = createGrid(newPoints, {
        fillColor : selectedColor,
        mode : "ghost"
      });

      // Keep track of the cloned grid...
      clonedGrid.grid = newGrid;
      clonedGrid.distanceTraveled = 0;
      clonedGrid.startPoint.x = parseInt(mouse.x);
      clonedGrid.startPoint.y = parseInt(mouse.y);

      grids.push(newGrid);
    }
  }
});


window.addEventListener("mousemove", (e) => {

  let dX =  e.offsetX - mouse.x;
  let dY =  e.offsetY - mouse.y;

  if(selectedTool === "selector") {

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
  }

  if(selectedTool === "move" && mouse.pressed) {
    points = points.map(p => {
      p.x += dX;
      p.y += dY;
      return p;
   });
  }

  if(selectedTool === "paintbrush" && mouse.pressed) {
    let clickedGrids = [];
    grids.map(grid => { 
      if(grid.hovered) {
        clickedGrids.push(grid)
      }
    });
    if(clickedGrids.length >0 ) {
      highestZIndexItem(clickedGrids).fillColor = selectedColor;
    }
  }

  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});

// Deselect all points on mouseup
window.addEventListener("mouseup", (e) => {
  mouse.pressed = false;
  mouse.dragging = false;

  // SVG
  dragSvg.remove();
  dragSvg = false;

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
    points = customFilter(points, (p => p.selected));
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
  grids = customFilter(grids, (g => g.selected));
}

window.addEventListener("keyup", e => {
  let key = getKey(e.keyCode);
});


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

  // Draw each grid
  grids.map(grid => {
    if(selectedTool == "selector") {
      grid.checkHoverSegments();
    }

    grid.showHover = hoverSegments.length > 0 ? false : true;

    grid.drawFill();
    grid.draw();

    let hoveredGrids = grids.filter(g => g.hovered);

    grid.showHovered = false;

    if(hoveredGrids.length > 0) {
      hoveredGrids = hoveredGrids.sort((a,b) => {
        return a.zIndex < b.zIndex ? 1 : -1;
      });
      hoveredGrids[0].showHovered = true;
    }

    grid.canvasDraw();
  });

  points.map(p => drawVertex(p) );

  let hoveringSegments = hoverSegments.length > 0 ? true : false;

  if(selectedTool === "selector") {
    drawHoverSegment(); // Draw the hovered line segment closest ot pointer  
  }

  if(hoverSegmentSvg) {
    if(hoveredVertex == true) {
      hoverSegmentSvg.setAttribute("stroke", "none");
    }
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

let dragSvg = false;

const drawDragZone = () => {

  if(dragSvg == false) {
    let attributes = {
      "fill" : "rgba(255,0,0,.2)"
    }
    dragSvg = makeSvg("polygon", attributes, ".svg-points");
  }

  if(mouse.dragging) {

    let dragPoints = [
      {
        x: mouse.dragZone.start.x,
        y: mouse.dragZone.start.y
      },{
        x: mouse.dragZone.end.x,
        y: mouse.dragZone.start.y
      },{
        x: mouse.dragZone.end.x,
        y: mouse.dragZone.end.y
      },{
        x: mouse.dragZone.start.x,
        y: mouse.dragZone.end.y
      },
    ]

    // SVG
    let pointsString = dragPoints.reduce((string, point) => {
      return string + parseInt(point.x) + "," + parseInt(point.y) + " ";
    }, "");
    dragSvg.setAttribute("points", pointsString);
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
  grids = customFilter(grids, (g => g.mode === "ghost"));
  
}


// Get rid of shapes with 2 or fewer points
const cleanupGrids = () => {

  // Get rid of shapes in a grid that don't exist in the points array
  grids = grids.map(grid => {
    grid.points = customFilter(grid.points, (p => points.indexOf(p) === -1));
    return grid;
  });

  // Get rid of shapes that have fewer than 3 pints
  grids = customFilter(grids, (grid => grid.points.length < 3));
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

