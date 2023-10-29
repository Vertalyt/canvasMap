import { fetchAPIData } from "../api/api";
import { mobsTypesColors } from './contrastColor'
import { colors } from './generickRandomColor'
import { categoryMap, diameterCircle } from '@/config'


let circles = [];



export function drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx }) {
  circles.forEach((circle) => {
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
      const centerX = circleXOnMap + circleDiameter / 2;
      const centerY = circleYOnMap + circleDiameter / 2;
      
      if (
        circle.color &&
        circle.color.length > 1
      ) {

        const radius = circleDiameter / 2;
        const numSegments = circle.color.length;

        for (let i = 0; i < numSegments; i++) {
          ctx.beginPath();
          const startAngle = (2 * Math.PI * i) / numSegments;
          const endAngle = (2 * Math.PI * (i + 1)) / numSegments;
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();

          // Используйте цвет из массива circle.color
          ctx.fillStyle = circle.color[i];
          ctx.fill();
        }
      } else {
        ctx.arc(
          circleXOnMap + circleDiameter / 2,
          circleYOnMap + circleDiameter / 2,
          circleDiameter / 2,
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



// Начальное смещение перед отрисовкой
const startOffsetX = 5;
const startOffsetY = 16;
export const circleDiameter = diameterCircle;

export async function generateCircles({
  oldcircles,
  mapImage,
}) {
  const rezult = await fetchAPIData(filtersClasses);

  circles.length = 0
  circles = oldcircles;



  const numCirclesX = Math.ceil(mapImage.width / circleDiameter) - (Math.ceil(mapImage.width / circleDiameter)/ circleDiameter) - 1;
  const numCirclesY = Math.ceil(mapImage.height / circleDiameter);
  let uniqueId = 1; // Начальное значение уникального идентификатора
  for (let i = 0; i < numCirclesX; i++) {
    for (let j = 0; j < numCirclesY; j++) {
      const circleX = i * (circleDiameter + 1) + startOffsetX;
      const circleY = j * (circleDiameter + 1) + startOffsetY;
      const matchingCircle = rezult.find(
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


function abiss(ctx, centerX, centerY, circleDiameter) {
  const circleRadius = (circleDiameter / 2) * 1.2; // Увеличенный радиус на 20%
  ctx.fillStyle = "#d6dbaadb"; // Цвет фона
  ctx.arc(centerX, centerY, circleRadius * 0.8, 0, Math.PI * 2);
  ctx.fill();
  // Рисуем череп внутри круга
  ctx.fillStyle = "#000"; // Цвет чернил
  ctx.font = "14px sans-serif";
  const text = "☠";
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, centerX - textWidth / 2, centerY + 5); // Центрируем текст

  // Глазницы черепа
  ctx.beginPath();
  ctx.arc(centerX - 4 * 1.2, centerY - 2 * 1.2, 2 * 1.2, 0, Math.PI * 2); // Левая глазница
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX + 4 * 1.2, centerY - 2 * 1.2, 2 * 1.2, 0, Math.PI * 2); // Правая глазница
  ctx.fill();

  // Рот черепа
  ctx.beginPath();
  ctx.arc(centerX, centerY + 4 * 1.2, 3 * 1.2, 0, Math.PI); // Рот
  ctx.stroke();
}


export function drawOrange(ctx, centerX, centerY, circleDiameter, index) {
  const circleRadius = circleDiameter / 2;
  const segmentCount = 10; // Количество сегментов апельсина
  const segmentAngle = (Math.PI * 2) / segmentCount;

  // Рисуем бордер круга
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#000"; // Цвет бордера
  ctx.lineWidth = 3; // Толщина линии
  ctx.stroke();

  // Рисуем цветные сегменты апельсина
  for (let i = 0; i < segmentCount; i++) {
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    
    // Выберите цвет для сегмента
    const segmentColor = i % 2 === 0 ? colors[index] : colors[index + 1]; // Поменяйте цвета по своему усмотрению

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, circleRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segmentColor;
    ctx.fill();
  }
}








