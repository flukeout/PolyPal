// Cool utility functions

// Distance from a point to a line segment
// p    = point {x,y}
// v, w = start and and points {x,y}, {x,y}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

function distPoints(v, w) { 
  let deltaX = w.x - v.x;
  let deltaY = w.y - v.y;
  return Math.sqrt(Math.pow(deltaX,2 ) + Math.pow(deltaY ,2));

}


function getRandom(min, max){
  return min + Math.random() * (max-min);
}

// Check if a point is within a polygon
// * point   = [x,y]
// * polygon = [[x,y], [x,y], [x,y]]
function testWithin(point, vs) {

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function getRandom(min, max){
  return min + Math.random() * (max-min);
}


const comparePoints = (point, otherPoint) => {
  return point.x == otherPoint.x && point.y == otherPoint.y;
}

const dQ = (selector) => {
  return document.querySelector(selector);
}



const getMidpoint = (points) => {

  let bounds = points.reduce((bounds, point) => {
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
    minX : points[0].x,
    maxX : points[0].x,
    minY : points[0].y,
    maxY : points[0].y
  });

  return {
    x : bounds.minX + (bounds.maxX - bounds.minX) / 2,
    y : bounds.minY + (bounds.maxY - bounds.minY) / 2
  }

}

function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


