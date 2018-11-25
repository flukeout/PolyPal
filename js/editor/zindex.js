// Increases or decreases the z-index of shapes

const zUpButton = dQ(".z-up")
    , zDownButton = dQ(".z-down");

zUpButton.addEventListener("click", () => {
  changeZindex("up");
});

zDownButton.addEventListener("click", () => {
  changeZindex("down");
});

const changeZindex = (direction) => {
  let selectedGrids = grids.filter(grid => grid.selected);

  if(selectedGrids.length > 0) {

    if(mouse.shiftPressed == true ) {

      selectedGrids.map(g => {
        let thisEl = g.svgEl;

        let nextElement = direction == "down" ? dQ(".svg-image polygon:first-child") : dQ(".svg-image polygon:last-child");
        let type = direction == "down" ? "beforebegin" : "afterend";

        if(nextElement) {
          pushHistory();
          let nextGrid = findGridByElement(nextElement);
          nextElement.insertAdjacentElement(type, thisEl);
        }
      });

    } else {

      selectedGrids.map(g => {
        let thisEl = g.svgEl;
        console.log(g.zIndex);
        let nextZindex = direction == "up" ? g.zIndex + 1 : g.zIndex - 1;
        console.log(nextZindex);
        let nextElement = dQ(".svg-image polygon:nth-child("+ nextZindex+")");

        if(nextElement) {
          pushHistory();
          let nextGrid = findGridByElement(nextElement);
          let type = direction == "up" ? "afterend" : "beforebegin";
          nextElement.insertAdjacentElement(type, thisEl);
        }
      });
    }
  }

  let zIndex = 1;
  document.querySelectorAll(".svg-image polygon").forEach(el => {
    let thisGrid = findGridByElement(el);
    thisGrid.zIndex = zIndex;
    zIndex++;
  });

  // Sort the grids array by zIndex so when we save the pictur the order persists
  grids = grids.sort((a,b) => {
    if (a.zIndex > b.zIndex) {
      return 1;
    } else {
      return -1;
    }
  });
}

const findGridByElement = svgEl => {
  return grids.find(g => {
    return g.svgEl == svgEl;
  });
}
