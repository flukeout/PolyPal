let dragZoneFillStyle = "rgba(255,0,0,.15)";
let hoverStrokeStyle = "rgba(255,0,0,.5)";
let hoverRadius = 16;   // Size of vertex selection radius
let mergeDistance = 16; // Distance before we auto merge points
let lineHoverDistance = 12;

let settings = {
  extrudeMode : "line"
};



let extrudeButtons = document.querySelectorAll(".extrude");


const setExtrudeSelected = () => {
  extrudeButtons.forEach(function(el){
    let mode = el.getAttribute("type");
    if(mode == settings.extrudeMode) {
      el.classList.add("selected");
    } else {
      el.classList.remove("selected");
    }
  });
}


extrudeButtons.forEach(function(el){
  el.addEventListener("click", function(el){
    let mode = el.target.getAttribute("type");
    settings.extrudeMode = mode;
    setExtrudeSelected();
  });
});

setExtrudeSelected();