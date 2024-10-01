import { fetchAPIData } from "../api/api";
import { mobsTypesColors } from './contrastColor'
import { categoryMap, diameterCircle } from '@/config'
import { drawingAllPoints } from '@/functions'

let circles = [];

// Начальное смещение перед отрисовкой
const startOffsetX = 5;
const startOffsetY = 16;


export function drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx, circlesFilter = circles }) {
  circlesFilter.forEach((circle) => {
    const circleXOnMap = circle.x + mapX;
    const circleYOnMap = circle.y + mapY;

    // Проверяем, что круг полностью видим на холсте
    if (
      circleXOnMap >= 0 &&
      circleXOnMap <= canvasWidth &&
      circleYOnMap >= 0 &&
      circleYOnMap <= canvasHeight
    ) {
      
      ctx.beginPath();
      const centerX = circleXOnMap + diameterCircle / 2;
      const centerY = circleYOnMap + diameterCircle / 2;
      
      if (
        circle.color &&
        circle.color.length > 1
      ) {
          drawingAllPoints({circle, ctx, centerX, centerY})
      } else {
        ctx.arc(
          circleXOnMap + diameterCircle / 2,
          circleYOnMap + diameterCircle / 2,
          diameterCircle / 2,
          0,
          Math.PI * 2
        );
          // Используем цвет из newCircle.color, если он задан, иначе используем цвет по умолчанию
          ctx.fillStyle = circle.isHovered
            ? "rgba(0, 0, 250, 0.5)"
            : circle.color || "rgba(255, 255, 255, 0.05)";
          ctx.fill();

      }

      ctx.closePath();
    }
  });
return circles
}

export function mouseCoordinate(event, mapX, mapY) {
  const mouseX = event.offsetX - mapX;
  const mouseY = event.offsetY - mapY;
  return { mouseX, mouseY };
}

export function drawMap({ ctx, mapImage, mapX, mapY }) {
  ctx.drawImage(mapImage, mapX, mapY);
}


const filtersClasses = {
  category: categoryMap,
};





export async function generateCircles({
  oldCircles,
  mapImage,
}) {
  // получаю данные о точках
  const result = await fetchAPIData(filtersClasses);

  circles.length = 0
  circles = oldCircles;
  const numCirclesX = Math.ceil(mapImage.width / diameterCircle) - (Math.ceil(mapImage.width / diameterCircle)/ diameterCircle) - 1;
  const numCirclesY = Math.ceil(mapImage.height / diameterCircle);
  let uniqueId = 1; // Начальное значение уникального идентификатора
  for (let i = 0; i < numCirclesX; i++) {
    for (let j = 0; j < numCirclesY; j++) {
      const circleX = i * (diameterCircle + 1) + startOffsetX;
      const circleY = j * (diameterCircle + 1) + startOffsetY;
      const matchingCircle = result.find(
        (circle) => circle.IdCircle === uniqueId
      );

      const newCircle = {
        idCircles: uniqueId, // Уникальный идентификатор
        x: circleX,
        y: circleY,
        isHovered: false,
      };

      if (matchingCircle) {
        newCircle.type = matchingCircle.type ? matchingCircle.type : "";
        newCircle.listsMonsters = matchingCircle.listsMonsters
          ? matchingCircle.listsMonsters
          : "";

        newCircle.color = await mobsTypesColors(matchingCircle.type) || ""; // Добавьте цвет на основе типа
        
      }
        circles.push(newCircle);

      uniqueId++; // Увеличиваем уникальный идентификатор для следующей ячейки
    }
  }

  return circles;
}