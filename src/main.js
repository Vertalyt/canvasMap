import { mapImageSrc, startX, startY, diameterCircle } from '@/config'
import "../style/style.css";

import { initCanvas } from "../src/canvas";
import { onloadMap } from "../src/map";

import {
  mouseCoordinate,
  drawCircles,
  drawMap,
  elita,
} from "../utils/generickCircles";

const circleDiameter = diameterCircle
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

let circles = []; // Массив для хранения информации о кругах
let foundCircles = []; // Массив для хранения информации о кругах с поиском

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

const typeListMonstrsInput = document.getElementById("typeListMonstrs");

function findAndSortsMap(event) {
  const inputValue = event.target.value;
  // Assuming you have a defined 'type' variable
  if (inputValue.length > 2) {
    restorColors();
    foundCircles = findEl(inputValue);
    changeColors(foundCircles, ctx);
  } else {
    restorColors();
    foundCircles.length = 0;
  }
}

typeListMonstrsInput.addEventListener("change", function (event) {
  findAndSortsMap(event);
});

let timerId;
// Функция для сброса цветов к исходным
function restorColors() {
  clearInterval(timerId); // Очистите интервал
  foundCircles.forEach((circle, i) => {
    if (originalColors[i]) {
      circle.color = originalColors[i];
    }
  });
  originalColors.length = 0;
}

function findEl(typeMob) {
  const ollFindfMob = circles.filter(
    (item) =>
      item.listsMonsters &&
      item.listsMonsters.toUpperCase().includes(typeMob.toUpperCase())
  );
  const findfMob = ollFindfMob.filter((item) => !elita.includes(item.type));
  return findfMob;
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
      if (foundCircles.length >= originalColors.length) {
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
      const circleX = circle.x + circleDiameter / 2;
      const circleY = circle.y + circleDiameter / 2;
      const distance = Math.sqrt(
        (circleX - mouseX) ** 2 + (circleY - mouseY) ** 2
      );

      if (distance <= circleDiameter / 2) {
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

  popup.innerHTML = `ID: ${circleInfo.idCircles}${circleInfo.listsMonsters ? `\n${circleInfo.listsMonsters}` : ""}`;

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
}




function handleMouseEvent(event) {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  const mappedX = x - mapX;
  const mappedY = y - mapY;
  for (const circle of circles) {
    if (
      mappedX >= circle.x &&
      mappedX <= circle.x + circleDiameter &&
      mappedY >= circle.y &&
      mappedY <= circle.y + circleDiameter
    ) {
      const circleX = mapX + circle.x;
      const circleY = mapY + circle.y;
      showPopup(circleX, circleY, circle);
      return;
    }
  }
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

canvas.addEventListener("mousemove", handleMouseEvent);
canvas.addEventListener("click", handleMouseEvent);



const select = document.getElementById("select-box1");
const selectBox = document.querySelector(".select-box");

select.addEventListener("click", function () {
  selectBox.classList.toggle("open");
});

document.addEventListener("mouseup", function (e) {
  if (!selectBox.contains(e.target)) {
    selectBox.classList.remove("open");
  }
});

select.addEventListener("change", function () {
  const selection = select.options[select.selectedIndex].text;
  const labelFor = select.id;
  const label = document.querySelector(`[for='${labelFor}']`);
  label.querySelector(".label-desc").textContent = selection;

  // Скрыть все подсписки
  document.querySelectorAll(".sub-select").forEach(function (subSelect) {
    subSelect.style.display = "none";
  });

  // Показать подсписок, связанный с выбранным элементом
  const subSelectId = `sub-select${select.selectedIndex}`;
  document.getElementById(subSelectId).style.display = "block";
});


const subList = document.querySelectorAll(".subList");

subList.forEach(function (item) {
  item.addEventListener("change", function (event) {
    findAndSortsMap(event);
  });
});


const searchCheckbox = document.getElementById("searchCheckbox");
const wraperListMonstrs = document.getElementById("wraperListMonstrs");
searchCheckbox.addEventListener("click", function () {
  wraperListMonstrs.classList.toggle("show");
  selectBox.classList.toggle("show");
});
