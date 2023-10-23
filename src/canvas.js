// canvas.js
export function initCanvas(canvas) {
    const clientWidth = Math.min(document.documentElement.clientWidth, 2600);
    canvas.width = Math.floor(clientWidth * 0.95);
  
    const clientHeight = Math.min(document.documentElement.clientHeight, 1360);
    canvas.height = Math.floor(clientHeight * 0.95);
  }
  