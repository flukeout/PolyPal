const drawVertex = (p) => {

  // Hover or selected highlight
  if((p.hovered && !p.selected )|| p.stickyHovered) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, hoverRadius, Math.PI * 2,0);
    ctx.fillStyle = "rgba(255,0,0,.1)";
    ctx.fill();
    ctx.closePath();
  } else if (p.selected) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, hoverRadius, Math.PI * 2,0);
    ctx.fillStyle = "rgba(255,0,0,.2)";
    ctx.fill();
    ctx.closePath();
  }

  // Vertex point
  let vertexSize = 4;
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,0,0,.5)";
  ctx.fillRect(p.x - vertexSize/2, p.y - vertexSize/2, vertexSize, vertexSize);
  ctx.closePath();
}

const clearCanvas = () => {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
