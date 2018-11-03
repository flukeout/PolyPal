// Element references
const bodyEl = document.querySelector("body")
    , svgScene = document.querySelector(".svg-canvas")
    , svgImage = document.querySelector(".svg-image")
    , svgPoints = document.querySelector(".svg-points");

let points = [];
let grids = [];
let selectedGrids = [];

let mouse = {
  x : 0,
  y: 0,

  pressed : false,
  dragging : false,

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
