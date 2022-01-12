import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PhotoApiService from './fetchPhoto';
import getRefs from './get-refs';
import photoCardTpl from './templates/photo-cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
const photoApiService = new PhotoApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', loadMore);

function onSearch(e) {
  e.preventDefault();
  photoApiService.query = e.currentTarget.elements.searchQuery.value;
  refs.loadMoreBtn.disabled = false;
  photoApiService.resetPage();
  clearPhotoCardContainer();
  fetchPhoto();
}

async function fetchPhoto() {
  try {
    if (photoApiService.query === '') {
      return Notify.failure('Please enter your request!');
    }
    const photoCards = await photoApiService.fetchPhoto();
    const {
      data: { hits, totalHits },
    } = photoCards;

    if (totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    if (photoApiService.getPage() === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    photoMarkup(hits);
    photoApiService.incrementPage();
  } catch (error) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.disabled = true;
    console.log(error.message);
  }

  simpleLightbox();
}

function photoMarkup(hits) {
  refs.cardContainer.insertAdjacentHTML('beforeend', photoCardTpl(hits));
  refs.loadMoreBtn.classList.remove('load-more');
}

function loadMore() {
  fetchPhoto();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearPhotoCardContainer() {
  refs.cardContainer.innerHTML = '';
}

function simpleLightbox() {
  var lightbox = new SimpleLightbox('.gallery a', {});
  lightbox.refresh();
}
