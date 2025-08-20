const socket = io();
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let drawing = false;
let startX, startY;
let color = document.getElementById("colorPicker").value;
let shape = document.getElementById("shape").value;

document.getElementById("colorPicker").onchange = e => color = e.target.value;
document.getElementById("shape").onchange = e => shape = e.target.value;

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  if (!drawing) return;
  drawing = false;
  let endX = e.offsetX;
  let endY = e.offsetY;

  let data = { shape, color, startX, startY, endX, endY };
  drawShape(data);
  socket.emit("draw", data);
});

function drawShape({ shape, color, startX, startY, endX, endY }) {
  ctx.strokeStyle = color;
  ctx.beginPath();

  if (shape === "line") {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  } else if (shape === "rect") {
    ctx.rect(startX, startY, endX - startX, endY - startY);
  } else if (shape === "circle") {
    let radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  } else {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }

  ctx.stroke();
}

// Listen for other users' drawings
socket.on("draw", (data) => {
  drawShape(data);
});

// Save board as image
document.getElementById("saveBtn").addEventListener("click", () => {
  let url = canvas.toDataURL("image/png");
  let link = document.createElement("a");
  link.href = url;
  link.download = "board.png";
  link.click();
});
