import { widthPicture, heightPicture} from '@/config'


// canvas.js
export function initCanvas(canvas) {
    const clientWidth = Math.min(Number(document.documentElement.clientWidth), widthPicture);
    canvas.width = Math.floor(clientWidth * 0.95);

    const clientHeight = Math.min(Number(document.documentElement.clientHeight), heightPicture);
    canvas.height = Math.floor(clientHeight * 0.95);
  }
  