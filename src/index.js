import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PhotoApiService from './fetchPhoto';
import getRefs from './get-refs';
import photoCardTpl from './templates/photo-cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let totalPerPage = 0;
const refs = getRefs();
const photoApiService = new PhotoApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  photoApiService.query = e.currentTarget.elements.searchQuery.value;

  if (photoApiService.query === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  photoApiService.resetPage();

  fetchPhoto();
  clearPhotoCardContainer();
}

async function fetchPhoto() {
  try {
    const photoCards = await photoApiService.fetchArticles();
    const {
      data: { hits, totalHits },
    } = photoCards;
    totalPerPage += photoApiService.per_page;
    console.log(totalPerPage);
    if (totalHits === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    if (totalPerPage >= totalHits) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    photoMarkup(hits);
    photoApiService.incrementPage();
  } catch (error) {
    console.log(error.message);
  }
  simpleLightbox();
}

function photoMarkup(hits) {
  refs.cardContainer.insertAdjacentHTML('beforeend', photoCardTpl(hits));
}

function clearPhotoCardContainer() {
  refs.cardContainer.innerHTML = '';
}

function simpleLightbox() {
  var lightbox = new SimpleLightbox('.gallery a', {});
  lightbox.refresh();
}

function checkPosition() {
  // Нам потребуется знать высоту документа и высоту экрана.
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  // Они могут отличаться: если на странице много контента,
  // высота документа будет больше высоты экрана (отсюда и скролл).

  // Записываем, сколько пикселей пользователь уже проскроллил.
  const scrolled = window.scrollY;

  // Обозначим порог, по приближении к которому
  // будем вызывать какое-то действие.
  // В нашем случае — четверть экрана до конца страницы.
  const threshold = height - screenHeight / 4;

  // Отслеживаем, где находится низ экрана относительно страницы.
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    // Если мы пересекли полосу-порог, вызываем нужное действие.
    fetchPhoto();
  }
}

(() => {
  window.addEventListener('scroll', checkPosition);
  window.addEventListener('resize', checkPosition);
})();
