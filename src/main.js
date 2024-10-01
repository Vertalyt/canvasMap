import { mapImageSrc, startX, startY, diameterCircle, heightPicture } from '@/config'
import "../style/style.css";

import { initCanvas } from "../src/canvas";
import { onloadMap } from "../src/map";

import {
  mouseCoordinate,
  drawCircles,
  drawMap,
} from "../utils/generationCircles";
import { initializeSelectHandlers, initializeSearchCheckboxHandler } from "./searchLogic";

import { addInfoCircle } from './addInfoPoint'

import { restoreColors } from '@/functions'

const canvas = document.getElementById("mapCanvas");
const mapImage = new Image();

initCanvas(canvas);

const ctx = canvas.getContext("2d");

mapImage.src = `./src/img/${mapImageSrc}`;

let isDragging = false;
let lastX;
let lastY;
let mapX = startX;
let mapY = startY;


// Получите размеры холста
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

export let circles = []; // Массив для хранения информации о кругах
let foundCircles = []; // Массив для хранения информации о кругах с поиском

// загружаю и отрисовываю карту
mapImage.onload = async function () {
  const { newCircles, newMapX, newMapY } = await onloadMap({
    circles,
    ctx,
    mapImage,
    mapX,
    mapY,
    canvasWidth,
    canvasHeight,
  });
  circles = newCircles;
  mapX = newMapX;
  mapY = newMapY;
};

// Создаем объект, в котором будем хранить исходные цвета для каждой окружности
const originalColors = [];

const typeListMonsterInput = document.getElementById("typeListMonster");

let timerId;

export function findAndSortsMap(event) {
  const inputValue = event.target.value;
  
  // Assuming you have a defined 'type' variable
  if (inputValue.length > 2) {
    restoreColors(timerId, foundCircles, originalColors);

    foundCircles = findEl(inputValue);

    changeColors(foundCircles, ctx);
    return 
  } else {
    restoreColors(timerId, foundCircles, originalColors);
    foundCircles.length = 0;
  }
}

typeListMonsterInput.addEventListener("change", function (event) {
    // ищу по карте заданные точки
  findAndSortsMap(event);
});

// ищу по конкретному типу мобов и сортирую массив для изменения этих точек
function findEl(typeMob) {
  const ollFindfMob = circles.filter(
    (item) =>
      item.listsMonsters &&
      item.listsMonsters.toUpperCase().includes(typeMob.toUpperCase())
  );
  return ollFindfMob;
}

function changeColors(foundCircles) {
  const color1 = ["red", "blue"]; // Первый цвет
  const color2 = ["blue", "red"]; // Второй цвет
  let colorChangeInterval = 500; // Интервал смены цветов (миллисекунды)
  let currentColor = color1; // Начальный цвет

  // Функция для смены цвета у всех точек
  function changeColorForCircles() {
    foundCircles.forEach((circle) => {
      // Сохраняем исходный цвет перед изменением
      if (foundCircles.length > originalColors.length) {
        originalColors.push(circle.color);
      }
      circle.color = currentColor;
    });

    // Плавно меняем цвет между color1 и color2
    if (currentColor === color1) {
      currentColor = color2;
    } else {
      currentColor = color1;
    }
  }
  // Немедленно вызываем функцию для первой смены цветов
  changeColorForCircles();

  // Устанавливаем интервал для анимации
  timerId = setInterval(changeColorForCircles, colorChangeInterval);
}

let prevMouseX = null;
let prevMouseY = null;

canvas.addEventListener("mousemove", function (event) {
  const { mouseX, mouseY } = mouseCoordinate(event, mapX, mapY);

  if (mouseX !== prevMouseX || mouseY !== prevMouseY) {
    // Курсор изменил положение
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    // Очищаем состояние hover для всех кругов перед проверкой
    circles.forEach((circle) => {
      circle.isHovered = false;
    });
    // Проверяем положение курсора над каждым кругом
    circles.forEach((circle) => {
      const circleX = circle.x + diameterCircle / 2;
      const circleY = circle.y + diameterCircle / 2;
      const distance = Math.sqrt(
        (circleX - mouseX) ** 2 + (circleY - mouseY) ** 2
      );

      if (distance <= diameterCircle / 2) {
        circle.isHovered = true;
      }
    });
    // Очищаем холст и отрисовываем карту и круги
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMap({ ctx, mapImage, mapX, mapY });
    circles = drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx });
  }
});

canvas.addEventListener("mousedown", function (event) {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
});

canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

canvas.addEventListener("mousemove", function (event) {
  if (isDragging) {
    const newX = event.clientX;
    const newY = event.clientY;
    const dx = newX - lastX;
    const dy = newY - lastY;

    if (mapImage.width > canvasWidth || mapImage.height > canvasHeight) {
      mapX = Math.min(0, Math.max(mapX + dx, canvasWidth - mapImage.width));
      mapY = Math.min(0, Math.max(mapY + dy, canvasHeight - mapImage.height));
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMap({ ctx, mapImage, mapX, mapY });
    circles = drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx });

    lastX = newX;
    lastY = newY;
  }
});

canvas.addEventListener(
  "wheel",
  function (event) {
    const delta = event.deltaY;
    const step = 0.1;

    mapY = Math.min(
      0,
      Math.max(mapY + delta * step, canvasHeight - mapImage.height)
    );

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMap({ ctx, mapImage, mapX, mapY });
    circles = drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx });
  },
  { passive: false }
);

document.addEventListener("keydown", function (event) {
  const step = 10;
  switch (event.key) {
    case "ArrowUp":
      mapY += step;
      break;
    case "ArrowDown":
      mapY -= step;
      break;
    case "ArrowLeft":
      mapX += step;
      break;
    case "ArrowRight":
      mapX -= step;
      break;
  }

  mapX = Math.min(0, Math.max(mapX, canvasWidth - mapImage.width));
  mapY = Math.min(0, Math.max(mapY, canvasHeight - mapImage.height));

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawMap({ ctx, mapImage, mapX, mapY });
  circles = drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx });
});

let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
const longPressDuration = 100; // Длительность длительного нажатия в миллисекундах

canvas.addEventListener(
  "touchstart",
  function (event) {
    touchStartTime = Date.now();
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  },
  { passive: true }
);

canvas.addEventListener("touchend", function (event) {
  const touchEndTime = Date.now();
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const touchDuration = touchEndTime - touchStartTime;

  if (touchDuration >= longPressDuration) {
    // Длительное нажатие
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Добавьте проверку размеров карты перед обновлением mapX и mapY
    if (mapImage.width > canvasWidth || mapImage.height > canvasHeight) {
      mapX += dx;
      mapY += dy;
      // Ограничьте mapX и mapY, чтобы они не выходили за пределы холста
      mapX = Math.min(0, Math.max(mapX, canvasWidth - mapImage.width));
      mapY = Math.min(0, Math.max(mapY, canvasHeight - mapImage.height));
    }

    // Очищаем холст и отрисовываем карту и круги
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMap({ ctx, mapImage, mapX, mapY });
    circles = drawCircles({ mapX, mapY, canvasWidth, canvasHeight, ctx });
  }
});

// Предотвращение обновления страницы при пулефреше на мобильных устройствах
document.addEventListener(
  "touchmove",
  function (event) {
    // Отменяем стандартное поведение браузера
    event.preventDefault();
  },
  { passive: false }
);



function showPopup(x, y, circleInfo) {
  const popup = document.getElementById("popup");



  // Позиция по умолчанию
  let left = x + 10;
  let top = y + 30;

  // Проверка, чтобы избежать пересечения с нижней границей экрана
  const windowHeight = window.innerHeight;
  const popupHeight = popup.offsetHeight;

  if (top + popupHeight > windowHeight) {
    top = windowHeight - popupHeight - 100;
  }

  // Проверка, чтобы избежать пересечения с правой границей экрана
  const windowWidth = window.innerWidth;
  const popupWidth = popup.offsetWidth;

  if (left + popupWidth > windowWidth) {
    left = windowWidth - popupWidth - 100;
  }

  popup.style.left = left + "px";
  popup.style.top = top + "px";
  popup.style.display = "block";
  popup.innerHTML = `ID: ${circleInfo.idCircles}${circleInfo.listsMonsters ? `\n${circleInfo.listsMonsters}` : ""}`;
}

// провожу общий  бинарный поиск координат х и у 
export function calculationCurrentPoint(event) {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  const mappedX = x - mapX;
  const mappedY = y - mapY;

  let left = 0;
  let right = circles.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const circle = circles[mid];
    mappedX <= circle.x + diameterCircle 
    if (mappedX >= circle.x && mappedX <= circle.x + diameterCircle) {
      // найдена координата х, но их в массиве circles c конфига heightPicture/diameterCircle
      const countCirclesColumn = Math.ceil(heightPicture/diameterCircle)

      // определя.ю на сколько смещать обрезку массива
      const columnPositionDistance = circle.idCircles % countCirclesColumn
      // ищу координату у
      const newCircleY = searchCirclesByMappedY(circle, columnPositionDistance, mappedY)
      
      if(newCircleY) {
        const circleX = mapX + circle.x;
        const circleY = mapY + newCircleY.y;
         return { circleX, circleY, circle: newCircleY }
      } else {
        return null; // Возвращать null, если круг не найден.
      }
    } 
    else if (mappedX < circle.x) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return null; // Возвращать null, если круг не найден.
}

// произвожу бинарный поиск по координатуе Y и нахожу нужные елемент 
function binarySearchYInArray(arr, mappedY) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const circle = arr[mid];
    if (
      mappedY >= circle.y &&
      mappedY <= circle.y + diameterCircle
    ) {
      return circle; // Возвращаем круг, если условие выполняется
    } else if (mappedY < circle.y) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return null; // Возвращать null, если круг не найден.
}

// нахожу/оборезаю общий массив circles под диапазон 
function searchCirclesByMappedY(initialCircle, columnPositionDistance, mappedY) {
  if (initialCircle) {
    // Ограничиваем значения startY и endY
    const startY = initialCircle.idCircles - columnPositionDistance
    const endY = initialCircle.idCircles + heightPicture/diameterCircle - columnPositionDistance + 1;
    // const startY = Math.max(initialCircle.idCircles - yOffset, 0);
    // const endY = Math.min(initialCircle.idCircles + yOffset, circles.length);

        // Обрезаю другие столбцы
    const newSearchArray = circles.slice(startY, endY)
    // Отфильтровать массив по возрастанию x
    return binarySearchYInArray(newSearchArray, mappedY);
  } else {
    return null; // Возвращать null, если начальный круг не найден.
  }
}


function handleMouseEvent(event) {
  const result = calculationCurrentPoint(event);
  if (result) {
    const { circleX, circleY, circle } = result;
    showPopup(circleX, circleY, circle);
  } else {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
  }
}

let timeoutId;

canvas.addEventListener("mousemove", function(event) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function() {
    handleMouseEvent(event);
  }, 100);
});



canvas.addEventListener("click", handleMouseEvent);


// Функция, обрабатывающая изменение подсписков 
function handleSubListChange(event) {
  // ищу по карте заданные точки
  findAndSortsMap(event);
}

initializeSelectHandlers(handleSubListChange);
initializeSearchCheckboxHandler();


// инициализация логики отправки сообщения на сервер
document.addEventListener('click', async function (event) {
  if (event.ctrlKey) {
    const result = calculationCurrentPoint(event);
    if (result) {
      const { circle } = result;
     await addInfoCircle({
        circles, 
        idCircle: circle.idCircles
      });
    }
  }
});