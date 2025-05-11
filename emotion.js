document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    const maxChecks = 30;
    let checkCount = 0;

    const intervalId = setInterval(() => {
      checkCount++;

      const lessonBlock = document.querySelector('.lastLessonBlock');
      if (lessonBlock) {
        clearInterval(intervalId);

        const url = 'https://asanna.online/page359';

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

            const oldBlock = tempDiv.querySelector('.old-count-lesson');
            const newBlock = tempDiv.querySelector('.new-count-lesson');

            const cleanNumber = (el) => {
              if (!el) return 0;
              const match = el.textContent.match(/\d+/);
              return match ? parseInt(match[0], 10) : 0;
            };

            const old = cleanNumber(oldBlock);
            const newCount = cleanNumber(newBlock);

            const total = Math.max(old, newCount);
            const oldPercent = total === 0 ? 0 : Math.round((old / total) * 100);
            const newPercent = total === 0 ? 0 : Math.round((newCount / total) * 100);
            const difference = newCount - old;

            const getLessonWord = (num) => {
              const n = Math.abs(num) % 100;
              const n1 = n % 10;
              if (n > 10 && n < 20) return 'уроков';
              if (n1 > 1 && n1 < 5) return 'урока';
              if (n1 === 1) return 'урок';
              return 'уроков';
            };

            let progressText = '';
            if (difference > 7) {
              progressText = 'Ого, мы восхищаемся вами — вы наш герой!';
            } else if (difference >= 3 && difference <= 7) {
              progressText = `Вы прошли на ${difference} ${getLessonWord(difference)} больше — так держать!`;
            } else if (difference >= 1 && difference < 3) {
              progressText = `Вы прошли на ${difference} ${getLessonWord(difference)} больше — вы большая молодец!`;
            } else if (difference === 0) {
              progressText = 'Вы идёте в том же темпе, продолжайте в том же духе!';
            } else if (difference < 0 && difference >= -2) {
              progressText = `Осталось ${Math.abs(difference)} ${getLessonWord(difference)} — совсем немного, вы справитесь!`;
            } else if (difference < -2 && difference >= -6) {
              progressText = 'Мы в вас верим — у вас всё получится!';
            } else if (difference < -6) {
              progressText = 'Вы немного отстаёте, поднажмите — у вас всё получится!';
            }

            const achievementBlock = document.createElement('div');
            achievementBlock.className = 'achievement-block';
            achievementBlock.style.marginTop = '20px';
            achievementBlock.style.padding = '20px';
            achievementBlock.style.backgroundColor = '#fdfdfd';
            achievementBlock.style.border = '1px solid #eee';
            achievementBlock.style.borderRadius = '8px';
            achievementBlock.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            achievementBlock.innerHTML = `
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Ваши достижения</div>
              <div style="margin-bottom: 6px;">В прошлом месяце — ${old} ${getLessonWord(old)}</div>
              <div style="background-color: #eee; border-radius: 4px; height: 10px; margin-bottom: 12px;">
                <div style="width: ${oldPercent}%; height: 100%; background-color: #ccc; border-radius: 4px;"></div>
              </div>
              <div style="margin-bottom: 6px;">В этом месяце — ${newCount} ${getLessonWord(newCount)}</div>
              <div style="background-color: #eee; border-radius: 4px; height: 10px; margin-bottom: 16px;">
                <div style="width: ${newPercent}%; height: 100%; background-color: #76c7c0; border-radius: 4px;"></div>
              </div>
              <div style="font-style: italic;">${progressText}</div>
            `;

            lessonBlock.parentNode.insertBefore(achievementBlock, lessonBlock.nextSibling);
          })
          .catch(error => {
            console.error('Ошибка при загрузке и обработке данных:', error);
          });
      }

      if (checkCount >= maxChecks) {
        clearInterval(intervalId);
        console.log('Не удалось найти .lastLessonBlock в течение времени ожидания');
      }
    }, 100);
  }, 1100);
});
