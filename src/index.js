import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchPhoto';
import getRefs from './get-refs';
import photoCardTpl from './templates/photo-cards.hbs';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

refs.searchPhotoCards.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  refs.cardContainer.innerHTML = '';
  const searchQuery = e.target.elements.searchQuery.value;

  const photoCards = await API.getPhoto(searchQuery);
  renderPhotoCards(photoCards);
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
  var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    refresh: true,
  });
}
