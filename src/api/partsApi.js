// Работает только локально через Vite Proxy!
const BASE_URL = '/hs/hsprice/';
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

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Сбой сети. Попробуйте позже.');
  }

  const data = await response.json();

  // Обработка ошибок API
  if (data.error) {
    throw new Error(data.error);
  }

  // Обработка пустого ответа (если товар не найден, API возвращает массив с одним пустым объектом)
  if (data.goods && data.goods.length === 1 && !data.goods[0].goodsID) {
    return [];
  }

  return data.goods || [];
};