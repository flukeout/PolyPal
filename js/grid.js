class Grid {

    constructor(points, direction) {
        this.direction = direction || "top";
        this.controlPointSize = 12;
        this.points = [];
        this.lineSegmentDensity = .05;
        this.points = points;
        this.controlPointColor = "#DDD";
        this.lineWidth = 1;
        this.gridWidth = 1;
        this.lineColor = "#AAA";
        this.outlineWidth = 1;
        this.outlineColor = "#000";
        this.fillStartEdge = 0;
        this.hovered = false;
    }

    draw() {
        this.checkHover();
        this.drawFill();
        this.drawFillLines();
        this.drawOutLines();
    }

    drawFill() {
      if(!this.hovered) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for(var i = 1 ; i < this.points.length; i++) {
        let p = this.points[i];
        ctx.lineTo(p.x, p.y);
      }
      ctx.fillStyle = "rgba(255,0,0,.15)";
      ctx.fill();
      ctx.closePath();
    }

    checkHover() {
      let polygon = [];
      for(var i = 0; i < this.points.length; i++) {
        let p = this.points[i];
        polygon.push([p.x,p.y]);
      }

      this.hovered =testWithin([mouse.x, mouse.y], polygon);
    }

    drawFillLines() {

        if(this.points.length != 4) {
          return;
        }

        let startXDelta, endXDelta, startYDelta, endYDelta, numLines;

        if(this.direction == "top") {

          numLines = 20;


          startXDelta = (this.points[1].x - this.points[0].x) / numLines;
          startYDelta = (this.points[1].y - this.points[0].y) / numLines;

          endXDelta = (this.points[2].x - this.points[3].x) / numLines;
          endYDelta = (this.points[2].y - this.points[3].y) / numLines;

        } else if (this.direction == "right") {

          numLines = 20;
          // Right
          startXDelta = (this.points[3].x - this.points[0].x) / numLines;
          startYDelta = (this.points[3].y - this.points[0].y) / numLines;

          endXDelta = (this.points[1].x - this.points[2].x) / numLines;
          endYDelta = (this.points[1].y - this.points[2].y) / numLines;

        } 

        ctx.beginPath();
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;

        for(var i = 1; i < numLines; i++) {

            ctx.moveTo(
              this.points[0].x + startXDelta * i,
              this.points[0].y + startYDelta * i,
            );

            if(this.direction == "top") {
            ctx.lineTo(
              this.points[3].x + endXDelta * i,
              this.points[3].y + endYDelta * i,
            );

          } else {
            ctx.lineTo(
              this.points[1].x- endXDelta * i,
              this.points[1].y - endYDelta * i,
            );
          }


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

            if(dist < 15) {
                ctx.strokeStyle = "rgba(255,0,0,1)";
                ctx.lineWidth = 5;
                
                // cloners.push(thisP);
                // cloners.push(nextP)
            } else {
                ctx.strokeStyle = this.outlineColor;
                ctx.lineWidth = this.lineWidth;
            }

            ctx.stroke();
            ctx.closePath();
        }
    }
}
