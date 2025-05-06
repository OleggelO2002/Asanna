document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находится ли пользователь на странице тренинга
    if (window.location.href.includes('/stream/')) {
        // URL страницы с переменными
        const url = 'https://vlcenter-online.ru/page336';

        // Создаем запрос для загрузки страницы
        fetch(url)
          .then(response => response.text())
          .then(html => {
            // Создаем временный элемент, в который поместим загруженный HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Ищем нужный элемент по классу fortest
            const content = tempDiv.querySelector('.fortest');

            // Если элемент найден, вставляем его содержимое в .container после .breadcrumbs
            if (content) {
              const container = document.querySelector('.container');
              const breadcrumbs = document.querySelector('.breadcrumbs');

              // Если элементы .container и .breadcrumbs существуют
              if (breadcrumbs && container) {
                const newDiv = document.createElement('div');
                newDiv.classList.add('container');
                newDiv.innerHTML = content.innerHTML;  // Вставляем содержимое

                // Вставляем новый контейнер после блока .breadcrumbs
                breadcrumbs.parentNode.insertBefore(newDiv, breadcrumbs.nextSibling);
              } else {
                console.log('Элементы .breadcrumbs или .container не найдены на странице');
              }
            } else {
              console.log('Элемент с классом fortest не найден на целевой странице');
            }
          })
          .catch(error => console.error('Ошибка при загрузке страницы:', error));
    } else {
        console.log('Это не страница тренинга, вывод данных не производится.');
    }
});



// код для сбора ссылки и названия урока
$(document).ready(function () {
    // Собираем данные
    const lessonTitle = $('.lesson-title-value').text(); // Название урока
    const currentUrl = window.location.href; // Текущий URL страницы

    // Создаем скрытый iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // Скрываем iframe
    iframe.src = `https://vlcenter-online.ru/page318?lessonTitle=${encodeURIComponent(lessonTitle)}&lessonUrl=${encodeURIComponent(currentUrl)}`;
    document.body.appendChild(iframe);

    console.log('Скрытый iframe создан и данные отправлены.');
    console.log('Название урока:', lessonTitle);
    console.log('URL урока:', currentUrl);
});
