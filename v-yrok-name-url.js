$(document).ready(function () {
    // Собираем данные
    const lessonTitle = $('.lesson-title-value').text(); // Название урока
    const currentUrl = window.location.href; // Текущий URL страницы

    // Создаем скрытый iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // Скрываем iframe
    iframe.src = `https://asanna.online/page356?lessonTitle=${encodeURIComponent(lessonTitle)}&lessonUrl=${encodeURIComponent(currentUrl)}`;
    document.body.appendChild(iframe);

    console.log('Скрытый iframe создан и данные отправлены.');
    console.log('Название урока:', lessonTitle);
    console.log('URL урока:', currentUrl);
});
