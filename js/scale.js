const scalePoints = (scalar) => {

  let selectedPoints = points.filter(p => p.selected);
  let midX = canvasWidth / 2;
  let midY = canvasHeight / 2;

  if(selectedPoints.length > 1) {

    let bounds = selectedPoints.reduce((bounds, point) => {
      if(point.x < bounds.minX) {
        bounds.minX = point.x;
      }
      if(point.x > bounds.maxX) {
        bounds.maxX = point.x;
      }
      if(point.y > bounds.maxY) {
        bounds.maxY = point.y;
      }
      if(point.y < bounds.minY) {
        bounds.minY = point.y;
      }
      return bounds;
    }, {
      minX : selectedPoints[0].x,
      maxX : selectedPoints[0].x,
      minY : selectedPoints[0].y,
      maxY : selectedPoints[0].y
    });

    midX = bounds.minX + (bounds.maxX - bounds.minX) / 2;
    midY = bounds.minY + (bounds.maxY - bounds.minY) / 2;
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
