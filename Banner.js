const container = document.querySelector('.container');

// Создаем контейнер баннера
const banner = document.createElement('div');
banner.classList.add('custom-banner');

if (window.innerWidth > 768) {
  // Настройки для десктопа
  const bannerUrl = 'https://static.tildacdn.info/tild3636-3765-4834-b862-323336663562/Frame_279.png';
  banner.style.backgroundImage = `url(${bannerUrl})`;
  banner.style.backgroundSize = 'cover';
  banner.style.backgroundPosition = 'center';
  banner.style.width = '100%';
  banner.style.position = 'relative';
  
  // Высота по пропорции (466 / 1287)
  const aspectRatio = 466 / 1287;
  const containerWidth = container.offsetWidth;
  banner.style.height = `${containerWidth * aspectRatio}px`;

  // Текст
  const bannerText = document.createElement('div');
  bannerText.classList.add('banner-text');
  bannerText.textContent = 'Искусство построения отношений между мужчиной и женщиной'; // Замените на нужный

  // Контейнер для кнопок
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button-wrapper');

  // Функция для создания кнопки с ссылкой
  const createButton = (label, url) => {
    const btnWrapper = document.createElement('a');
    btnWrapper.href = url;  // Добавляем ссылку
    btnWrapper.classList.add('banner-button');
    
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.classList.add('banner-button');
    
    btnWrapper.appendChild(btn);
    return btnWrapper;
  };

  // Добавляем кнопки с нужными ссылками
  buttonWrapper.appendChild(createButton('Работа с наставником', 'https://www.example1.com')); // Укажите ссылку для первой кнопки
  buttonWrapper.appendChild(createButton('Расписание', 'https://www.example2.com')); // Укажите ссылку для второй кнопки
  buttonWrapper.appendChild(createButton('Отчет', 'https://www.example3.com')); // Укажите ссылку для третьей кнопки

  banner.appendChild(bannerText);
  banner.appendChild(buttonWrapper);

} else {
  // Мобильная версия — изображение
  const img = document.createElement('img');
  img.src = 'https://static.tildacdn.com/tild6266-3566-4166-b565-353935386661/Group_48097271.png';
  img.alt = 'Mobile banner';
  img.style.width = '100%';
  img.style.height = 'auto';
  banner.appendChild(img);
}

// Вставляем баннер в начало контейнера
container.prepend(banner);
