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

  let floatingCard = null;

  // Закрытие overlay
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

    // Ищем все <a> внутри #links
    const links = doc.querySelectorAll('#links a');
    const images = Array.from(links).slice(0, 6).map(link => {
      let url = link.href;
      if (!url) return null;

      // Убираем миниатюрную часть и меняем домен
      url = url.replace('//fs-thb03.getcourse.ru/fileservice/file/thumbnail', 'https://fs22.getcourse.ru/fileservice/file/download');
      url = url.replace(/\/s\/s\d+x\d+\//, '/'); // удаляем обрезку /s/s400x400/
      return url;
    }).filter(Boolean);

    console.log('Оригинальные ссылки на изображения:', images);

    // Текст
    const textBlock = doc.querySelector('.text-for-card p');
    if (textBlock) {
      textContainer.textContent = textBlock.textContent;
    }

    // Создаём карточки
    images.forEach((src) => {
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

        const rect = card.getBoundingClientRect();
        floatingCard = card.cloneNode(true);
        floatingCard.classList.add('floating-card');
        floatingCard.style.position = 'absolute';
        floatingCard.style.left = `${rect.left + window.scrollX}px`;
        floatingCard.style.top = `${rect.top + window.scrollY}px`;
        floatingCard.style.width = `${rect.width}px`;
        floatingCard.style.height = `${rect.height}px`;
        document.body.appendChild(floatingCard);

        allCards.forEach(c => c.style.visibility = 'hidden');

        const centerX = window.innerWidth / 2 - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.height / 2;

        requestAnimationFrame(() => {
          floatingCard.style.left = `${centerX + window.scrollX}px`;
          floatingCard.style.top = `${centerY + window.scrollY}px`;
        });

        setTimeout(() => {
          if (!floatingCard) return;
          const currentRect = floatingCard.getBoundingClientRect();
          floatingCard.style.position = 'fixed';
          floatingCard.style.left = `${currentRect.left}px`;
          floatingCard.style.top = `${currentRect.top}px`;

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
