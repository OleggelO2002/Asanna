document.addEventListener('DOMContentLoaded', function () {
  const url = 'https://asanna.online/page357'; // страница с нужным блоком

  fetch(url)
    .then(response => response.text())
    .then(html => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // 1. Находим нужный блок по классу last-lesson-out
      const rawBlock = tempDiv.querySelector('.last-lesson-out');
      if (!rawBlock) {
        return; // Если блок не найден, ничего не делаем
      }

      const rawText = rawBlock.textContent.trim();

      // 2. Извлекаем ссылку и заголовок из текста
      const urlMatch = rawText.match(/https:\/\/asanna\.online\/pl\/teach\/control\/lesson\/view\?id=\d+/);
      const titleMatch = rawText.match(/Шаг\s*\d+\..*?(?=https:\/\/)/s);

      if (!urlMatch || !titleMatch) {
        return; // Если не удается найти ссылку или заголовок, ничего не делаем
      }

      const lessonUrl = urlMatch[0];
      const lessonTitle = titleMatch[0].trim();

      // 3. Создаём HTML-блок
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

      // 4. Вставляем блок после .xdget-lessonSchedule
      const scheduleBlock = document.querySelector('.xdget-lessonSchedule');
      if (scheduleBlock && scheduleBlock.parentNode) {
        scheduleBlock.parentNode.insertBefore(lessonBlock, scheduleBlock.nextSibling);
      }
    })
    .catch(error => console.error('Ошибка при загрузке HTML:', error));
});
