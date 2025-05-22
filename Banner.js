document.addEventListener('DOMContentLoaded', function () {
  function getBannerText() {
    const textBlock = document.querySelector('.text-for-banner .f-text');
    return textBlock ? textBlock.textContent.trim() : 'Загружаем текст...';
  }

  function getBannerImageSrc() {
    const isMobile = window.innerWidth <= 768;
    const selector = isMobile ? '.img-for-banner-mob img' : '.img-for-banner-pc img';
    const imageEl = document.querySelector(selector);
    return imageEl ? imageEl.getAttribute('src') || imageEl.getAttribute('data-src') : null;
  }

  function insertBanner(targetElement, isApp = false) {
    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('custom-banner');

    if (isApp) {
      bannerWrapper.style.maxWidth = '90vw';
      bannerWrapper.style.margin = '0 auto';
    }

    // Изображение
    const img = document.createElement('img');
    img.alt = 'Banner Image';
    img.style.width = '100%';
    img.style.height = 'auto';

    const bannerImgSrc = getBannerImageSrc();
    if (bannerImgSrc) {
      img.src = bannerImgSrc.startsWith('//') ? 'https:' + bannerImgSrc : bannerImgSrc;
    } else {
      img.src = 'https://static.tildacdn.info/tild6163-6164-4136-b063-633465616136/Frame_290.png'; // fallback
    }

    bannerWrapper.appendChild(img);

    // Текст
    const bannerText = document.createElement('div');
    bannerText.classList.add('banner-text');
    bannerText.textContent = getBannerText();
    bannerWrapper.appendChild(bannerText);

    // Кнопки
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

