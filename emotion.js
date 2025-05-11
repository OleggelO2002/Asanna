document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    const maxChecks = 40;
    let checkCount = 0;

    const intervalId = setInterval(() => {
      checkCount++;

      const lessonBlock = document.querySelector('.lastLessonBlock');
      if (lessonBlock) {
        clearInterval(intervalId);

        const url = 'https://asanna.online/page359';

        fetch(url)
          .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText}`);
            return response.text();
          })
          .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const oldBlock = tempDiv.querySelector('.old-count-lesson');
            const newBlock = tempDiv.querySelector('.new-count-lesson');

            if (!oldBlock || !newBlock) {
              console.error('Не найдены .old-count-lesson и .new-count-lesson');
              return;
            }

            const old = parseInt(oldBlock.textContent.trim(), 10);
            const newCount = parseInt(newBlock.textContent.trim(), 10);
            if (isNaN(old) || isNaN(newCount)) {
              console.error('Ошибка разбора чисел');
              return;
            }

            const difference = newCount - old;

            const getEnding = (num) => {
              if ([11, 12, 13, 14].includes(num % 100)) return 'уроков';
              const lastDigit = num % 10;
              if (lastDigit === 1) return 'урок';
              if ([2, 3, 4].includes(lastDigit)) return 'урока';
              return 'уроков';
            };

            let progressText = '';

            if (difference > 7) {
              progressText = 'Ого, мы восхищаемся вами — вы наш герой!';
            } else if (difference >= 3 && difference <= 7) {
              progressText = `Вы прошли на ${difference} ${getEnding(difference)} больше — так держать!`;
            } else if (difference === 2 || difference === 1) {
              progressText = `Вы прошли на ${difference} ${getEnding(difference)} больше — отличная работа!`;
            } else if (difference === 0) {
              progressText = 'Пока вы на том же уровне, но впереди ещё много возможностей!';
            } else if (difference < 0 && difference >= -2) {
              progressText = `Осталось ${Math.abs(difference)} ${getEnding(Math.abs(difference))} — вы почти догнали, так держать!`;
            } else if (difference <= -3 && difference >= -6) {
              progressText = 'Мы в вас верим — у вас всё получится!';
            } else if (difference < -6) {
              progressText = 'Вы немного отстаете — поднажмите, у вас всё получится!';
            }

            const maxValue = Math.max(old, newCount);
            const oldWidth = (old / maxValue) * 100;
            const newWidth = (newCount / maxValue) * 100;

            const achievementsBlock = document.createElement('div');
            achievementsBlock.className = 'achievementsBlock';
            achievementsBlock.style.marginTop = '20px';
            achievementsBlock.style.padding = '20px';
            achievementsBlock.style.backgroundColor = '#f9f9f9';
            achievementsBlock.style.border = '1px solid #ddd';
            achievementsBlock.style.borderRadius = '8px';
            achievementsBlock.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';

            achievementsBlock.innerHTML = `
              <div style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Ваши достижения</div>

              <div style="margin-bottom: 6px;">В прошлом месяце — ${old} ${getEnding(old)}</div>
              <div style="width: 100%; height: 12px; background: #e0e0e0; border-radius: 6px; margin-bottom: 14px;">
                <div style="width: ${oldWidth}%; height: 100%; background: #b0c4de; border-radius: 6px;"></div>
              </div>

              <div style="margin-bottom: 6px;">В этом месяце — ${newCount} ${getEnding(newCount)}</div>
              <div style="width: 100%; height: 12px; background: #e0e0e0; border-radius: 6px; margin-bottom: 18px;">
                <div style="width: ${newWidth}%; height: 100%; background: #6ca86c; border-radius: 6px;"></div>
              </div>

              <div style="font-size: 16px; font-weight: 500; color: #444;">${progressText}</div>
            `;

            if (lessonBlock.parentNode) {
              lessonBlock.parentNode.insertBefore(achievementsBlock, lessonBlock.nextSibling);
              console.log('Блок достижений добавлен');
            }
          })
          .catch(error => console.error('Ошибка загрузки:', error));
      }

      if (checkCount >= maxChecks) {
        clearInterval(intervalId);
        console.log('Не удалось найти .lastLessonBlock в течение 4 секунд');
      }
    }, 100);
  }, 100);
});
