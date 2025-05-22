document.addEventListener('DOMContentLoaded', function () {
  function insertBanner(targetElement, isApp = false) {
    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('custom-banner');

    if (isApp) {
      bannerWrapper.style.maxWidth = '90vw';
      bannerWrapper.style.margin = '0 auto';
    }

    // ===== Получаем текст =====
    const textElement = document.querySelector('.text-for-banner .text-large');
    const bannerText = document.createElement('div');
    bannerText.classList.add('banner-text');
    if (textElement) {
      bannerText.innerHTML = textElement.innerHTML;
    }

    // ===== Получаем изображения =====
    const img = document.createElement('img');
    img.alt = 'Banner Image';
    img.style.width = '100%';
    img.style.height = 'auto';

    const isMobile = window.innerWidth <= 768;
    const imgSelector = isMobile ? '.img-for-banner-mob img' : '.img-for-banner-pc img';
    const imgElement = document.querySelector(imgSelector);

    if (imgElement) {
      img.src = imgElement.getAttribute('src') || imgElement.getAttribute('data-src');
    } else {
      console.warn('Изображение баннера не найдено.');
      img.src = ''; // или задай дефолтное изображение
    }

    // ===== Кнопки =====
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('banner-buttons');

    const buttonsData = [
      {
        label: 'Отзывы ДО/ПОСЛЕ',
        link: 'https://asanna.online/pl/teach/control/lesson/view?id=342464869'
      }
    ];

    buttonsData.forEach(data => {
      const buttonLink = document.createElement('a');
      buttonLink.href = data.link;
      buttonLink.classList.add('banner-button');
      buttonLink.textContent = data.label;
      buttonGroup.appendChild(buttonLink);
    });

    // ===== Добавляем в DOM =====
    bannerWrapper.appendChild(img);
    if (textElement) bannerWrapper.appendChild(bannerText);
    bannerWrapper.appendChild(buttonGroup);

    targetElement.parentNode.insertBefore(bannerWrapper, targetElement);
  }

  const container = document.querySelector('.container');

  if (container) {
    container.prepend = container.prepend || function (el) { this.insertBefore(el, this.firstChild); };
    insertBanner(container.firstChild || container);
  } else {
    const streamTable = document.querySelector('.xdget-root');
    if (streamTable) {
      insertBanner(streamTable, true);
    }
  }
});
