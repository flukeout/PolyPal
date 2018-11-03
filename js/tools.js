let tools = [{
    name : "selector",
    description: "Select things"
  },{
    name : "paintbrush",
    description: "Fill things with color"
  },{
    name : "move",
    description: "Move the canvas"
  }];

let selectedTool;

tools = tools.map(tool => {
  tool.selected = false;
  return tool;
});

let toolbarEl = dQ(".tools")

tools.map(tool => {
  let toolEl = document.createElement("button");
  toolEl.classList.add("tool");
  toolEl.classList.add(tool.name);
  toolEl.style.background = tool.name;
  toolEl.setAttribute("name", tool.name);
  toolbarEl.appendChild(toolEl);
  toolEl.addEventListener("click", function(el){
    selectTool(el.target.getAttribute("name"));
  });
});

const selectTool = toolName => {
  document.querySelectorAll(".tools button").forEach(el => {
    el.classList.remove("selected");
    if(toolName === el.getAttribute("name")) {
      el.classList.add("selected");
      selectedTool = toolName;
      svgScene.setAttribute("tool", toolName);
    }
  });
}

selectTool("selector");