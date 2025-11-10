document.addEventListener('DOMContentLoaded', async function () { 
  const cardPageUrl = 'https://asanna.online/page361';

  // Создаем overlay
  const overlay = document.createElement('div');
  overlay.id = 'daily-card-overlay';
  document.body.appendChild(overlay);

  // Кнопка закрытия
  const closeButton = document.createElement('div');
  closeButton.id = 'daily-card-close';
  closeButton.innerHTML = '&times;';
  overlay.appendChild(closeButton);

  // Текст подсказки
  const textContainer = document.createElement('div');
  textContainer.id = 'daily-card-text';
  overlay.appendChild(textContainer);

  // Контейнер карточек
  const container = document.createElement('div');
  container.id = 'daily-card-container';
  overlay.appendChild(container);

  // Переменная для хранения клона карточки
  let floatingCard = null;

  // Закрытие overlay и удаление клона карточки
  closeButton.addEventListener('click', () => {
    overlay.remove();
    if (floatingCard) {
      floatingCard.remove();
      floatingCard = null;
    }
  });

  try {
    const res = await fetch(cardPageUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // --- Функция для конвертации миниатюры в оригинал ---
    function convertThumbnailToDownload(src) {
      if (!src) return src;
      let full = src.startsWith('//') ? 'https:' + src : src;
      const hIdx = full.indexOf('/h/');
      if (hIdx === -1) return full;
      const sIdx = full.indexOf('/s/', hIdx);
      const aIdx = full.indexOf('/a/', (sIdx !== -1 ? sIdx : hIdx));
      const filenameEnd = sIdx !== -1 ? sIdx : (aIdx !== -1 ? aIdx : full.length);
      const filename = full.slice(hIdx + 3, filenameEnd);
      const aPart = (aIdx !== -1) ? full.slice(aIdx) : '';
      if (!aPart) return full;
      return `https://fs22.getcourse.ru/fileservice/file/download${aPart}/h/${filename}`;
    }

    // --- Сбор изображений ---
    const imageNodes = doc.querySelectorAll('#links a, #links img');
    const images = [];
    imageNodes.forEach(node => {
      let url = null;

      if (node.tagName.toLowerCase() === 'a') {
        url = node.getAttribute('href') || node.href || null;
        if (!url) {
          const imgInside = node.querySelector && node.querySelector('img');
          if (imgInside) {
            url = imgInside.getAttribute('data-full') || imgInside.getAttribute('data-src') || imgInside.getAttribute('src');
          }
        }
      } else if (node.tagName.toLowerCase() === 'img') {
        const parentA = node.closest && node.closest('a');
        url = (parentA && (parentA.getAttribute('href') || parentA.href)) || node.getAttribute('data-full') || node.getAttribute('data-src') || node.getAttribute('src');
      }

      if (url) {
        if (/\/s\/|thumbnail/.test(url)) {
          try {
            const converted = convertThumbnailToDownload(url);
            if (converted) url = converted;
          } catch (e) {}
        }
        images.push(url);
      }
    });

    const uniqueImages = Array.from(new Set(images)).slice(0, 6);
    console.log('Загруженные изображения для карточек:', uniqueImages);

    // Текст
    const textBlock = doc.querySelector('.text-for-card p');
    if (textBlock) {
      textContainer.textContent = textBlock.textContent;
    }

    // --- Создание карточек ---
    uniqueImages.forEach((src) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-back"></div>
          <div class="card-front">
            <img src="${src}" style="width:100%; height:100%; object-fit: cover;">
          </div>
        </div>`;
      container.appendChild(card);

      // Клик по карточке
      card.addEventListener('click', () => {
        if (container.classList.contains('done')) return;
        container.classList.add('done');

        const allCards = Array.from(container.children);

        // Клонируем карточку
        const rect = card.getBoundingClientRect();
        floatingCard = card.cloneNode(true);
        floatingCard.classList.add('floating-card');
        floatingCard.style.position = 'absolute';
        floatingCard.style.left = `${rect.left + window.scrollX}px`;
        floatingCard.style.top = `${rect.top + window.scrollY}px`;
        floatingCard.style.width = `${rect.width}px`;
        floatingCard.style.height = `${rect.height}px`;
        document.body.appendChild(floatingCard);

        // Скрываем оригиналы
        allCards.forEach(c => c.style.visibility = 'hidden');

        // Центрирование
        const centerX = window.innerWidth / 2 - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.height / 2;

        requestAnimationFrame(() => {
          floatingCard.style.left = `${centerX + window.scrollX}px`;
          floatingCard.style.top = `${centerY + window.scrollY}px`;
        });

        // Через 1 секунду переключаем позицию на fixed
        setTimeout(() => {
          if (!floatingCard) return;

          const currentRect = floatingCard.getBoundingClientRect();
          floatingCard.style.position = 'fixed';
          floatingCard.style.left = `${currentRect.left}px`;
          floatingCard.style.top = `${currentRect.top}px`;

          // Флип
          setTimeout(() => {
            if (floatingCard) {
              floatingCard.classList.add('flipped');
            }
          }, 100);
        }, 1000);
      });
    });

  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    overlay.remove();
  }
});
