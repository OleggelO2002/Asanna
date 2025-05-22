document.addEventListener('DOMContentLoaded', async function () {
  const bannerPageUrl = 'https://asanna.online/page358';

  try {
    const res = await fetch(bannerPageUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // ====== ТЕКСТ ======
    const textBlock = doc.querySelector('.text-for-banner .text-large');
    const bannerText = document.createElement('div');
    bannerText.classList.add('banner-text');
    if (textBlock) {
      bannerText.innerHTML = textBlock.innerHTML;
    }

    // ====== КАРТИНКА ======
    const isMobile = window.innerWidth <= 768;
    const imgSelector = isMobile ? '.img-for-banner-mob img' : '.img-for-banner-pc img';
    const imgElement = doc.querySelector(imgSelector);

    const img = document.createElement('img');
    img.alt = 'Banner Image';
    img.style.width = '100%';
    img.style.height = 'auto';
    if (imgElement) {
      img.src = imgElement.getAttribute('src') || imgElement.getAttribute('data-src');
    }

    // ====== КНОПКИ ======
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

    // ====== СОЗДАНИЕ БАННЕРА ======
    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('custom-banner');
    bannerWrapper.appendChild(img);
    if (textBlock) bannerWrapper.appendChild(bannerText);
    bannerWrapper.appendChild(buttonGroup);

    // ====== ДОБАВЛЯЕМ В DOM ======
    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(bannerWrapper, container.firstChild);
    } else {
      const streamTable = document.querySelector('.xdget-root');
      if (streamTable) {
        streamTable.parentNode.insertBefore(bannerWrapper, streamTable);
      }
    }

  } catch (error) {
    console.error('Ошибка при загрузке баннера:', error);
  }
});
