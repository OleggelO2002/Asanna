document.addEventListener('DOMContentLoaded', function () {
  const url = 'https://asanna.online/page357'; // страница с нужным блоком

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки страницы: ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // 1. Находим нужный блок с классом .last-lesson-out
      const rawBlock = tempDiv.querySelector('.last-lesson-out');
      if (!rawBlock) {
        console.log('Блок с классом .last-lesson-out не найден');
        return; // Если блок не найден, ничего не делаем
      }

      // 2. Извлекаем текст внутри блока
      const rawText = rawBlock.textContent.trim();
      console.log('Извлечённый текст:', rawText); // Логируем текст

      // 3. Извлекаем ссылку и заголовок из текста
      const urlMatch = rawText.match(/https:\/\/asanna\.online\/pl\/teach\/control\/lesson\/view\?id=\d+/);
      const titleMatch = rawText.match(/^(.*?)(?=\s*https:\/\/)/); // Извлекаем текст перед ссылкой (заголовок)

      if (!urlMatch || !titleMatch) {
        console.log('Не удалось найти ссылку или заголовок');
        return; // Если не удается найти ссылку или заголовок, ничего не делаем
      }

      const lessonUrl = urlMatch[0];
      const lessonTitle = titleMatch[0].trim();

      // 4. Создаём HTML-блок
      const lessonBlock = document.createElement('div');
      lessonBlock.className = 'lastLessonBlock';
      lessonBlock.style.marginTop = '20px';
      lessonBlock.style.padding = '20px';
      lessonBlock.style.backgroundColor = '#fdfdfd';
      lessonBlock.style.border = '1px solid #eee';
      lessonBlock.style.borderRadius = '8px';
      lessonBlock.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';

      lessonBlock.innerHTML = `
        <div class="lesson-title">Вы остановились на уроке:</div>
        <div class="lesson-name">${lessonTitle}</div>
        <a href="${lessonUrl}" class="lesson-btn">Продолжить учиться</a>
      `;

      // 5. Вставляем блок после .xdget-lessonSchedule
      const scheduleBlock = document.querySelector('.xdget-lessonSchedule');
      if (scheduleBlock && scheduleBlock.parentNode) {
        scheduleBlock.parentNode.insertBefore(lessonBlock, scheduleBlock.nextSibling);
        console.log('Блок добавлен!');
      } else {
        console.log('Элемент .xdget-lessonSchedule не найден или у него нет родителя');
      }
    })
    .catch(error => console.error('Ошибка при загрузке HTML:', error));
});
