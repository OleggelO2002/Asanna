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

    if (!header || !scheduleBlock || !days) return;

    scheduleBlock.style.overflow = 'hidden';
    scheduleBlock.style.transition = 'max-height 0.5s ease';
    scheduleBlock.style.display = 'block';

    let expanded = true;
    header.classList.add('open');
    header.style.cursor = 'pointer';

    scheduleBlock.style.maxHeight = '0';
    setTimeout(() => {
      scheduleBlock.style.maxHeight = scheduleBlock.scrollHeight + 'px';
    }, 100);

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

        if (eventDayOnly >= today && !record.querySelector('.calendar-btn')) {
          const btn = document.createElement('button');
          btn.textContent = 'Добавить в календарь';
          btn.className = 'calendar-btn';
          btn.style.marginTop = '10px';

          btn.addEventListener('click', function () {
            const [h, m] = timeText.split(':');
            const pad = n => n.toString().padStart(2, '0');
            const y = eventDate.getFullYear();
            const mo = pad(eventDate.getMonth() + 1);
            const d = pad(eventDate.getDate());
            const start = `${y}${mo}${d}T${pad(h)}${pad(m)}00`;
            const endHour = String(Number(h) + 1).padStart(2, '0');
            const end = `${y}${mo}${d}T${endHour}${pad(m)}00`;

            const ua = navigator.userAgent || navigator.vendor || window.opera;
            const isIOS = /iP(ad|hone|od)/.test(ua);
            const isSafari = isIOS && ua.includes("Safari") &&
              !ua.includes("CriOS") && !ua.includes("FxiOS") &&
              !ua.includes("EdgiOS") && !ua.includes("YaBrowser") &&
              !ua.includes("OPiOS") && !ua.includes("DuckDuckGo") &&
              !ua.includes("Brave");

            const isChatiumApp = document.body.classList.contains('chatium_body');
            const hasGcAccountLeftbar = document.querySelector('.gc-account-leftbar');
            const isAppEnvironment = isChatiumApp || !hasGcAccountLeftbar;

            if (isAppEnvironment) {
              openGoogleCalendar({ title: eventTitle, desc: eventDesc, start, end });
            } else if (isSafari) {
              showCalendarPopup({ title: eventTitle, desc: eventDesc, start, end });
            } else {
              openGoogleCalendar({ title: eventTitle, desc: eventDesc, start, end });
            }
          });

          record.appendChild(btn);
        }
      });
    });
  }

  function showCalendarPopup({ title, desc, start, end }) {
    if (document.querySelector('.calendar-popup')) return;

    const popup = document.createElement('div');
    popup.className = 'calendar-popup';
    popup.innerHTML = `
      <div class="calendar-popup-content">
        <p>Выберите календарь:</p>
        <button class="calendar-option google">Google Календарь</button>
        <button class="calendar-option apple">Apple Календарь</button>
        <button class="calendar-close">Отмена</button>
      </div>
    `;
    document.body.appendChild(popup);

    popup.querySelector('.google').addEventListener('click', () => {
      openGoogleCalendar({ title, desc, start, end });
      popup.remove();
    });

    popup.querySelector('.apple').addEventListener('click', () => {
      const appleUrl = `webcal://calendar.apple.com/?title=${encodeURIComponent(title)}&details=${encodeURIComponent(desc)}`;
      window.location.href = appleUrl;
      popup.remove();
    });

    popup.querySelector('.calendar-close').addEventListener('click', () => {
      popup.remove();
    });
  }

  function openGoogleCalendar({ title, desc, start, end }) {
    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.set('action', 'TEMPLATE');
    calendarUrl.searchParams.set('text', title);
    calendarUrl.searchParams.set('details', desc);
    calendarUrl.searchParams.set('dates', `${start}/${end}`);
    calendarUrl.searchParams.set('ctz', 'Europe/Moscow');
    window.open(calendarUrl.toString(), '_blank');
  }
});

