// Basic Config
const canvasWidth = 900
    , canvasHeight = 600


// Element references
const bodyEl = document.querySelector("body")
    , canvas = document.querySelector("canvas")
    , ctx = canvas.getContext("2d", { alpha: false });

canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("width",  canvasWidth);




// let selectionZones = [];
// let currentSelectionZone = {};

// Select any hovered points
canvas.addEventListener("mousedown", (e) => {

  mouse.pressed = true;
  mouse.anySelected = false;

  points = points.map(row => {
    return row.map(p => {
      if(p.hovered) {
        p.selected = true;
        mouse.anySelected = true;
      }
      return p;
    });
  });

  if(mouse.AnySelected == false) {
    points = points.map(row => {
      return row.map(p => {
        p.selected = false;
        p.hovered = false;
        return p;
      });
    });
  }

  if(mouse.anySelected == false ) {
    // if(mouse.shiftPressed == false) {
      clearSticky();
    // }

    mouse.dragging = true;
    mouse.dragZone.start.x = e.offsetX;
    mouse.dragZone.start.y = e.offsetY;
    mouse.dragZone.end.x = e.offsetX;
    mouse.dragZone.end.y = e.offsetY;
  }

});


// Deselect all points on mouseup
window.addEventListener("mouseup", (e) => {
  mouse.pressed = false;

  if(mouse.dragging == true) {
    mouse.dragging = false;
  } else if(mouse.dragging == false) {
    

  points = points.map(row => {
    return row.map(p => {
        p.selected = false;
        return p;
    });
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

  points = points.map(row => {
    return row.map(p => {

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
      }

      return p;

    });
  });

  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});

const clearSticky = () => {
   points = points.map(row => {
    return row.map(p => {
      if(p.stickyHovered) {
        p.stickyHovered = false;
      }
      return p;
    });
  });
}

const moveSticky = (dX, dY) => {
   points = points.map(row => {
    return row.map(p => {
      if(p.stickyHovered && !p.selected) {
        p.x += dX;
        p.y += dY;
      }
      return p;
    });
  });

}


const keyMap = {
  37 : "left",
  38 : "up",
  39 : "right",
  40 : "down",
  16 : "shift"
}

const getKey = keyCode => {
  return keyMap[keyCode];
}

window.addEventListener("keydown", e => {
  let key = getKey(e.keyCode);
  if(key == "shift") {
    // mouse.shiftPressed = true;
  }
});

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

let size = 10;
let points = [];

for(var i = 0; i < size; i++) {
  points[i] = [];
  for(var j = 0; j < size; j++) {
    points[i].push({
      x: 0, 
      y: 0, 
      active: false,
      hovered: false,
      stickyHovered : false,
      selected: false
    }); 
  }
}




let grids = [];
grids[0] = new Grid(2, 2, 100, "right");
grids[1] = new Grid(3, 2, 100, "right");
grids[2] = new Grid(4, 2, 100, "right");
grids[3] = new Grid(2, 3, 100);
grids[4] = new Grid(3, 3, 100);
grids[5] = new Grid(4, 3, 100);



const frameLoop = () => {
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawControls();

  grids.map(g => {
    g.draw();
  })

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

  points = points.map(row => {
    return row.map(p => {

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
  })
}

const drawShip = () => {
  return;
  if(ship.right) {
    ship.xV += ship.accel;
  } else if (ship.left) {
    ship.xV -= ship.accel;
  } else {
    ship.xV *= ship.brakeRatio;
  }

  if(ship.up) {
    ship.yV -= ship.accel;
  } else if (ship.down) {
    ship.yV += ship.accel;
  } else {
    ship.yV *= ship.brakeRatio;
  }

  // Limit max speed
  ship.x += ship.xV;
  if(Math.abs(ship.xV) > ship.maxV){
    ship.xV = ship.xV > 0 ? ship.maxV : -ship.maxV;
  }

  ship.y += ship.yV;
  if(Math.abs(ship.yV) > ship.maxV){
    ship.yV = ship.yV > 0 ? ship.maxV : -ship.maxV;
  }

  // Constrain ship position
  if(ship.x < ship.width) { ship.x = ship.width }
  if(ship.x > canvasWidth - ship.width) { ship.x = canvasWidth - ship.width} 
  if(ship.y < 0) { ship.y = 0 }
  if(ship.y > canvasHeight - ship.height) { ship.y = canvasHeight - ship.height }

  ctx.lineCap = "round";

  // Ship is taller when decelerating, shorter when accelerating
  let heightModifier = mapScale(ship.yV, -4, 4, -1, 1);
  let drawHeight =  ship.height + (5 * heightModifier);

  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y);

  // Figure out ship tilt based on x velocity
  let shipAngle = 2 * Math.PI;
  let angleOffset = mapScale(ship.xV, -ship.maxV , ship.maxV, -.4, .4);
  
  // Draw right wing
  let rX = ship.width * Math.cos(shipAngle + angleOffset);
  let rY = ship.width * Math.sin(shipAngle + angleOffset);
  ctx.moveTo(ship.x, ship.y + drawHeight);
  ctx.lineTo(ship.x + rX, ship.y + rY + drawHeight);
  ctx.lineTo(ship.x, ship.y);

  // Draw left wing
  let nA = shipAngle / 2;
  let lX =  ship.width * Math.cos(nA + angleOffset);
  let lY =  ship.width * Math.sin(nA + angleOffset);
  ctx.moveTo(ship.x, ship.y + drawHeight);
  ctx.lineTo(ship.x + lX, ship.y + lY + drawHeight);
  ctx.lineTo(ship.x, ship.y);
  

  let offsetY = 60; // Slight offset for collision checking

  let perlinNoise = noise.simplex2(
    perlinPosition.x + (perlinDetail * ship.x),
    perlinPosition.y + (perlinDetail * (ship.y + offsetY))
  ) * perlinScalar;

  // Ship height
  ship.altitude = mapScale(perlinNoise, -1, 1, 0, 50);

  if(ship.altitude < 20 && perlinScalar === 1) {
    if(!ship.hit) {
      crash();
    }
  }

  ctx.strokeStyle = "rgba(255,   0,   0, 0.5)";
  ctx.fillStyle   = "rgba(255, 255, 255, 0.6)";

  ship.hit ? ctx.stroke() : ctx.fill();

  ctx.closePath();

  // Draw ship shadow
  if(!ship.hit){
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,.15)";
    ctx.moveTo(ship.x, ship.y + ship.altitude);
    ctx.lineTo(ship.x + lX, ship.y + drawHeight + ship.altitude);
    ctx.lineTo(ship.x + rX, ship.y + drawHeight + ship.altitude);
    ctx.fill();
    ctx.closePath();
  }
}

const drawPortal = () => {
  let x = canvasWidth - ship.x;
  let y = canvasHeight - ship.y;
  portalPosition.x = x;
  portalPosition.y = y;

  let heightModifier = mapScale(-ship.yV, -4, 4, -1, 1);
  let drawHeight =  (ship.height - 2) + (5 * heightModifier);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";

  ctx.beginPath();
  ctx.moveTo(x, y);

  // Figure out ship tilt based on x velocity
  let shipAngle = 2 * Math.PI;
  let angleOffset = mapScale(ship.xV, -ship.maxV , ship.maxV, .4, -.4);
  
  // Draw right wing
  let rX = (ship.width - 2) * Math.cos(shipAngle + angleOffset);
  let rY = ship.width * Math.sin(shipAngle + angleOffset);
  ctx.moveTo(x, y + drawHeight);
  ctx.lineTo(x + rX, y + rY + drawHeight);
  ctx.lineTo(x, y);

  // Draw left wing
  let nA = shipAngle / 2;
  let lX =  (ship.width - 2) * Math.cos(nA + angleOffset);
  let lY =  ship.width * Math.sin(nA + angleOffset);
  ctx.moveTo(x, y + drawHeight);
  ctx.lineTo(x + lX, y + lY + drawHeight);
  ctx.lineTo(x, y);

  ctx.stroke();
  ctx.closePath();

}

const drawLine = (x, y, column) => {

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "butt";

  let p  = { x : x - xPointSpacing, y : y };
  let pP = { x : x - xPointSpacing, y : y };

  let perlinDelta;
  let segmentCount = Math.ceil(canvasWidth / xPointSpacing);
  // let xSpacing = xPointSpacing / 40;
  // let ySpacing = yLineSpacing / 40;

  // Draw each line segment
  for(let i = -1; i < segmentCount; i++) {

    let perlinNoise = noise.simplex2(
      perlinPosition.x + perlinDetail * i * xPointSpacing,
      perlinPosition.y + perlinDetail * column * yLineSpacing
    ) * perlinScalar;

    perlinDelta = peakHeight * (-1 + perlinNoise);

    p.x = p.x + xPointSpacing;

    let alpha = .1 + ( .4 * mapScale(Math.abs(perlinDelta), 60, 80, 0, 1));
    alpha = alpha.toFixed(2);

    if(i > -1) {
      ctx.beginPath();
      ctx.strokeStyle = 
        ship.hit ? 
          `rgba(255,   0,   0, ${alpha})`:
          `rgba(255, 255, 255, ${alpha})`;

      ctx.moveTo(p.x, p.y + perlinDelta);
      ctx.lineTo(pP.x, pP.y);
      ctx.stroke();
      ctx.closePath();
    }

    // Remember the last point your drew
    pP.x = parseInt(p.x);
    pP.y = parseInt(p.y + perlinDelta);
  }
}

// const warpLine = {
//   start : { x :   0, y :   0 },
//   end :   { x : 400, y : 400 },
//   life : 0,
//   maxLife : 100,
//   lineWidth : 20,
//   fadeSpeed : 15,

//   startLine : function(sX, sY, eX, eY){
//     this.start.x = sX;
//     this.start.y = sY;
//     this.end.x = eX;
//     this.end.y = eY;
//     this.life = this.maxLife;
//   },
  
//   draw : function() {
//     this.life -= this.fadeSpeed;

//     if(this.life < 0) {
//       this.life = 0;
//     }

//     if(this.life === 0) { return };

//     let gradient = ctx.createLinearGradient(this.start.x, this.start.y, this.end.x, this.end.y);
//     let lineAlpha = this.life / this.maxLife;

//     gradient.addColorStop(1,"rgba(255,255,255,"+lineAlpha/2+")");
//     gradient.addColorStop(0,"rgba(255,255,255,0)");

//     ctx.lineCap = "round";
//     ctx.strokeStyle = gradient;
//     ctx.lineWidth = this.lineWidth;

//     let midX = Math.min(this.end.x, this.start.x) + Math.abs(this.end.x - this.start.x) /2;
//     let midY = Math.min(this.end.y, this.start.y);

//     ctx.beginPath();
//     ctx.moveTo(this.start.x, this.start.y);
//     ctx.quadraticCurveTo(midX, midY - 20, this.end.x, this.end.y);
//     ctx.stroke();
//     ctx.closePath();
//   }
// }

// noise.seed(Math.random());

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