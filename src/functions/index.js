import { diameterCircle } from '@/config'

function drawCustomShape(ctx, centerX, centerY, radius, outerColor, starColor) {
    // Нарисовать внешний круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); // Внешний круг
    ctx.fillStyle = outerColor; // Цвет внешнего круга
    ctx.fill();
    ctx.closePath();
  
    // Нарисовать звезду
    const starRadius = radius * 0.9; // Радиус звезды (меньше, чем радиус круга)
    const spikes = 5; // Количество концов у звезды
    const step = Math.PI / spikes;
  
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - starRadius); // Начальная точка звезды (верхний конец)
  
    for (let i = 0; i < spikes * 2; i++) {
      const angle = i * step;
      const r = i % 2 === 0 ? starRadius : starRadius / 2; // Чередование длины лучей
      const x = centerX + r * Math.sin(angle);
      const y = centerY - r * Math.cos(angle);
      ctx.lineTo(x, y);
    }
  
    ctx.closePath();
    ctx.fillStyle = starColor; // Цвет звезды
    ctx.fill();
  }

export function drawingAllPoints({circle, ctx, centerX, centerY}) {
    const radius = diameterCircle / 2;
    const numSegments = circle.color.length;
  
    if (numSegments === 6) {
      drawCustomShape(ctx, centerX, centerY, radius, circle.color[0], circle.color[1]);
    } else {
      // Обычная отрисовка сегментов
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
    }
  }
  

 // Функция для сброса цветов к исходным
export function restoreColors(timerId, foundCircles, originalColors) {
  clearInterval(timerId); // Очистите интервал

  foundCircles.forEach((circle, i) => {
    if (originalColors[i]) {
      circle.color = originalColors[i];
    }
  });
  originalColors.length = 0;
}