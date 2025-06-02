document.addEventListener('DOMContentLoaded', function () {
  if (!window.location.href.includes('lesson')) {
    console.log('⏭ Не страница урока — логика не выполняется');
    return;
  }

  let lessonCompleted = false;

  function getCurrentMonthYearText() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${month}.${year}`;
  }

  function parseMonthYear(text) {
    const [monthStr, yearStr] = text.split('.');
    return { month: parseInt(monthStr), year: parseInt(yearStr) };
  }

  function monthsDifference(date1, date2) {
    return (date2.year - date1.year) * 12 + (date2.month - date1.month);
  }

  function calculateNewCounts(newCount, oldCount, dateText, currentDateText) {
    if (!dateText) {
      return {
        newCount: 1,
        oldCount: 0,
        dateText: currentDateText
      };
    }

    const saved = parseMonthYear(dateText);
    const current = parseMonthYear(currentDateText);
    const diff = monthsDifference(saved, current);

    if (diff === 0) {
      return {
        newCount: newCount + 1,
        oldCount,
        dateText
      };
    } else if (diff === 1) {
      return {
        newCount: 1,
        oldCount: newCount,
        dateText: currentDateText
      };
    } else if (diff > 1) {
      return {
        newCount: 1,
        oldCount: 0,
        dateText: currentDateText
      };
    } else {
      return null;
    }
  }

  function sendLessonProgress({ newCount, oldCount, dateText }) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `https://asanna.online/page360?new=${newCount}&old=${oldCount}&date=${encodeURIComponent(dateText)}`;
    document.body.appendChild(iframe);
    console.log('📤 Данные отправлены:', { newCount, oldCount, dateText });
  }

  function fetchPreviousDataAndSend() {
    const currentDateText = getCurrentMonthYearText();
    const url = 'https://asanna.online/page359';

    fetch(url)
      .then(response => response.text())
      .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const cleanNumber = (el) => {
          if (!el) return 0;
          const match = el.textContent.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };

        const newBlock = tempDiv.querySelector('.new-count-lesson');
        const oldBlock = tempDiv.querySelector('.old-count-lesson');
        const dateBlock = tempDiv.querySelector('.date-count-lesson');

        const newCount = cleanNumber(newBlock);
        const oldCount = cleanNumber(oldBlock);
        const dateText = dateBlock?.textContent.trim() || '';

        const updated = calculateNewCounts(newCount, oldCount, dateText, currentDateText);
        if (updated) {
          sendLessonProgress(updated);
        } else {
          console.warn('⚠️ Невозможно отправить данные — дата некорректна или в будущем');
        }
      })
      .catch(error => {
        console.error('❌ Ошибка при получении предыдущих данных:', error);
      });
  }

  // Запуск через 15 минут
  setTimeout(() => {
    if (!lessonCompleted) {
      lessonCompleted = true;
      fetchPreviousDataAndSend();
    }
  }, 15 * 60 * 1000); // 15 минут
});
