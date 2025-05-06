document.addEventListener("DOMContentLoaded", function () {
  // Получаем элементы
  const searchWrapper = document.getElementById("searchWrapper");
  const searchContainer = document.getElementById("searchContainer");
  const breadcrumbs = document.querySelector(".t228__crumbs"); // Убедись, что это актуальный селектор

  // Проверка на наличие нужных элементов
  if (!searchWrapper || !searchContainer || !breadcrumbs) {
    console.warn("Один из элементов не найден: searchWrapper, searchContainer или breadcrumbs");
    return;
  }

  // Удаляем searchContainer из его текущего родителя (searchWrapper)
  searchWrapper.removeChild(searchContainer);

  // Вставляем searchContainer перед breadcrumbs
  breadcrumbs.parentNode.insertBefore(searchContainer, breadcrumbs);
});
