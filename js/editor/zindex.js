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
    selectedGrids.map(g => {
      let thisEl = g.svgEl;
      let nextZindex = direction == "up" ? g.zIndex + 1 : g.zIndex - 1;
      let nextElement = dQ(".svg-image polygon:nth-child("+ nextZindex+")");

      if(nextElement) {
        let nextGrid = findGridByElement(nextElement);
        let type = direction == "up" ? "afterend" : "beforebegin";
        nextElement.insertAdjacentElement(type, thisEl);

        if(direction == "up") {
          nextGrid.zIndex--;
          g.zIndex++;
        } else {
          nextGrid.zIndex++;
          g.zIndex--;
        }
      }
    });
  }

  // Sort grids by their zIndex so when we save the picture
  // the order persists
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
