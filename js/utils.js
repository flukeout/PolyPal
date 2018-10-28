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
