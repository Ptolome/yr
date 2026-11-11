// Базовый URL теперь ведет на нашу функцию прокси
// При локальной разработке Vite сам поймет этот путь, если настроить прокси, 
// но для Vercel мы будем использовать относительный путь или полный домен после деплоя.
const BASE_URL = '/api/proxy'; 

export const fetchPartsFromApi = async ({ number, brand, analogues }) => {
  const params = new URLSearchParams();
  params.append('key', '00000000-0000-0000-0000-000000000001'); 
  params.append('number', encodeURIComponent(number));
  params.append('info', 'on');
  
  if (brand) {
    params.append('brand', encodeURIComponent(brand));
  }
  if (analogues) {
    params.append('analogues', analogues);
  }

  // Добавляем параметры к URL прокси
  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.goods && data.goods.length === 1 && !data.goods[0].goodsID) {
      return [];
    }

    return data.goods || [];
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};