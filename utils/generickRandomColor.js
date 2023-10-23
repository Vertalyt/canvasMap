// Список цветов
 export const colors = [
    "rgba(255, 0, 0, 0.8)",
    "rgba(0, 255, 0, 0.8)",
    "rgba(0, 0, 255, 0.8)",
    "rgba(255, 255, 0, 0.8)",
    "rgba(255, 0, 255, 0.8)",
    "rgba(0, 255, 255, 0.8)",
    "rgba(128, 0, 0, 0.8)",
    "rgba(0, 128, 0, 0.8)",
    "rgba(0, 0, 128, 0.8)",
    "rgba(128, 128, 0, 0.8)",
    "rgba(128, 0, 128, 0.8)",
    "rgba(0, 128, 128, 0.8)",
    "rgba(255, 128, 0, 0.8)",
    "rgba(192, 128, 255, 0.8)",
    "rgba(255, 255, 192, 0.8)",
    "rgba(255, 192, 192, 0.8)",
    "rgba(255, 192, 255, 0.8)",
    "rgba(192, 255, 255, 0.8)",
    "rgba(255, 128, 192, 0.8)",
    "rgba(192, 128, 255, 0.8)",
    "rgba(128, 192, 255, 0.8)",
    "rgba(255, 255, 128, 0.8)",
    "rgba(0, 128, 255, 0.8)",
    "rgba(128, 255, 0, 0.8)",
    "rgba(0, 255, 128, 0.8)",
    "rgba(0, 128, 255, 0.8)",
    "rgba(128, 0, 255, 0.8)",
    "rgba(255, 0, 128, 0.8)",
    "rgba(192, 192, 192, 0.8)",
    "rgba(128, 128, 128, 0.8)",
    "rgba(64, 64, 64, 0.8)",
    "rgba(192, 255, 192, 0.8)",
    "rgba(192, 192, 255, 0.8)",
    "rgba(255, 255, 192, 0.8)",
    "rgba(255, 192, 255, 0.8)",
    "rgba(192, 255, 255, 0.8)",
    "rgba(255, 128, 192, 0.8)",
    "rgba(192, 128, 255, 0.8)",
    "rgba(128, 192, 255, 0.8)",
    "rgba(255, 255, 128, 0.8)",
    "rgba(128, 255, 255, 0.8)",
    "rgba(255, 128, 255, 0.8)",
    "rgba(255, 192, 128, 0.8)",
    "rgba(128, 192, 128, 0.8)",
    "rgba(128, 128, 192, 0.8)",
    "rgba(255, 128, 128, 0.8)",
    "rgba(128, 255, 128, 0.8)",
    "rgba(128, 128, 255, 0.8)",
  ];
  


// Функция для генерации случайного цвета
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Генерация записей
const records = [];

// Генерация записей с одним цветом
for (let i = 0; i < 35; i++) {
  records.push(getRandomColor());
}

// Генерация записей с двумя цветами
for (let i = 0; i < 30; i++) {
  const record = [getRandomColor(), getRandomColor()];
  records.push(record);
}

// Генерация записей с тремя цветами
for (let i = 0; i < 25; i++) {
  const record = [getRandomColor(), getRandomColor(), getRandomColor()];
  records.push(record);
}

// Генерация записей с четырьмя цветами
for (let i = 0; i < 5; i++) {
  const record = [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()];
  records.push(record);
}

// Вывод сгенерированных записей
// console.log(records);


