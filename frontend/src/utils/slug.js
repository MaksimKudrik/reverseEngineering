export function generateSlug(name, id) {
  if (!name) return `component-${id || 'unknown'}`;

  // Простой транслит (можно расширить при необходимости)
  const translitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  let slug = name
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    // заменяем всё кроме букв, цифр и пробелов на дефис
    .replace(/[^a-z0-9\s]/g, ' ')
    // несколько пробелов → один дефис
    .replace(/\s+/g, '-')
    // убираем дефисы в начале и конце
    .replace(/^-+|-+$/g, '');

  if (!slug || slug === '-') {
    slug = 'component';
  }

  return `${slug}-${id}`;
}