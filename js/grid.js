class Grid {

    constructor(x, y, size, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction || "top";
        this.size = size;
        this.controlPointSize = 12;
        this.points = [];
        this.lineSegmentDensity = .05;
        this.init();
        
        this.controlPointColor = "#DDD";
        this.lineWidth = 1;
        this.gridWidth = 1;
        this.lineColor = "#AAA";
        this.outlineWidth = 1;
        this.outlineColor = "#777";
    }

    init(){

        this.points = [
            points[this.x][this.y],
            points[this.x + 1][this.y],
            points[this.x + 1][this.y + 1],
            points[this.x][this.y + 1]
        ]

        this.points[0].x = this.x * this.size;
        this.points[0].y = this.y * this.size;

        this.points[1].x = (this.x * this.size) + this.size;
        this.points[1].y = this.size * this.y;

        this.points[2].x = (this.x * this.size) + this.size;
        this.points[2].y = (this.y * this.size) + this.size;

        this.points[3].x = this.x * this.size;
        this.points[3].y = (this.y * this.size) + this.size;

        this.points = this.points.map(p => {
            p.active = true;
            return p;
        });
    }



    mouseReleased(){
        this.points = this.points.map(p => {
            p.selected = false;
            return p;
        });
    }

    draw() {
        this.drawOutLines();
        this.drawFillLines();
    }

    drawFillLines() {

        
        let startXDelta, endXDelta, startYDelta, endYDelta, numLines;

        if(this.direction == "top") {


          numLines = 20;

          // let total = Math.abs(this.points[1].x - this.points[0].x) + Math.abs(this.points[2].x - this.points[3].x);
          // numLines = total / 10;

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

        } else if (this.direction == "side") {

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
            ctx.moveTo(thisP.x, thisP.y);
            let nextP = this.points[i + 1];
            if(nextP) {
                ctx.lineTo(nextP.x, nextP.y);
            } else {
                ctx.lineTo(this.points[0].x,this.points[0].y);
            }
            ctx.stroke();
            ctx.closePath();

        }

    }
}
