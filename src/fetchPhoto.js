const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const key = '25115953-d8d8be010bf370a8ff97eb4f1';

async function getPhoto(inputText, pageParam) {
  const searchParam = new URLSearchParams({
    key: `${key}`,
    q: `${inputText}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  try {
    const response = await axios.get(`${BASE_URL}?${searchParam}&per_page=190&page=${pageParam}`);
    return await response;
  } catch (error) {
    console.error(error);
  }
}

export default { getPhoto };
