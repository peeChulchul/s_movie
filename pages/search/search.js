import { makeModal, exitModal, makeCards } from '../../components/global.js';
import { options, fetchApi } from '../../components/api.js';
import { submitFrom } from '../../components/submit.js';
// dom

const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');
const $cardContainer = document.querySelector('.card_container');
// event
$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input, './'));

const q = sessionStorage.getItem('q');
$input.value = q;
const searchMovies = fetch(
    `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=1`,
    options
).then((promise) => promise.json());

(async function fetchMovies() {
    const searchJson = await fetchApi([searchMovies]);
    const { results } = searchJson;

    results.forEach((result) => {
        makeCards(result, $cardContainer, (e) => makeModal(e, result, $backDrop, $modal));
    });
})();
