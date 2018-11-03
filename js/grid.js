const deselectGrids = () => {
  grids = grids.map(grid => {
    grid.selected = false;
    return grid;
  });
}

class Grid {

    constructor(points) {
      this.points = points;

      this.lineWidth = 1;
      this.fillLineColor = "#AAA";
      this.numFillLines = shapeFillLineCount;

      this.outlineWidth = shapeOutlineLineWidth;
      this.outlineColor = shapeOutlineColor;
      this.fillStartPoint = 0;

      this.fillColor = "grid";

      this.hovered = false;
      this.selected = false;
      this.svgCreated = false;
      this.svgEl = false;
      this.uiEl = false;
    }

    draw() {
      this.checkShapeHover();
      // this.drawFill();
      // this.drawFillLines();
      // this.drawOutLines();
      // this.drawOutLines();
    }

    createSvg() {

      let pointsString = this.points.reduce((string, point) => {
        return string + parseInt(point.x) + "," + parseInt(point.y) + " ";
      }, "");
      this.svgCreated = true;

      // This is the actual image element
      this.svgEl = document.createElementNS("http://www.w3.org/2000/svg","polygon");
      this.svgEl.setAttribute("stroke-width", "1");
      this.svgEl.setAttribute("stroke", "rgba(0,0,0,.2");
      svgImage.appendChild(this.svgEl);

      // This is for displaying selections, etc
      this.uiEl = document.createElementNS("http://www.w3.org/2000/svg","polygon");
      this.uiEl.setAttribute("stroke-width", "2");
      this.uiEl.setAttribute("stroke-linejoin", "round");
      this.uiEl.setAttribute("fill", "transparent");
      svgPoints.appendChild(this.uiEl);

      this.updatePoly();
    }

    updatePoly() {
      let pointsString = this.points.reduce((string, point) => {
        return string + parseInt(point.x) + "," + parseInt(point.y) + " ";
      }, "");

      if(this.mode != "ghost") { 
        this.svgEl.setAttribute("fill", this.fillColor);
      } else {
        this.svgEl.setAttribute("fill", "transparent");
      }
      
      if(this.selected) { 
        this.uiEl.setAttribute("stroke", "rgba(0,0,0,1");
      } else if(this.hovered) { 
        this.uiEl.setAttribute("stroke", "rgba(0,0,0,.3");
      } else {
        this.uiEl.setAttribute("stroke", "transparent");
      }

      this.svgEl.setAttribute("points", pointsString);
      this.uiEl.setAttribute("points", pointsString);
    }

    canvasDraw() {
      if(this.svgCreated == false ){
        this.createSvg();
      } 
      this.updatePoly();
      
    }

    drawFill() {
      if(this.points.length === 0) { return }
      if(this.mode === "ghost") { return }

      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for(var i = 1 ; i < this.points.length; i++) {
        let p = this.points[i];
        ctx.lineTo(p.x, p.y);
      }

      if(this.fillColor !== "grid") {
        ctx.fillStyle = this.fillColor;
      } else {
        ctx.fillStyle = "#FFFFFF";
      }

      ctx.fill();
      ctx.closePath();
    }

    checkShapeHover() {
      let shapePoints = [];
      for(var i = 0; i < this.points.length; i++) {
        let p = this.points[i];
        shapePoints.push([p.x, p.y]);
      }
      this.hovered = testWithin([mouse.x, mouse.y], shapePoints);
    }

    click() {
      // this.fillStartPoint++;
      this.selected = !this.selected;

      if(this.selected) {
        selectedGrids.push(this);
      }
      // if(this.fillStartPoint >= this.points.length) {
      //   this.fillStartPoint = 0;
      // }
      // this.fillColor = selectedColor;
    }

    drawFillLines() {


      if(this.fillColor !== "grid") {
        return;
      }

      if(this.points.length < 3) { return }

      let firstPoint, secondPoint, thirdPoint, fourthPoint;
      let startXDelta, startYDelta, endXDelta, endYDelta;

      firstPoint = this.points[this.fillStartPoint] || this.points[this.fillStartPoint - this.points.length];
      secondPoint = this.points[this.fillStartPoint + 1] || this.points[this.fillStartPoint - this.points.length + 1];
      thirdPoint = this.points[this.fillStartPoint + 2] || this.points[this.fillStartPoint - this.points.length + 2];
      fourthPoint;

      if(this.points.length == 4) {
        fourthPoint = this.points[this.fillStartPoint + 3] || this.points[this.fillStartPoint - this.points.length + 3];
        
      }

      if(this.points.length == 3) {
        fourthPoint = this.points[this.fillStartPoint] || this.points[this.fillStartPoint - this.points.length];
      }

      startXDelta = (secondPoint.x - firstPoint.x) / this.numFillLines;
      startYDelta = (secondPoint.y - firstPoint.y) / this.numFillLines;

      endXDelta = (thirdPoint.x - fourthPoint.x) / this.numFillLines;
      endYDelta = (thirdPoint.y - fourthPoint.y) / this.numFillLines;

      ctx.beginPath();
      ctx.strokeStyle = this.fillLineColor;
      ctx.lineWidth = this.lineWidth;

      for(var i = 1; i < this.numFillLines; i++) {

        ctx.moveTo(
          firstPoint.x + startXDelta * i,
          firstPoint.y + startYDelta * i,
        );

        ctx.lineTo(
          fourthPoint.x + endXDelta * i,
          fourthPoint.y + endYDelta * i,
        );
      }

      ctx.stroke();
      ctx.closePath();
    }

    drawOutLines(type){
      ctx.lineWidth = this.outlineWidth;
      ctx.strokeStyle = this.fillColor;
      ctx.lineCap = "round";
      ctx.strokeStyle = this.outlineColor;

      if(type === "dark") {
        ctx.strokeStyle = "rgba(0,0,0,.1)";
        ctx.lineWidth = 1;
      }

      if(type === "same") {
        ctx.strokeStyle = this.fillColor;
        ctx.lineWidth = 1;
      }


      if(type === "hovered") {
        ctx.strokeStyle = "rgba(0,0,0,.4)";
        ctx.lineWidth = 2;
      }

      if(type === "selected") {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
      }

      for(var i = 0; i < this.points.length; i++){
        ctx.beginPath();
        let thisP = this.points[i];
        thisP.clone = false;
        ctx.moveTo(thisP.x, thisP.y);
        let nextP = this.points[i + 1];
        let start, end, dist;
        dist = 0;
        
        if(!nextP) {
          nextP = this.points[0];
        }

        start = {x: thisP.x, y: thisP.y};
        end = {x: nextP.x, y: nextP.y};

        ctx.lineTo(nextP.x, nextP.y);

        dist = distToSegment({x : mouse.x, y : mouse.y}, start, end);

        if(dist <= lineHoverDistance) {
          hoverSegments.push(
            {
              start : { x : start.x, y: start.y },
              end : { x : end.x, y: end.y },
              distance : dist
            }
          )
        }

        ctx.stroke();
        ctx.closePath();
      }
    }
}
