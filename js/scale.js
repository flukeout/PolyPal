const scalePoints = (scalar) => {

  let selectedPoints = points.filter(p => p.selected);

  if(selectedPoints.length == 1) {
    return;
  }

  let midX = canvasWidth / 2;
  let midY = canvasHeight / 2;

  if(selectedPoints.length > 1) {
    let midPoint = getMidpoint(selectedPoints);
    midX = midPoint.x;
    midY = midPoint.y;
  }

  points = points.map(p => {
    if(selectedPoints.length === 0 ) {
      p.x = p.x + (p.x - midX) * scalar;
      p.y = p.y + (p.y - midY) * scalar;
    } else {
      if(p.selected) {
        p.x = p.x + (p.x - midX) * scalar;
        p.y = p.y + (p.y - midY) * scalar;
      }
    }
    return p;
  });
}


const rotatePoints = (angle) => {

  let midX = canvasWidth / 2;
  let midY = canvasHeight / 2;

  let selectedPoints = points.filter(p => p.selected);

  if(selectedPoints.length === 1) {
    return;
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

    if(selectedPoints.length === 0) {
      p.x = nx;
      p.y = ny;
    } else {
      if(p.selected) {
        p.x = nx;
        p.y = ny;
      }
    }
    return p;
  });

}
