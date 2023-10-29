import axios from 'axios'

export async function fetchAPIData(params) {
  const url = import.meta.env.VITE_URL_BD;
  try {
      const response = await axios.get(url, { params });
      return response.data;
  } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      throw error;
  }
}

export function sendAPIData(data) {
  return new Promise((resolve, reject) => {
    let url = import.meta.env.VITE_URL_INSERT_BD;
    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log(response);
      resolve(response); // Возвращаем успешный результат через resolve
    })
    .catch(function (error) {
      console.log(error);
      reject(error); // Возвращаем ошибку через reject
    });
  });
}


