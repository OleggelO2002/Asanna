<script type="text/javascript" src="https://addevent.com/libs/atc/1.6.1/atc.min.js" async defer></script>


document.addEventListener('DOMContentLoaded', function () {
  let attempts = 0;
  const maxAttempts = 10;

  const intervalId = setInterval(() => {
    const block = document.querySelector('.xdget-lessonSchedule');
    if (block || attempts >= maxAttempts) {
      clearInterval(intervalId);
      if (block) {
        initLessonSchedule(block);
      } else {
        console.warn('Блок .xdget-lessonSchedule не найден за 1000 мс');
      }
    }
    attempts++;
  }, 100);

  function initLessonSchedule(block) {
    const header = block.querySelector('h3');
    const scheduleBlock = block.querySelector('.schedule-block');
    const days = scheduleBlock?.querySelectorAll('.day');

    if (!header || !scheduleBlock || !days) {
      console.warn('Не найдены необходимые вложенные элементы');
      return;
    }

    scheduleBlock.style.overflow = 'hidden';
    scheduleBlock.style.transition = 'max-height 0.5s ease';
    scheduleBlock.style.display = 'block';
    scheduleBlock.style.maxHeight = scheduleBlock.scrollHeight + 'px';
    header.classList.add('open');

    let expanded = true;
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      expanded = !expanded;
      header.classList.toggle('open', expanded);
      header.classList.toggle('closed', !expanded);
      scheduleBlock.style.maxHeight = expanded ? scheduleBlock.scrollHeight + 'px' : '0';
    });

    const months = {
      'Январь': '01', 'Февраль': '02', 'Март': '03', 'Апрель': '04',
      'Май': '05', 'Июнь': '06', 'Июль': '07', 'Август': '08',
      'Сентябрь': '09', 'Октябрь': '10', 'Ноябрь': '11', 'Декабрь': '12',
      'Янв': '01', 'Фев': '02', 'Мар': '03', 'Апр': '04',
      'Июн': '06', 'Июл': '07', 'Авг': '08', 'Сен': '09',
      'Окт': '10', 'Ноя': '11', 'Дек': '12'
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    days.forEach(day => {
      const dateLabel = day.querySelector('.day-label');
      const records = day.querySelectorAll('.record');
      if (!dateLabel || !records.length) return;

      const dateText = dateLabel.textContent.trim().replace(/\s+/g, ' ');

      records.forEach(record => {
        const timeEl = record.querySelector('.time');
        const eventEl = record.querySelector('.event');
        const eventLink = eventEl?.querySelector('a');
        if (!timeEl || !eventEl || !eventLink) return;

        const timeText = timeEl.textContent.trim();
        const eventTitle = eventLink.textContent.trim();
        const eventDesc = eventEl.textContent.trim();

        let eventDate = null;
        if (dateText.toLowerCase().includes('сегодня')) {
          eventDate = new Date(today);
        } else if (dateText.toLowerCase().includes('завтра')) {
          eventDate = new Date(today);
          eventDate.setDate(today.getDate() + 1);
        } else {
          const dateMatch = dateText.match(/^(\d{1,2}) (\p{L}+),?/u);
          if (!dateMatch) return;
          const [_, dayStr, monthStr] = dateMatch;
          const month = months[monthStr];
          if (!month) return;
          const year = today.getFullYear();
          eventDate = new Date(`${year}-${month}-${dayStr.padStart(2, '0')}T${timeText}:00`);
        }

        const eventDayOnly = new Date(eventDate);
        eventDayOnly.setHours(0, 0, 0, 0);

        if (eventDayOnly >= today && !record.querySelector('.addeventatc')) {
          const a = document.createElement('a');
          a.className = 'addeventatc';
          a.title = 'Добавить в календарь';
          a.innerHTML = `
            Добавить в календарь
            <span class="start">${eventDate.getFullYear()}-${(eventDate.getMonth()+1).toString().padStart(2, '0')}-${eventDate.getDate().toString().padStart(2, '0')} ${timeText}</span>
            <span class="end">${eventDate.getFullYear()}-${(eventDate.getMonth()+1).toString().padStart(2, '0')}-${eventDate.getDate().toString().padStart(2, '0')} ${String(Number(timeText.split(':')[0]) + 1).padStart(2, '0')}:${timeText.split(':')[1]}</span>
            <span class="timezone">Europe/Moscow</span>
            <span class="title">${eventTitle}</span>
            <span class="description">${eventDesc}</span>
            <span class="location">Онлайн</span>
          `;
          record.appendChild(a);
        }
      });
    });
  }
});

