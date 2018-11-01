dQ(".plus").addEventListener("click",  () => scalePoints(.05));
dQ(".minus").addEventListener("click", () => scalePoints(-.05));

dQ(".rotate[type='left'").addEventListener("click", () => rotatePoints(10));
dQ(".rotate[type='right'").addEventListener("click", () => rotatePoints(-10));

const setExtrudeMode = (mode) => {
  settings.extrudeMode = mode;
  dQ(".extrude[type='point']").classList.remove("selected");
  dQ(".extrude[type='line']").classList.remove("selected");
  dQ(".extrude[type='"+mode+"']").classList.add("selected");
}

setExtrudeMode("line");

document.querySelectorAll(".extrude").forEach((el) => {
  el.addEventListener("click", (e) => setExtrudeMode(e.target.getAttribute("type")));
});


document.querySelector(".download").addEventListener("click", () => {
  downloadSvg();
});


function downloadSvg() {
  var svgData = dQ(".svg-image").outerHTML;
  var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "polypal.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
