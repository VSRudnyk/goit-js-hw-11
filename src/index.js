import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchPhoto';
import getRefs from './get-refs';
import photoCardTpl from './templates/photo-cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
let searchQuery = '';
let totalHits = 0;
let pageParam = 1;

refs.searchPhotoCards.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMorePhoto);

function handleSubmit(e) {
  totalHits = 0;
  pageParam = 1;
  addBtnLoadMore();
  e.preventDefault();
  refs.cardContainer.innerHTML = '';
  searchQuery = e.target.elements.searchQuery.value;
  fetchPhoto(searchQuery, pageParam);
}

async function fetchPhoto(searchQuery, pageParam) {
  if (totalHits >= 500) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.setAttribute('disabled', 'disabled');
    return;
  }

  const photoCards = await API.getPhoto(searchQuery, pageParam);
  if (photoCards.data.totalHits === 0) {
    Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  totalHits += photoCards.data.hits.length;
  Notify.info(`Hooray! We found ${photoCards.data.totalHits} images.`);

  renderPhotoCards(photoCards);
  // bihaviorScroll();
  removeBtnLoadMore();
}

function onLoadMorePhoto() {
  fetchPhoto(searchQuery, (pageParam += 1));
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
  });
  lightbox.refresh();
}

function addBtnLoadMore() {
  refs.loadMoreBtn.classList.add('load-more');
}

function removeBtnLoadMore() {
  refs.loadMoreBtn.classList.remove('load-more');
}

// function bihaviorScroll() {
//   const { height: cardHeight } = refs.cardContainer.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
