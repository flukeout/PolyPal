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


const buildColorUI = () => {
  let index = 0;

  colorWrapper.innerHTML = "";

  availableColors.map(color => {

    let html = `
      <div class="delete color-ui" title="Delete this color"></div>
      <div class="add color-ui" title="Clone this color"></div>
      <div class="colorpicker-wrapper color-ui" title="Change this color" index="${index}">
        <input class="colorpicker" type="color" value="${color}" index="${index}"/>
      </div>
      <div
        class="swatch"
        color="${color}"
        index="${index}"
        style="background: ${color}"
      >
      </div>
    `;

    let colorEl = document.createElement("div");
    colorEl.classList.add("color-wrapper");
    if(index === selectedColorIndex) {
      colorEl.classList.add("selected");
    }
    colorEl.innerHTML = html;
    colorEl.setAttribute("index", index);

    // Set up clickable swatch
    let swatchEl = colorEl.querySelector(".swatch");
    swatchEl.addEventListener("click", function(el){
      selectColor(el.target.getAttribute("index"));
    });

    colorEl.querySelector(".colorpicker-wrapper").addEventListener("mouseover", function(el){
      let index = el.target.getAttribute("index");
      highlightGridsByIndex(index);
    });

    colorEl.querySelector(".colorpicker-wrapper").addEventListener("mouseout", function(el){
      clearGridHighlight();
    });


    let deleteEl = colorEl.querySelector(".delete");
    deleteEl.addEventListener("click", function(el){
      let parent = el.target.closest(".color-wrapper");
      let index = parseInt(parent.getAttribute("index"));
      deleteColor(index);
    });

    let addEl = colorEl.querySelector(".add");
    addEl.addEventListener("click", function(el){
      let parent = el.target.closest(".color-wrapper");
      let index = parseInt(parent.getAttribute("index"));
      addColor(index);
    });


    // Set up colorpicker input
    let colorPicker = colorEl.querySelector("input");
    colorPicker.addEventListener("change",function(e){
      let index = parseInt(e.target.getAttribute("index"));
      changeColor(index, e.target.value);
    });

    colorWrapper.appendChild(colorEl);
    index++;
  });

}

const addColor = index => {
  currentColor = availableColors[index];
  availableColors.splice(index, 0, currentColor);

  grids = grids.map(grid => {

    if(grid.fillColorIndex > index) {
      grid.fillColorIndex++;
    }

    return grid;
   })

   buildColorUI();
   frameLoop();
}

const deleteColor = index => {
   availableColors.splice(index, 1);
   console.log(availableColors);
   
   grids = grids.map(grid => {

    if(grid.fillColorIndex == index) {
      grid.fillColorIndex = false;
    }

    if(grid.fillColorIndex >= index) {
      grid.fillColorIndex--;
    }
    return grid;
   })

   buildColorUI();
   frameLoop();
}

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
        grid.fillColorIndex = colorIndex;
      }
      return grid;
    });
  }

  document.querySelectorAll(".colors .color-wrapper").forEach(el => {
    el.classList.remove("selected");
    if(selectedColorIndex === parseInt(el.getAttribute("index"))) {
      el.classList.add("selected");
    }
  });

  if(typeof frameLoop !== "undefined") {
    frameLoop();
  }
}

buildColorUI();

selectColor(selectedColorIndex);

const highlightGridsByIndex = colorIndex => {
  grids.map(g => {
    if(g.fillColorIndex == colorIndex) {
      g.svgEl.classList.add("pulse");
    }
  });
}

const clearGridHighlight = () => {
  grids.map(g => {
    g.svgEl.classList.remove("pulse");
  })
}
