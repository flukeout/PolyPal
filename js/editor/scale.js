const scalePoints = (scalar, shouldPushHistory) => {
  if(shouldPushHistory != false) {
    pushHistory();
  }


  let selectedPoints = getSelectedPoints();

  if(selectedPoints.length == 1) {
    deselectPoints();
  }

  let midX = canvasWidth / 2;
  let midY = canvasHeight / 2;

  if(selectedPoints.length > 1) {
    let midPoint = getMidpoint(selectedPoints);
    midX = midPoint.x;
    midY = midPoint.y;
  }

  points = points.map(p => {
    if(selectedPoints.length < 2 ) {
      p.x = p.x + (p.x - midX) * scalar;
      p.y = p.y + (p.y - midY) * scalar;
    } else {
      if(p.selected || selectedPoints.indexOf(p) > -1) {
        p.x = p.x + (p.x - midX) * scalar;
        p.y = p.y + (p.y - midY) * scalar;
      }
    }
    return p;
  });

  frameLoop();
}


const rotatePoints = (angle, shouldPushHistory) => {
  if(shouldPushHistory != false) {
    pushHistory();
  }

  let midX = canvasWidth / 2;
  let midY = canvasHeight / 2;

  let selectedPoints = getSelectedPoints();

  if(selectedPoints.length === 1) {
    deselectPoints();
  }

  if(selectedPoints.length > 1) {
    let midPoint = getMidpoint(selectedPoints);
    midX = midPoint.x;
    midY = midPoint.y;
  }

  points = points.map(p => {
    let cx = midX;
    let cy = midY;
    let x = p.x;
    let y = p.y;

    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    if(selectedPoints.length < 2) {
      p.x = nx;
      p.y = ny;
    } else {
      if(p.selected || selectedPoints.indexOf(p) > -1) {
        p.x = nx;
        p.y = ny;
      }
    }
    return p;
  });
  frameLoop();
}


const getSelectedPoints = () => {
  let selectedPoints = points.filter(p => p.selected);

  // Try loading girds
  if(selectedPoints.length === 0) {
      grids.map(grid => {
      if(grid.selected) {
        grid.points.map(p => {
          selectedPoints.push(p);
        });
      }
    })
  }
  return selectedPoints;
}