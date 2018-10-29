// Save & load a picture from localstorage

const saveButton = document.querySelector(".save")
    , loadButton = document.querySelector(".load")
    , resetButton = document.querySelector(".reset")
    , wobbleButton = document.querySelector(".wobble");

const resetPicture = () => {
    let size = 85;
    let startX = Math.floor(canvasWidth / 2 - size / 2);
    let startY = Math.floor(canvasHeight / 2 - size / 2 - 20);

    points = [{x : startX, y : startY},
      {x : startX + size, y : startY},
      {x : startX + size, y : startY + size},
      {x : startX, y : startY + size}
    ];

    grids = [];
    let newGrid = new Grid(points);
    newGrid.fillColor = selectedColor;
    grids.push(newGrid);
}

const loadPicture = () => {
   let picture = window.localStorage.getItem("picture");

    if(picture) {
        let pictureData = JSON.parse(picture);
        let savedGrids = pictureData.grids;
        
        grids = [];
        points = pictureData.points;

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

