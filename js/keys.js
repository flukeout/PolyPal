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
  83 : "selector",
  66 : "paintbrush",
  77 : "move",
}

const getKey = keyCode => {
  // console.log(keyCode);
  return keyMap[keyCode];
}

window.addEventListener("keydown", e => {

  let key = getKey(e.keyCode);

  if(key == "selector" || key == "paintbrush" || key == "move") {
    selectTool(key);
  }

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

  frameLoop();
});


window.addEventListener("keyup", e => {
  frameLoop();
});

