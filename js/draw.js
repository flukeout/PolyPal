const drawVertex = (p) => {

  drawSvgVertex(p);

  if(p.hovered) {
    hoveredVertex = true;
  }
}

const drawSvgVertex = (p) => {
  if(!p.svgEl) { return }

  if(p.selected) {
    p.svgEl.querySelector(".bigcircle").setAttribute("stroke", "rgba(0,0,0,1)");
    p.svgEl.querySelector(".smallcircle").setAttribute("fill", "rgba(0,0,0,1)");
  } else if (p.hovered) {
    p.svgEl.querySelector(".bigcircle").setAttribute("stroke", "rgba(0,0,0,.3)");
    p.svgEl.querySelector(".smallcircle").setAttribute("fill", "none");
  } else if (p.stickyHovered) {
    p.svgEl.querySelector(".bigcircle").setAttribute("stroke", "none");
    p.svgEl.querySelector(".smallcircle").setAttribute("fill", "rgba(0,0,0,.5)");
  } else {
    p.svgEl.querySelector(".bigcircle").setAttribute("stroke", "none");
    p.svgEl.querySelector(".smallcircle").setAttribute("fill", "none");
  }

  p.svgEl.setAttribute("x",p.x);
  p.svgEl.setAttribute("y",p.y);
}



let hoverSegmentSvg = false;
// Draw the segment that is being hovered
const drawHoverSegment = () => {

  let closestSegment = hoverSegments.reduce((segment, closestSeg) => {
    if(segment.distance < closestSeg.distance) {
      return segment;
    } else {
      return closestSeg;
    }
  }, hoverSegments[0]);

  if(hoverSegmentSvg == false) {
    let attributes = {
      "fill" : "transparent",
      "stroke-width" : "3",
      "stroke" : "rgba(0,0,0,1)"
    }
    hoverSegmentSvg = makeSvg("line", attributes, ".svg-points");
  }

  if(closestSegment) {
    updateHoverSegment({
      "x1" : closestSegment.start.x,
      "y1" : closestSegment.start.y,
      "x2" : closestSegment.end.x,
      "y2" : closestSegment.end.y,
    });
    hoverSegmentSvg.setAttribute("stroke", "rgba(0,0,0,.4");
  } else {
    hoverSegmentSvg.setAttribute("stroke", "rgba(0,0,0,0");
  }

}

const updateHoverSegment = attrs => {
  hoverSegmentSvg.setAttribute("x1", attrs.x1);
  hoverSegmentSvg.setAttribute("y1", attrs.y1);
  hoverSegmentSvg.setAttribute("x2", attrs.x2);
  hoverSegmentSvg.setAttribute("y2", attrs.y2);
}
