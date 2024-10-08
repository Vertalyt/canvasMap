
import { generateCircles, drawCircles, drawMap } from '../utils/generationCircles'
import { axisOffsetX, axisOffsetY } from '@/config'

 export async function onloadMap ({ circles, ctx, mapImage, mapX, mapY, canvasWidth, canvasHeight }) {

    // Получите реальные размеры изображения
    const mapImageWidth = mapImage.width;
    const mapImageHeight = mapImage.height;
  
    // Вычислите центральные координаты для центрирования
    const centerX = mapImageWidth / 2 + axisOffsetX;
    const centerY = mapImageHeight / 2 + axisOffsetY;
    // Отрисуйте карту с начальными координатами
    drawMap({ctx, mapImage, mapX, mapY});
    // Рисуем круги

    const newCircles = await generateCircles({oldCircles:circles, mapImage});
  
    // Вычислите новые значения mapX и mapY для центрирования
    mapX = canvasWidth / 2 - centerX;
    mapY = canvasHeight / 2 - centerY;
  
  // Очистить холст и перерисовать карту и круги с новыми значениями mapX и mapY
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawMap({ctx, mapImage, mapX, mapY});
  drawCircles({mapX, mapY, canvasWidth, canvasHeight, ctx});

  return {newCircles, newMapX: mapX, newMapY:mapY}
  };