import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchPhoto';
import getRefs from './get-refs';
import photoCardTpl from './templates/photo-cards.hbs';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
let searchQuery = '';

refs.searchPhotoCards.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMorePhoto);

function handleSubmit(e) {
  e.preventDefault();
  refs.cardContainer.innerHTML = '';
  searchQuery = e.target.elements.searchQuery.value;
  fetchPhoto(searchQuery);
}

async function fetchPhoto(searchQuery) {
  const photoCards = await API.getPhoto(searchQuery);
  renderPhotoCards(photoCards);
  disableBtnLoadMore();
}

function onLoadMorePhoto() {
  fetchPhoto(searchQuery);
}

function renderPhotoCards(photo) {
  photo.data.hits.map(
    ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      refs.cardContainer.insertAdjacentHTML(
        'beforeend',
        photoCardTpl({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }),
      );
    },
  );
  runSimpleLightbox();
}

function runSimpleLightbox() {
  var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    refresh: true,
  });
}

function disableBtnLoadMore() {
  refs.loadMoreBtn.classList.remove('load-more');
}
