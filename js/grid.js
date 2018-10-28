const deselectGrids = () => {
  grids = grids.map(grid => {
    grid.selected = false;
    return grid;
  });
}

class Grid {

    constructor(points  ) {

        this.points = points;
        
        this.lineWidth = 1;
        this.fillLineColor = "#AAA";
        this.numFillLines = 20;
        
        this.outlineWidth = 2;
        this.outlineColor = "#777";
        this.fillStartPoint = 0;

        this.hovered = false;
        this.selected = false;

        // this.colors = ["#8F3D61","#B94B5D", "#DD7E5F", "#EB9762", "#EDBD77"];
        // this.randomColorIndex =Math.floor(getRandom(0,this.colors.length))
        // this.selectedColor = this.colors[this.randomColorIndex];
    }

    draw() {
      this.checkShapeHover();
      this.drawFill();
      this.drawFillLines();
      this.drawOutLines();
    }

    drawFill() {
      if(this.points.length === 0) { return }

      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for(var i = 1 ; i < this.points.length; i++) {
        let p = this.points[i];
        ctx.lineTo(p.x, p.y);
      }

      ctx.fillStyle = "#ffffff";

      if(this.selected) { ctx.fillStyle = "rgba(255,0,0,.15)"; } 

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
      this.fillStartPoint++;

      this.selected = !this.selected;

      if(this.fillStartPoint >= this.points.length) {
        this.fillStartPoint = 0;
      }
    }

    drawFillLines() {

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

    drawOutLines(){
      ctx.lineWidth = this.outlineWidth;
      ctx.strokeStyle = this.outlineColor;
      ctx.lineCap = "round";

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

        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = this.lineWidth;

        if(this.outlineWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      }
    }
}
