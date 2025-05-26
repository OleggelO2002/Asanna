// ======= HTML-код для поиска =======
const searchContainerHTMLMobile = `
  <div id="searchContainerMobile" style="position: relative; z-index: 1000; display: flex; align-items: center; background-color: white; border-radius: 20px; overflow: hidden; width: 40px; transition: width 0.3s ease;">
    <img src="https://static.tildacdn.info/tild3764-3665-4662-b664-373066626139/Search_Magnifying_Gl.svg" alt="Search" style="width: 20px; height: 20px; margin: 10px; cursor: pointer;">
    <input type="text" id="searchInputMobile" placeholder="Введите название тренинга или урока" style="border: none; outline: none; flex-grow: 1; padding: 5px; display: none;">
    <div id="searchResultsMobile" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: white; border: 1px solid #ccc; border-radius: 5px; max-height: 200px; overflow-y: auto; z-index: 1001;"></div>
  </div>
`;

const searchWrapperHTMLDesktop = `
  <div id="searchWrapper" style="width: 100%; background-color: #f8f8f8; padding: 10px; box-sizing: border-box;"></div>
`;

const searchContainerHTMLDesktop = `
  <div id="searchContainer" style="position: relative; z-index: 1000; display: flex; align-items: center; background-color: white; border-radius: 20px; padding: 0 10px;">
    <img src="https://static.tildacdn.info/tild3764-3665-4662-b664-373066626139/Search_Magnifying_Gl.svg" alt="Search" style="width: 20px; height: 20px; margin-right: 10px;">
    <input type="text" id="searchInput" placeholder="Введите название тренинга или урока" style="border: none; outline: none; flex-grow: 1;">
    <div id="searchResults" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: white; border: 1px solid #ccc; border-radius: 5px; max-height: 200px; overflow-y: auto; z-index: 1001;"></div>
  </div>
`;

// ======= Функция для определения, что мы в приложении (по примеру баннера) =======
function isApp() {
  // В оригинальном баннере приложение определялось через наличие .container
  // Здесь можно добавить более точную логику, если она есть в баннере
  // Например, если на странице есть .container — это сайт, иначе — приложение
  const container = document.querySelector('.container');
  return !container; // Если контейнера нет — значит, приложение
}

// ======= Функция для добавления поиска с проверкой блоков =======
function addSearchContainer() {
  const isMobile = window.innerWidth <= 768;
  const isTrainingPage = window.location.href.includes('/teach/control/stream/view/id/');
  const isLessonPage = window.location.href.includes('/pl/teach/control/lesson/view/');

  if (isMobile) {
    if (isApp()) {
      // Если это приложение на мобиле — вставляем поиск над баннером
      // Баннер, судя по коду, вставляется в .container (на сайте) или перед .xdget-root (в приложении)
      // Раз баннера нет в приложении (нет .container), вставим поиск в DOM там, где есть баннер или в начало body

      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(() => {
        attempts++;

        // Ищем баннер или элемент рядом с баннером, например .custom-banner (если он есть)
        const banner = document.querySelector('.custom-banner');
        if (banner) {
          clearInterval(interval);
          if (!document.querySelector('#searchContainerMobile')) {
            banner.insertAdjacentHTML('beforebegin', searchContainerHTMLMobile);
            setupMobileSearchHandlers();
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          // Если баннер не найден, вставляем поиск в начало body как fallback
          if (!document.querySelector('#searchContainerMobile')) {
            document.body.insertAdjacentHTML('afterbegin', searchContainerHTMLMobile);
            setupMobileSearchHandlers();
          }
        }
      }, 100);

    } else {
      // Мобильная версия сайта — вставляем в левую панель, как раньше
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(() => {
        attempts++;
        const leftBar = document.querySelector('.gc-account-leftbar');

        if (leftBar) {
          clearInterval(interval);
          if (!leftBar.querySelector('#searchContainerMobile')) {
            leftBar.insertAdjacentHTML('afterbegin', searchContainerHTMLMobile);
            setupMobileSearchHandlers();
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);
    }

  } else {
    // Десктопная версия
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;
      const breadcrumbs = document.querySelector('.breadcrumbs, .empty-breadcrumbs');
      const mainContentUser = document.querySelector('.gc-main-content.gc-both-main-content.no-menu.account-page-content.with-left-menu.gc-user-logined.gc-user-user');
      const mainContentAdmin = document.querySelector('.gc-main-content.gc-both-main-content.wide.account-page-content.with-left-menu.gc-user-logined.gc-user-admin');
      const targetMainContent = mainContentUser || mainContentAdmin;

      if (targetMainContent) {
        clearInterval(interval);
        if (!document.querySelector('#searchWrapper')) {
          targetMainContent.insertAdjacentHTML('afterbegin', searchWrapperHTMLDesktop);
          if (breadcrumbs) {
            breadcrumbs.insertAdjacentHTML('afterbegin', searchContainerHTMLDesktop);
          }
          setupDesktopSearchHandlers();
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }
}

// ======= Настройка обработчиков поиска для мобильной версии =======
function setupMobileSearchHandlers() {
  const searchContainer = document.getElementById('searchContainerMobile');
  const searchInput = document.getElementById('searchInputMobile');
  const searchIcon = searchContainer.querySelector('img');
  const searchResults = document.getElementById('searchResultsMobile');

  searchIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    const isExpanded = searchContainer.style.width === '72vw';
    searchContainer.style.width = isExpanded ? '40px' : '72vw';
    searchInput.style.display = isExpanded ? 'none' : 'block';
    searchResults.style.display = 'none';
    if (!isExpanded) searchInput.focus();
  });

  searchInput.addEventListener('input', () => {
    searchResults.style.display = 'block';
    searchResults.innerHTML = `<p>Результаты для "${searchInput.value}"</p>`;
  });

  document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target)) {
      searchContainer.style.width = '40px';
      searchInput.style.display = 'none';
      searchResults.style.display = 'none';
    }
  });
}

// ======= Настройка обработчиков поиска для десктопной версии =======
function setupDesktopSearchHandlers() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchResults.style.display = 'block';
      searchResults.innerHTML = `<p>Результаты для "${searchInput.value}"</p>`;
    });
  }
}

// ======= Обработчик поиска =======
$(document).ready(function () {
  let typingTimer;
  const typingDelay = 1000;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getData(searchStr, callback) {
    $.getJSON('/c/sa/search', { searchStr }, function (response) {
      if (response.success === true && Array.isArray(response.data.blocks)) {
        const results = response.data.blocks
          .filter(block => block.onClick?.url)
          .map(function (block) {
            const domain = window.location.origin;
            const fullUrl = domain + block.onClick.url;
            const isLesson = fullUrl.includes('lesson');
            return {
              isLesson,
              title: block.title || "Без названия",
              description: block.description || "Нет описания",
              image: block.logo?.image || null,
              url: fullUrl
            };
          });
        callback(results);
      } else {
        callback([]);
      }
    });
  }

  function renderResults(results, searchResults) {
    if (results.length > 0) {
      const lessons = results.filter(result => result.isLesson);
      const trainings = results.filter(result => !result.isLesson);

      let resultItems = '';

      if (trainings.length > 0) {
        resultItems += '<h2>Тренинги</h2>';
        resultItems += trainings.map(result => `
          <div class="result-item training-item">
            ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}">Перейти к тренингу</a>
          </div>
        `).join('');
      }

      if (lessons.length > 0) {
        resultItems += '<h2>Уроки</h2>';
        resultItems += lessons.map(result => `
          <div class="result-item lesson-item">
            ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}">Перейти к уроку</a>
          </div>
        `).join('');
      }

      searchResults.innerHTML = resultItems;
      searchResults.style.display = 'block';

    } else {
      searchResults.innerHTML = '<p>Результаты не найдены</p>';
      searchResults.style.display = 'block';
    }
  }

  function onSearchInput(inputElement, searchResultsElement) {
    const query = inputElement.value.trim();
    if (query.length < 2) {
      searchResultsElement.style.display = 'none';
      return;
    }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      getData(query, function (results) {
        renderResults(results, searchResultsElement);
      });
    }, typingDelay);
  }

  // Инициализация поиска для мобильного и десктопного вариантов
  function initSearchHandlers() {
    if (isMobile()) {
      const inputMobile = document.getElementById('searchInputMobile');
      const resultsMobile = document.getElementById('searchResultsMobile');
      if (inputMobile && resultsMobile) {
        inputMobile.addEventListener('input', () => onSearchInput(inputMobile, resultsMobile));
      }
    } else {
      const inputDesktop = document.getElementById('searchInput');
      const resultsDesktop = document.getElementById('searchResults');
      if (inputDesktop && resultsDesktop) {
        inputDesktop.addEventListener('input', () => onSearchInput(inputDesktop, resultsDesktop));
      }
    }
  }

  // Запуск
  addSearchContainer();

  // Запускаем после вставки DOM
  setTimeout(() => {
    initSearchHandlers();
  }, 1500);
});
