const container = document.querySelector('.container');

// Создаем новый элемент (например, div)
const newElement = document.createElement('div');
newElement.classList.add('new-element-class');

// Создаем тег <img>
const img = document.createElement('img');

// Проверяем ширину экрана
if (window.innerWidth <= 768) {
  // Мобильная версия
  img.src = 'https://static.tildacdn.com/tild6266-3566-4166-b565-353935386661/Group_48097271.png';
} else {
  // Десктопная версия
  img.src = 'https://static.tildacdn.info/tild3636-3765-4834-b862-323336663562/Frame_279.png';
}

img.alt = 'Image';  // Альтернативный текст
img.style.width = '100%';
img.style.height = 'auto';

// Создаем блок с текстом
const textBlock = document.createElement('div');
textBlock.classList.add('banner-text');
textBlock.textContent = "Искусство построения отношений между мужчиной и женщиной"; // Замените на ваш текст

// Создаем контейнер для кнопок
const buttonWrapper = document.createElement('div');
buttonWrapper.classList.add('button-wrapper');

// Создаем кнопки с ссылками
const button1 = document.createElement('a');
button1.href = 'https://www.example1.com'; // Укажите ссылку для первой кнопки
button1.classList.add('banner-button');
button1.textContent = 'Работа с наставником';

const button2 = document.createElement('a');
button2.href = 'https://www.example2.com'; // Укажите ссылку для второй кнопки
button2.classList.add('banner-button');
button2.textContent = 'Расписание';

const button3 = document.createElement('a');
button3.href = 'https://www.example3.com'; // Укажите ссылку для третьей кнопки
button3.classList.add('banner-button');
button3.textContent = 'Отчет';

// Добавляем кнопки в контейнер
buttonWrapper.appendChild(button1);
buttonWrapper.appendChild(button2);
buttonWrapper.appendChild(button3);

// Добавляем все элементы в баннер
newElement.appendChild(img);
newElement.appendChild(textBlock);
newElement.appendChild(buttonWrapper);

// Добавляем баннер в начало контейнера
container.prepend(newElement);
