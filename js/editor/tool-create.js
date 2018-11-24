const toolCreate = {
  start : {
    x : 0,
    y : 0
  },
  activeGrid : false,
  distanceTraveled : 0,
  shapeStarted : false,
  size : 40,

  mouseDown : function(e) {
    this.start.x = e.clientX;
    this.start.y = e.clientY;

    let newPoints = this.getGridPoints();

    newPoints = newPoints.map(p => {
      let newPoint = createPoint(p);
      points.push(newPoint);
      return newPoint;
    });


    this.activeGrid = createGrid(newPoints, { fillColorIndex : selectedColorIndex});
    grids.push(this.activeGrid);
  },

  getGridPoints : function(e) {
    
    let points = [];
    for(var i = 0; i < 4; i++) {
      points.push(
        {
        x : this.start.x,
        y : this.start.y,
      });
    }
    return points;
  },

  mouseMove : function(e) {
    let current = {
      x: e.clientX,
      y: e.clientY
    }
    
    this.activeGrid.points[1].x = e.clientX;

    this.activeGrid.points[2].x = e.clientX;
    this.activeGrid.points[2].y = e.clientY;

    this.activeGrid.points[3].y = e.clientY;

    this.distanceTraveled = distPoints(this.start, current);
  },

  mouseUp : function(e) {
    if(this.distanceTraveled < 50) {
      
      let vals = [
        {
          x : -this.size,
          y : -this.size
        },{
          x : this.size,
          y : -this.size
        },{
          x : this.size,
          y : this.size
        },{
          x : -this.size,
          y : this.size
        }
      ]

      let index = 0;
      this.activeGrid.points.map(p => {
        p.x = this.start.x + vals[index].x;
        p.y = this.start.y + vals[index].y;
        index++;
        return p;
      });


    }
    this.activeGrid = false;
    selectTool("selector");
  }

}