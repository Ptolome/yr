// Используем corsproxy.io для обхода Mixed Content (HTTPS -> HTTP) и CORS на GitHub Pages
const PROXY_URL = 'https://corsproxy.io/?'; 
const API_BASE = 'http://api.favorit-parts.ru/hs/hsprice/';
const API_KEY = '00000000-0000-0000-0000-000000000001';

export const fetchPartsFromApi = async ({ number, brand, analogues }) => {
  const params = new URLSearchParams();
  params.append('key', API_KEY);
  params.append('number', encodeURIComponent(number));
  params.append('info', 'on');
  
  if (brand) {
    params.append('brand', encodeURIComponent(brand));
  }
  if (analogues) {
    params.append('analogues', analogues);
  }

  // Формируем целевой URL
  const targetUrl = `${API_BASE}?${params.toString()}`;
  
  // Оборачиваем в прокси. Важно: corsproxy.io требует URL в качестве параметра после знака вопроса
  const finalUrl = `${PROXY_URL}${encodeURIComponent(targetUrl)}`;

  try {
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }

    // corsproxy.io возвращает данные напрямую, без обертки .contents
    const apiData = await response.json();

    // Проверка на ошибки от самого API Favorit Parts
    if (apiData.error) {
      throw new Error(apiData.error);
    }

    // Обработка случая "товар не найден" (массив с одним пустым объектом)
    if (apiData.goods && Array.isArray(apiData.goods)) {
        if (apiData.goods.length === 1 && !apiData.goods[0].goodsID) {
            return [];
        }
        return apiData.goods;
    }

    // Если структура ответа неожиданная (например, пришел не объект с goods)
    return [];

  } catch (error) {
    console.error("API Fetch Error:", error);
    // Пробрасываем ошибку дальше для обработки в Redux
    throw error;
  }
};