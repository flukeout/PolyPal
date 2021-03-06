// Save & load a picture from localstorage

const saveButton = document.querySelector(".save")
    , loadButton = document.querySelector(".load")
    , resetButton = document.querySelector(".reset")
    , undoButton = dQ(".undo")
    , deleteButton = dQ(".delete");

const resetPicture = () => {
  console.log("resetPicture()");
  clearExistingPicture();
  selectTool("creator");
  frameLoop();
}

const clearExistingPicture = () => {
  points = customFilter(points, (() => true));
  grids = customFilter(grids, (() => true));
}

const undo = () => {
  console.log("undo()");

  if(pictureHistory.length > 0) {
    console.log("undo(): Undoing last change")
    clearExistingPicture();
    let lastStep = pictureHistory[pictureHistory.length - 1];
    loadPicture(JSON.parse(lastStep));
    pictureHistory.pop();
  } else {
    console.log("undo(): No undo states left");
  }
}

const pushHistory = () => {
  console.log("pushHistory()");

  let currentState = { grids : getPictureData() }
  pictureHistory.push(JSON.stringify(currentState));
  if(pictureHistory.length > 20) {
    console.log("pushHistory(): More than 20 snapshots, nuking one.");
    pictureHistory.shift();
  }
}

const getPictureData = () => {
  return grids.map(grid => {
    return {
      points : grid.points.map(p => {
        return { x: p.x, y: p.y};
      }),
      fillColorIndex : grid.fillColorIndex
    }
  });
}

const savePicture = () => {
  console.log("savePicture()");
  let savedGrids = getPictureData();
  window.localStorage.setItem("picture", JSON.stringify({
    grids : savedGrids,
    colors : availableColors
  }));
}

const loadPicture = (picture) => {
  console.log("loadPicture()");
  clearExistingPicture();

  if(picture) {
    let pictureData = picture;
    let savedGrids = pictureData.grids;


    if(pictureData.colors) {
      availableColors = pictureData.colors;
      updateColors();
    }

    grids = [];

    let newPoints = [];

    points = pictureData.grids.map(grid => {
      grid.points.map(p => {
        let thisPoint = { x : p.x, y: p.y};
        let found = false;
        for(var i = 0; i < newPoints.length; i++) {
          if(comparePoints(thisPoint, newPoints[i])) {
            found = true;
          }
        }
        if(found == false) {
          newPoints.push(thisPoint);
        }
      });
    });

    points = newPoints.map(p => {
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

      grids.push(
        createGrid(grid.points, { fillColorIndex : grid.fillColorIndex})
      );
    });

    buildColorUI();

    frameLoop();
    return true;
  } else {
    return false;
  }
}

saveButton.addEventListener("click", () => {
  savePicture();
});

loadButton.addEventListener("click", () => {
  let picture = window.localStorage.getItem("picture");
  loadPicture(JSON.parse(picture));
});

resetButton.addEventListener("click", () => {
  resetPicture();
});

undoButton.addEventListener("click", () => {
  undo();
});

deleteButton.addEventListener("click", () => {
  deleteSelected();
});

