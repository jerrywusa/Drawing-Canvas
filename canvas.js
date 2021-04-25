let backgroundCanvasColor = window
  .getComputedStyle(canvas, null)
  .getPropertyValue("background-color");
let lineWidth = 10;
let drawColor = "white";

function setColorToBackgroundCanvasColor(id) {
  lineWidth = 80;
  drawColor = backgroundCanvasColor;
  let elem = document.getElementById(id);
  makeClickedElementLarge(elem);
}

function changeColor(id) {
  lineWidth = 10;
  let elem = document.getElementById(id);
  drawColor = window
    .getComputedStyle(elem, null)
    .getPropertyValue("background-color");
    makeClickedElementLarge(elem);
}

function makeClickedElementLarge(clickedToolIcon) {
  let toolIcons = document.querySelectorAll(".tool-icons");
  for (let i = 0; i < toolIcons.length; i++) {
    toolIcons[i].style.transform = "";
  }
  clickedToolIcon.style.transform = "scale(1.5)";
}

let restore_array;
let context;
function clearScreen() {
  if (restore_array.length <= 1) {
    return;
  }
  restore_array.push(restore_array[0]);
  context.putImageData(restore_array[restore_array.length - 1], 0, 0);
}

function undo(event) {
  if (event.metaKey && event.key === "z") {
    if (restore_array.length <= 1) {
      return;
    }
    restore_array.pop();
    context.putImageData(restore_array[restore_array.length - 1], 0, 0);
  }
}

function undoOnClick() {
  if (restore_array.length <= 1) {
    return;
  }
  restore_array.pop();
  context.putImageData(restore_array[restore_array.length - 1], 0, 0);
}

window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  context = canvas.getContext("2d");
  restore_array = [];

  // // set initial load size
  canvas.height = window.innerHeight - 100;
  canvas.width = window.innerWidth;

  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));

  // variables
  let isDrawing = false;

  // functions
  function startPosition(event) {
    isDrawing = true;
    draw(event);
  }

  function finishedPosition(event) {
    isDrawing = false;
    context.beginPath();
    if (event.type != "mouseout") {
      restore_array.push(
        context.getImageData(0, 0, canvas.width, canvas.height)
      );
    }
  }

  function draw(event) {
    if (!isDrawing) {
      return;
    }
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.strokeStyle = drawColor;
    context.lineTo(event.clientX, event.clientY);
    context.stroke();
    context.beginPath();
    context.moveTo(event.clientX, event.clientY);
  }

  //EventListeners
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
  document.addEventListener("keydown", undo);


  // have scrolling change lineWidth
  // document.addEventListener("wheel", function(event) {
  //   lineWidth += 5;
  // });
});
