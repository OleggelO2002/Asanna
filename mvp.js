document.addEventListener('DOMContentLoaded', function () {
  // Проверка, что это страница урока
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

  function calculateNewCounts(oldCount, newCount, dateText, currentDateText) {
    if (!dateText) {
      // Если даты нет, создаем новую
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
      // Текущий месяц
      return {
        newCount: newCount + 1,
        oldCount,
        dateText
      };
    } else if (diff === 1) {
      // Следующий месяц
      return {
        newCount: 1,
        oldCount: newCount,
        dateText: currentDateText
      };
    } else if (diff > 1) {
      // Пропущено больше месяца — сброс
      return {
        newCount: 1,
        oldCount: 0,
        dateText: currentDateText
      };
    } else {
      // Дата из будущего или ошибка — ничего не делаем
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

  function fetchCountsAndSend() {
    const currentDateText = getCurrentMonthYearText();

    const newBlock = document.querySelector('.new-count-lesson');
    const oldBlock = document.querySelector('.old-count-lesson');
    const dateBlock = document.querySelector('.date-count-lesson');

    const newCount = parseInt(newBlock?.innerText || '0') || 0;
    const oldCount = parseInt(oldBlock?.innerText || '0') || 0;
    const dateText = dateBlock?.innerText?.trim() || '';

    const updated = calculateNewCounts(oldCount, newCount, dateText, currentDateText);

    if (updated) {
      sendLessonProgress(updated);
    } else {
      console.warn('⚠️ Невозможно отправить данные — дата некорректна или в будущем');
    }
  }

  // Запуск таймера
  setTimeout(() => {
    if (!lessonCompleted) {
      lessonCompleted = true;
      fetchCountsAndSend();
    }
  }, 1 * 60 * 1000); // 15 минут
});
