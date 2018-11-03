// Save & load a picture from localstorage

const saveButton = document.querySelector(".save")
    , loadButton = document.querySelector(".load")
    , resetButton = document.querySelector(".reset")
    , wobbleButton = document.querySelector(".wobble");

const resetPicture = () => {
    let size = 85;
    let startX = Math.floor(canvasWidth / 2 - size / 2);
    let startY = Math.floor(canvasHeight / 2 - size / 2 - 20);

    clearExistingPicture();

    newPoints = [
        {x : startX, y : startY},
        {x : startX + size, y : startY},
        {x : startX + size, y : startY + size},
        {x : startX, y : startY + size}
    ];

    points = newPoints.map(p => createPoint(p));

    let newGrid = new Grid(points);
    newGrid.fillColor = selectedColor;
  
    grids.push(newGrid);
}

const clearExistingPicture = () => {
  points = customFilter(points, (() => true));
  grids = customFilter(grids, (() => true));
}

const createPoint = p => {

  let group = document.createElementNS("http://www.w3.org/2000/svg","svg");
  group.setAttribute("x", p.x);
  group.setAttribute("y", p.y);

  let circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
  circle.setAttribute("cx", 0);
  circle.classList.add("bigcircle");
  circle.setAttribute("cy", 0);
  circle.setAttribute("r", 14);
  circle.setAttribute("stroke", "rgba(0,0,0,1");
  circle.setAttribute("stroke-width", 2);
  circle.setAttribute("fill", "transparent");

  let smallCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
  smallCircle.classList.add("smallcircle");
  smallCircle.setAttribute("cx", 0);
  smallCircle.setAttribute("cy", 0);
  smallCircle.setAttribute("r", 3);
  smallCircle.setAttribute("fill", "#000000");

  group.append(circle);
  group.append(smallCircle);

  svgPoints.appendChild(group);

  return {
      x : p.x,
      y : p.y,
      svgEl : group
  }
}

const loadPicture = () => {
   let picture = window.localStorage.getItem("picture");

    clearExistingPicture();

    if(picture) {
        let pictureData = JSON.parse(picture);
        let savedGrids = pictureData.grids;
        
        grids = [];
        points = pictureData.points.map(p => {
            return createPoint(p);
        });

        savedGrids.map(grid => {
            let newArray = [];

            grid.points = grid.points.map(p => {
                for(var i = 0; i < points.length; i++) {
                    let existingPoint = points[i];
                    if(comparePoints(p,existingPoint)) {
                        return existingPoint;
                    }
                }
            });
            let newGrid = new Grid(grid.points, "top")
            newGrid.fillColor = grid.fillColor;
            grids.push(newGrid);

        });
        return true;
    } else {
        return false;
    }
}

saveButton.addEventListener("click", () => {

    let savedGrids = grids.map(grid => {
        return {
          points : grid.points,
          fillColor : grid.fillColor
        }
    });

    window.localStorage.setItem("picture", JSON.stringify({
        grids : savedGrids,
        points : points
    }));
});

loadButton.addEventListener("click", () => {
    loadPicture();
});

wobbleButton.addEventListener("mousedown", () => {
    wobble = true;
});

wobbleButton.addEventListener("mouseup", () => {
    wobble = false;
});

resetButton.addEventListener("click", () => {
    resetPicture();
});

