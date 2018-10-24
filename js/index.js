// Seems like points are getting consolidated properly now
// but
// * dragging vertices (when two or more lines are higlighted)
// * starts a weird buggy clone


// Basic Config
const canvasWidth = 900
    , canvasHeight = 600


// Element references
const bodyEl = document.querySelector("body")
    , canvas = document.querySelector("canvas")
    , consoleEl = document.querySelector(".console")
    , ctx = canvas.getContext("2d", { alpha: false });

canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("width",  canvasWidth);


// let selectionZones = [];
// let currentSelectionZone = {};

// Select any hovered points
let cloning = false;
let cloners = [];
let mouseQueue = [];



canvas.addEventListener("mousedown", (e) => {

  cloners = [];
  cloning = false;
  mouse.pressed = true;
  mouse.anySelected = false;



  grids.map(grid => {

    if(grid.hovered) {
      grid.click();
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

      if(dist < 15) {
        if(cloners.length < 2) {
          cloners.push(thisP);
          cloners.push(nextP);
        }
      }
    }
  });

  console.log(cloners);

  points = points.map(p => {

    // let dist = distToSegment({x : mouse.x, y : mouse.y}, start, end);
    // if(p.clone == true) {
    //   cloners.push(p);
    // }

    if(p.hovered) {
      p.selected = true;
      mouse.anySelected = true;
    }
    return p;
  });

  if(mouse.AnySelected == false) {
    points = points.map(p => {
        p.selected = false;
        p.hovered = false;
        return p;
    });
  }

  if(mouse.anySelected == false ) {
    if(mouse.shiftPressed == false) {
      clearSticky();
    }
    mouse.dragging = true;
    mouse.dragZone.start.x = e.offsetX;
    mouse.dragZone.start.y = e.offsetY;
    mouse.dragZone.end.x = e.offsetX;
    mouse.dragZone.end.y = e.offsetY;
  }


  if(cloners.length == 2 && mouse.anySelected == false) {
    cloning = true;
    // Add new points to the points array
    let newOne = { x: parseInt(cloners[0].x), y: parseInt(cloners[0].y), selected: true}
    let newTwo = { x: parseInt(cloners[1].x), y: parseInt(cloners[1].y), selected: true}
    points.push(newOne);
    points.push(newTwo);


    // Add existing points to new points
    let newPoints = [
      cloners[0],
      cloners[1],
      newTwo,
      newOne
    ]

    mouse.dragging = false;
    // Create a grid tile from it
    grids.push(new Grid(newPoints, "top"));
  }


});


// Deselect all points on mouseup
window.addEventListener("mouseup", (e) => {
  mouse.pressed = false;

  for(var i = 0; i < grids.length; i++) {
    let g = grids[i];
  }

  cloning = false;


  points = points.map(p => {
    p.clone = false;
    return p;
  });


  if(mouse.dragging == true) {
    mouse.dragging = false;
  } else if(mouse.dragging == false) {
    points = points.map(p => {
      p.selected = false;
      return p;
    });
  }



});


canvas.addEventListener("mousemove", (e) => {

  let dX =  e.offsetX - mouse.x;
  let dY =  e.offsetY - mouse.y;

  if(mouse.dragging) {
    mouse.dragZone.end.x += dX;
    mouse.dragZone.end.y += dY;
  }

  // let one = { x : points[0].x, y : points[0].y};
  // let two = { x : points[1].x, y : points[1].y};

  points = points.map(p => {

    if(mouse.dragging) {
      p.hovered = false;
      p.stickyHovered = checkDragZone(p);
    }

    if(mouse.dragging == false) {
      let distance = Math.sqrt(Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2));
      let radius = 20;

      if(distance < radius) {
        p.hovered = true;
      } else {
        p.hovered = false;
      }
    }

    if(p.selected) {
      p.x += dX;
      p.y += dY;
      moveSticky(dX,dY);

      points.map(otherP => {
        if(otherP != p) {
          let distance = Math.sqrt(Math.pow(p.x - otherP.x, 2) + Math.pow(p.y - otherP.y, 2));
          if(distance < 10) {
            // p.x = otherP.x;
            // p.y = otherP.y;
          }

        }
      })



    }

    return p;
  });

  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
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
  68 : "delete"
}

const getKey = keyCode => {
  return keyMap[keyCode];
}

window.addEventListener("keydown", e => {
  let key = getKey(e.keyCode);

  if(key == "delete") {


    let selectedPoints = points.filter(p => {
      return p.stickyHovered;
    });

    deletePoints(selectedPoints);
  }

});

const deletePoints = (selectedPoints) => {

  if(selectedPoints.length == 0) {
    return;
  }

  grids = grids.map(grid => {
    grid.points = grid.points.filter(p => {
      for(var i = 0; i < selectedPoints.length; i++) {
        return p != selectedPoints[i];
      }
    });
    return grid;
  });
  
  points = points.filter(p => {
    for(var i = 0; i < selectedPoints.length; i++) {
      return p != selectedPoints[i];
    }
  });

  
}

window.addEventListener("keyup", e => {
  let key = getKey(e.keyCode);
  if(key == "shift") {
    // mouse.shiftPressed = false;
  }
});



const mouse = {
  x : 0,
  y: 0,
  
  pressed : false,
  anySelected : false,
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


let size = 140;
let startX = 360;
let startY = 200;

let points = [
  {x : startX, y : startY},
  {x : startX + size, y : startY},
  {x : startX + size, y : startY + size},
  {x : startX, y : startY + size}
];
let grids = [];

grids.push(new Grid(points, "right"));

// Check if there are any overlapping points...
const consolidatePoints = () => {

  // need to replace the point in teh place where it was taken out of
  // Build list of points that are the same...

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


let holdCount = 0;
let heldEnough = false;

// Get rid of shapes with 2 or fewer points
const cleanupGrids = () => {

  grids = grids.filter(grid => {
    return grid.points.length > 2;
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
    return contained;
  });
}

const frameLoop = () => {

    
  consoleEl.innerText = points.length;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  drawControls();

  grids.map(g => {
    g.draw();
  });

  if(mouse.pressed == false) {

     points = points.map(p=> {
        points.map(otherP=> {
          if(p != otherP) {
            let distance = Math.sqrt(Math.pow(p.x - otherP.x, 2) + Math.pow(p.y - otherP.y, 2));
            if(distance < 30) {
              p.x = otherP.x;
              p.y = otherP.y;


            }

          }
        })
        return p;
      });

    consolidatePoints(); // Merge same points together


    //cleanupGrids();      // Throw out grids with less than 3 pionts
    // cleanupPoints();     // Get rid of orphan points
  }

  drawDragZone();

  requestAnimationFrame(frameLoop);
}

const drawDragZone = () => {
    if(mouse.dragging) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,0,0,.15)";
      ctx.moveTo(mouse.dragZone.start.x, mouse.dragZone.start.y);
      ctx.lineTo(mouse.dragZone.end.x, mouse.dragZone.start.y);
      ctx.lineTo(mouse.dragZone.end.x, mouse.dragZone.end.y);
      ctx.lineTo(mouse.dragZone.start.x, mouse.dragZone.end.y);
      ctx.fill();
      ctx.closePath();
    }
}


const drawControls = () => {

  points = points.map(p => {

      ctx.beginPath();
      ctx.arc(p.x, p.y, 20, Math.PI * 2,0);

      if(p.stickyHovered) {
        ctx.fillStyle = "rgba(255,0,0,.1)";
        if(mouse.shiftPressed) {
          ctx.fillStyle = "rgba(255,0,0,.15)";
        }
        ctx.fill();
      }

      if(p.hovered) {
        ctx.fillStyle = "#EEEEEE";
        ctx.fill();
      }

      ctx.closePath();

      return p;
    
  })
}

frameLoop();


function getRandom(min, max){
  return min + Math.random() * (max-min);
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