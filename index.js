import { options, fetchApi } from './components/api.js';
import { makeModal, exitModal, makeCards } from './components/global.js';
import { submitFrom } from './components/submit.js';
// Dom
const $cardCarousels = document.querySelectorAll('.card_carousel');
const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');

$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input, '../pages/search/index.html'));
// counter
const counter = {
    popular: 0,
    topRated: 0,
    nowPlaying: 0,
};

const categorys = ['popular', 'topRated', 'nowPlaying'];

const Popular = fetch(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`, options).then((data) =>
    data.json()
);
const TopRated = fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`, options).then((data) =>
    data.json()
);
const NowPlaying = fetch(`https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1`, options).then((data) =>
    data.json()
);

(async function fetchMovies() {
    // 선언과 동시에 실행되는함수

    //await promis.all을 동기로 동작  내부에서는 api들을 비동기처리
    const movies = await fetchApi([Popular, TopRated, NowPlaying], categorys);
    movies.forEach((movie) => makeCarousels(movie));
})();

function makeCarousels(movies) {
    // 클래스명을 통해 카테고리와 일치하는 클래스명을 가진 html요소를 찾는다.
    const container = Array.from($cardCarousels).find((cardCarousel) =>
        cardCarousel.classList.contains(movies.category)
    );
    const { results } = movies;

    // create 및 add 및 append....
    const next = document.createElement('button');
    const nextArrow = document.createElement('i');
    const prevArrow = document.createElement('i');
    const prev = document.createElement('button');
    prevArrow.classList.add('fa-solid');
    prevArrow.classList.add('fa-backward');
    nextArrow.classList.add('fa-solid');
    nextArrow.classList.add('fa-forward');
    next.classList.add('card__next');
    prev.classList.add('card__prev');
    next.appendChild(nextArrow);
    prev.appendChild(prevArrow);

    container.parentNode.insertBefore(prev, container);
    container.parentNode.insertBefore(next, container);

    // next 및 prev에 이벤트리스너 장착

    next.addEventListener('click', (e) => onClickCardNav(e, container));
    prev.addEventListener('click', (e) => onClickCardNav(e, container));

    // 로직 분리 필요
    results.forEach((movie) => {
        // 영화의 수만큼 카드를 만들어서 어펜드 시켜준다 추가로 카드 클릭시 일어날 이벤트도 등록
        makeCards(movie, container, (e) => makeModal(e, movie, $backDrop, $modal));
    });
}

// 캐러셀 클릭이벤트
function onClickCardNav(e, container) {
    // 타겟의 클래스명을 통해 이전버튼인지 다음버튼인지 식별
    // 인자로 받은 컨테이너의 클래스명에서 카드 캐러셀을 제외한 클래스명을 반환 (카드캐러셀을 제외하면 카테고리명이 남는다.)
    const next = e.currentTarget.classList.contains('card__next');
    const prev = e.currentTarget.classList.contains('card__prev');
    const category = Array.from(container.classList).find((name) => name !== 'card_carousel');

    // 전역 변수로 만들어둔 객체 counter는 키로 카테고리명을 벨류로 카운터를 가지고있다.
    // 변수로 만들어둔 카테고리명과 같은 키를 통해 카운터를 찾고 카운터의 수에따라 다른 조건의 동작을 하도록 만들었다.
    if (next && counter[category] < 3) {
        counter[category]++;
        container.style.transform = `translateX(-${counter[category] * 100}%)`;
        e.currentTarget.parentNode.children[0].style.display = 'block';
        e.currentTarget.style.display = counter[category] === 3 ? 'none' : 'block';
        return;
    }
    if (prev && counter[category] > 0) {
        counter[category]--;
        container.style.transform = `translateX(-${counter[category] * 100}%)`;
        e.currentTarget.parentNode.children[1].style.display = 'block';
        e.currentTarget.style.display = counter[category] === 0 ? 'none' : 'block';
        return;
    }
}
