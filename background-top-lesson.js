(function() {
    // Находим необходимые блоки
    const breadcrumb = document.querySelector('.breadcrumb');
    const pageHeader = document.querySelector('.page-header');
    const lessonHeaderBlock = document.querySelector('.lesson-header-block.row-section');
    
    // Проверяем, что все элементы существуют
    if (breadcrumb && pageHeader && lessonHeaderBlock) {
        // Получаем высоту всех элементов
        const breadcrumbHeight = breadcrumb.getBoundingClientRect().height;
        const pageHeaderHeight = pageHeader.getBoundingClientRect().height;
        const lessonHeaderBlockHeight = lessonHeaderBlock.getBoundingClientRect().height;

        // Складываем высоты всех элементов
        const totalHeight = breadcrumbHeight + pageHeaderHeight + lessonHeaderBlockHeight;

        // Создаем новый элемент, который будет выполнять роль псевдо-элемента
        const pseudoElement = document.createElement('div');

        // Применяем стили к этому элементу
        pseudoElement.style.position = 'absolute';
        pseudoElement.style.backgroundColor = '#fff';
        pseudoElement.style.width = '100vw';  // Задаем ширину на весь экран
        pseudoElement.style.height = `${totalHeight}px`;  // Высота равна сумме высот элементов
        pseudoElement.style.left = '0px';
        pseudoElement.style.top = '70px';
        pseudoElement.style.zIndex = '-1';  // Задаем z-index -1

        // Находим родительский элемент, в который добавим псевдо-элемент
        const parentElement = document.querySelector('.gc-main-content');
        if (parentElement) {
            parentElement.style.position = 'relative';  // Обеспечиваем, что родитель будет позиционировать потомков относительно себя
            parentElement.appendChild(pseudoElement);
        }

        console.log('Псевдо-элемент добавлен с высотой: ' + totalHeight);
    } else {
        console.log('Один или несколько элементов не найдены.');
    }
})();
