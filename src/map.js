
import { generateCircles, drawCircles, drawMap } from '../utils/generickCircles'



 export async function onloadMap ({ circles, ctx, mapImage, mapX, mapY, canvasWidth, canvasHeight }) {

    // Получите реальные размеры изображения
    const mapImageWidth = mapImage.width;
    const mapImageHeight = mapImage.height;
  
    // Вычислите центральные координаты для центрирования
    const centerX = mapImageWidth / 2 - 50;
    const centerY = mapImageHeight / 2 + 50;
    // Отрисуйте карту с начальными координатами
    drawMap({ctx, mapImage, mapX, mapY});
    // Рисуем круги
    circles = await generateCircles({oldcircles:circles, mapImage, mapX, mapY, canvasWidth, canvasHeight, ctx});
  
  
    // Вычислите новые значения mapX и mapY для центрирования
    mapX = canvasWidth / 2 - centerX;
    mapY = canvasHeight / 2 - centerY;
  
  // Очистить холст и перерисовать карту и круги с новыми значениями mapX и mapY
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawMap({ctx, mapImage, mapX, mapY});
  drawCircles({mapX, mapY, canvasWidth, canvasHeight, ctx});

  return {newCircles:circles, newMapX: mapX, newMapY:mapY}
  };