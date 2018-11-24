// Element references
const bodyEl = document.querySelector("body")
    , svgScene = document.querySelector(".svg-canvas")
    , svgImage = document.querySelector(".svg-image")
    , svgPoints = document.querySelector(".svg-points");

let points = [];
let grids = [];
let selectedGrids = [];
let pictureHistory = [];

let snapshotTaken;

let mouse = {
  x : 0,
  y: 0,

  pressed : false,

  // For keeping track of clicks anywhere
  // like when you are using the scale slider, so points dont merge
  pressedAnywhere : false,

  dragging : false,
  shiftPressed : false,

  dragZone : {
    start : {
      x : 0,
      y : 0,
    },
    end : {
      x : 0,
      y : 0
    }
  }
}
