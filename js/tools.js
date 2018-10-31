let tools = ["selector", "paintbrush"];
let selectedTool;
tools = tools.map(tool => {
  return {
    name : tool,
    selected : false
  }
});

let toolbarEl = dQ(".tools")

tools.map(tool => {
  let toolEl = document.createElement("button");
  toolEl.classList.add("tool");
  toolEl.style.background = tool.name;
  toolEl.setAttribute("name", tool.name);
  toolEl.innerText = tool.name;
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
    }
  });
}

selectTool(tools[0].name);