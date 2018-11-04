const keyMap = {
  37 : "left",
  38 : "up",
  39 : "right",
  40 : "down",
  16 : "shift",
  68 : "delete",
  8  : "delete",
  187 : "plus",
  189 : "minus",
}

const getKey = keyCode => {
  return keyMap[keyCode];
}

window.addEventListener("keydown", e => {

  let key = getKey(e.keyCode);

  if(key == "delete") {
    points = customFilter(points, (p => p.selected));
    deleteSelectedGrids();
  }

  if(key == "plus") {
    scalePoints(.05);
  }

  if(key == "minus") {
    scalePoints(-.05);
  }
});