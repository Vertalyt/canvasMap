export function fetchAPIData(params) {
  const url = import.meta.env.VITE_URL_BD;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Определяем тип запроса (GET), URL и параметры запроса
    xhr.open('GET', url + '?' + new URLSearchParams(params), true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        try {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            console.error('Ошибка при загрузке данных. Статус:', xhr.status);
            reject(xhr.statusText);
          }
        } catch (error) {
          console.error('Произошла ошибка при обработке данных:', error);
          reject(error);
        }
      }
    };

    // Отправляем запрос
    xhr.send();
  });
}
