// api/proxy.js
export default async function handler(req, res) {
  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, number, brand, analogues, info } = req.query;

  // Формируем параметры для целевого API
  const params = new URLSearchParams();
  if (key) params.append('key', key);
  if (number) params.append('number', number);
  if (brand) params.append('brand', brand);
  if (analogues) params.append('analogues', analogues);
  if (info) params.append('info', info);

  const targetUrl = `http://api.favorit-parts.ru/hs/hsprice/?${params.toString()}`;

  try {
    // Сервер Vercel делает запрос к HTTP API
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Возвращаем данные клиенту
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from parts API' });
  }
}