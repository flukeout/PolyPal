let availableColors = ["#8F3D61","#B94B5D", "#DD7E5F", "#EB9762", "#EDBD77", "#DDDDDD"];

// availableColors = [
// "#fdfdf8",
// "#d32734",
// "#da7d22",
// "#e6da29",
// "#28c641",
// "#2d93dd",
// "#7b53ad",
// "#1b1c33",
// ]

// availableColors = [
// "#1a1c2c",
// "#572956",
// "#b14156",
// "#ee7b58",
// "#ffd079",
// "#a0f072",
// "#38b86e",
// "#276e7b",
// "#29366f",
// "#405bd0",
// "#4fa4f7",
// "#86ecf8",
// "#f4f4f4",
// "#93b6c1",
// "#557185",
// "#324056",
// ]
// "grid"

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

availableColors.map(color => {
  let colorEl = document.createElement("div");
  colorEl.classList.add("swatch");
  colorEl.style.background = color;
  colorEl.setAttribute("color", color);
  colorWrapper.appendChild(colorEl);
  colorEl.addEventListener("click", function(el){
    selectColor(el.target.getAttribute("color"));
  });
});

const selectColor = color => {
  selectedColor = color;
  
  if(grids) {
    grids = grids.map(grid => {
      if(grid.selected) {
        grid.fillColor = color;
      }
      return grid;
    });
  }


  document.querySelectorAll(".colors .swatch").forEach(el => {
    el.classList.remove("selected");
    if(selectedColor === el.getAttribute("color")) {
      el.classList.add("selected");
    }
  });
}

selectColor(selectedColor);