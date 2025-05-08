document.addEventListener('DOMContentLoaded', function () {
  // Не добавляем баннер в мобильной версии
  if (window.innerWidth <= 768) return;

  const container = document.querySelector('.container');
  if (!container) return;

  // Создаем обёртку баннера
  const bannerWrapper = document.createElement('div');
  bannerWrapper.classList.add('custom-banner');

  // Создаем изображение
  const img = document.createElement('img');
  img.src = 'https://static.tildacdn.info/tild3636-3765-4834-b862-323336663562/Frame_279.png';
  img.alt = 'Banner Image';
  img.style.width = '100%';
  img.style.height = 'auto';
  bannerWrapper.appendChild(img);

  // Добавляем текст
  const bannerText = document.createElement('div');
  bannerText.classList.add('banner-text');
  bannerText.textContent = 'Искусство построения отношений между мужчиной и женщиной';
  bannerWrapper.appendChild(bannerText);

  // Обёртка для кнопок
  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('banner-buttons');

  const buttonsData = [
    { label: 'Отзывы ДО/ПОСЛЕ', link: 'https://asanna.online/pl/teach/control/lesson/view?id=342464869' }
  ];

  buttonsData.forEach(data => {
    const buttonLink = document.createElement('a');
    buttonLink.href = data.link;
    buttonLink.classList.add('banner-button');
    buttonLink.textContent = data.label;
    buttonGroup.appendChild(buttonLink);
  });

  bannerWrapper.appendChild(buttonGroup);

  // Добавляем баннер в начало контейнера
  container.prepend(bannerWrapper);
});



document.addEventListener('DOMContentLoaded', function () {
  const targetContainer = document.querySelector('.col-md-4');

  if (!targetContainer) return;

  // Проверяем, есть ли уже блок .xdget-lessonSchedule
  if (targetContainer.querySelector('.xdget-lessonSchedule')) return;

  // Загружаем страницу с расписанием
  fetch('/teach/control/stream/index')
    .then(response => response.text())
    .then(htmlText => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const lessonSchedule = doc.querySelector('.xdget-lessonSchedule');

      if (lessonSchedule) {
        // Клонируем элемент, чтобы вставить без удаления из оригинала
        const clone = lessonSchedule.cloneNode(true);
        targetContainer.appendChild(clone);
      }
    })
    .catch(err => {
      console.error('Ошибка при загрузке расписания:', err);
    });
});
