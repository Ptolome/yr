// api/proxy.js
export default async function handler(req, res) {
  // Получаем параметры из запроса нашего фронтенда
  const { key, number, brand, analogues, info } = req.query;

  // Формируем URL для целевого API
  const params = new URLSearchParams();
  if (key) params.append('key', key);
  if (number) params.append('number', number);
  if (brand) params.append('brand', brand);
  if (analogues) params.append('analogues', analogues);
  if (info) params.append('info', info);

  const targetUrl = `http://api.favorit-parts.ru/hs/hsprice/?${params.toString()}`;

  try {
    // Делаем запрос к API Favorit Parts с нашего сервера (Vercel)
    const response = await fetch(targetUrl);
    const data = await response.json();
    
    // Возвращаем данные нашему React-приложению
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка прокси-сервера' });
  }
}