let availableColors = [
  "#8F3D61",
  "#B94B5D",
  "#DD7E5F",
  "#EB9762",
  "#EDBD77",
  "#DDDDDD"
];

// availableColors = [
// "#D3C663",
// "#AEB160",
// "#97904A",
// "#5AA99D",
// "#38797A",
// "#0C5878",
// "#BBBBBB"
// ]

let colorWrapper = dQ(".colors");
let selectedColor = availableColors[0];
let selectedColorIndex = 0;

let index = 0;
availableColors.map(color => {
  let colorEl = document.createElement("div");
  colorEl.classList.add("color-wrapper");

  let swatchEl = document.createElement("div");
  swatchEl.classList.add("swatch");
  swatchEl.style.background = color;
  swatchEl.setAttribute("color", color);
  swatchEl.setAttribute("index", index);

  let colorPickerWrapper = document.createElement("div");
  colorPickerWrapper.classList.add("colorpicker-wrapper");

  let colorPicker = document.createElement("input");
  colorPicker.setAttribute("type", "color");
  colorPicker.setAttribute("index", index);
  colorPicker.value = color;
  
  colorPickerWrapper.append(colorPicker);

  colorEl.append(colorPickerWrapper);
  colorEl.append(swatchEl);

  colorWrapper.appendChild(colorEl);

  swatchEl.addEventListener("click", function(el){
    selectColor(el.target.getAttribute("index"));
  });

  colorPicker.addEventListener("change",function(e){
    let index = parseInt(e.target.getAttribute("index"));
    changeColor(index, e.target.value);
  });
  index++;

});

const changeColor = (index, value) => {
  availableColors[index] = value;
  frameLoop();
  updateColors();
}

const updateColors = () => {
  let swatches = document.querySelectorAll(".swatch");
  let index = 0;

  swatches.forEach(el => {
    el.setAttribute("color", availableColors[index]);
    el.style.background = availableColors[index];
    index++;
  });
}

const selectColor = colorIndex => {
  selectedColorIndex = parseInt(colorIndex);

  if(grids) {
    grids = grids.map(grid => {
      if(grid.selected) {
        grid.fillColorIncex = colorIndex;
      }
      return grid;
    });
  }

  document.querySelectorAll(".colors .swatch").forEach(el => {
    el.classList.remove("selected");
    if(selectedColorIndex === parseInt(el.getAttribute("index"))) {
      el.classList.add("selected");
    }
  });

  if(typeof frameLoop !== "undefined") {
    frameLoop();
  }
}

selectColor(selectedColorIndex);