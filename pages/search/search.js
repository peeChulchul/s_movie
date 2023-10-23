// 임폴트
import { makeModal, exitModal, makeCards, toggleDisplay, initDisplay } from '../../components/global.js';
import { options, fetchApi } from '../../components/api.js';
import { submitFrom } from '../../components/submit.js';
// dom요소 및 이벤트 부착

const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');
const $cardContainer = document.querySelector('.card_container');
const $addMovieBtn = document.querySelector('.addMovie_btn');
const $scrollUp = document.querySelector('.scroll_up');
const $main = document.querySelector('#main');
const $title = document.createElement('h1');
const $btnDay = document.querySelector('.header__mode_icon.sun');
const $btnNight = document.querySelector('.header__mode_icon.moon');
const $fromContainer = document.querySelector('.from_container');
const $miniFrom = document.querySelector('.mini_from');
const $miniFromInput = document.querySelector('.mini_from__input');
const $loading = document.querySelectorAll('.loading');
const $footer = document.querySelector('#footer');

toggleDisplay($btnDay);
toggleDisplay($btnNight);
$miniFrom.addEventListener('submit', miniSubmit);
$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input));
$addMovieBtn.addEventListener('click', onClickAddMovie);
$scrollUp.addEventListener('click', () => {
    window.scrollTo(0, 0);
});
window.onload = () => initFn(searchMovies);

// q는 세션에 저장해둔 검색어이다. 페이지는 기본 1페이지로 저장해두었다.
const q = sessionStorage.getItem('q');
let page = 1;
$input.value = q;

// Dom요소인 $title에 택스트와 클래스를추가해주고 $main의 맨앞으로 배치해준다.
$title.textContent = `'${q}' 검색결과 `;
$title.classList.add('search__title');
$fromContainer.prepend($title);
//

// 인터센션옵저버
const ioOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
};
const callback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            onClickAddMovie();
        }
    });
};

let io = new IntersectionObserver(callback, ioOptions);

// 데이터로 받아와야할 Promise다.
const searchMovies = fetch(
    `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
    options
).then((promise) => promise.json());

let isLoading = true;

async function initFn(promise) {
    initDisplay();
    $loading.forEach((element) => element.classList.add('active'));

    // 모듈에서 가져온 fetchapi를 통해 데이터가 가져온다.
    const searchJson = await fetchApi([promise]);

    // 결과값이 없을수도없기때문에 결과값이 없을경우를 empty로 선언해주었다.
    const { results } = searchJson;
    const empty = results.length <= 0;

    isLoading = results.length > 1 ? false : true;
    !isLoading && $loading.forEach((element) => element.classList.remove('active'));
    !isLoading && io.observe($footer);
    // $addMovieBtn은 다음페이지의 데이터를 불러오는 버튼으로 현재페이지가 마지막페이지인경우 display:none으로 만들어줬다.
    if (page === searchJson.total_pages) {
        console.log(searchJson.total_pages);
        $addMovieBtn.style.display = 'none';
        io.disconnect($footer);
    } else {
        $addMovieBtn.style.display = 'block';
    }

    // 결과값이 없는 경우 '검색결과가 존재하지않습니다.'를 출력시켜주었다.
    // 결과가 있을경우 모듈에서 가져온 makeCards를 통해 결과수만큼의 카드를 만들어주었다.
    if (empty) {
        const emptyText = document.createElement('h1');
        emptyText.textContent = '검색결과가 존재하지않습니다.';
        emptyText.classList.add('search__empty');
        console.log(emptyText);
        $main.append(emptyText);
    } else {
        results.forEach((result) => {
            makeCards(result, $cardContainer, (e) => makeModal(e, result, $backDrop, $modal));
        });
    }
}

// 데이터를 더 가져오는 함수이다.
// 페이지를 증가시키며 위에선언된 fetchMovies에 가져와야할 페이지의 데이터가 담긴 promise를 전달하여 해당 값을 가지고 카드를 만들게된다.
function onClickAddMovie() {
    page++;
    const addMovieList = fetch(
        `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
        options
    ).then((promise) => promise.json());
    return initFn(addMovieList);
}

function miniSubmit(e) {
    e.preventDefault();
    const cards = document.querySelectorAll('.card');
    const inputValue = $miniFromInput.value.toUpperCase();
    cards.forEach((card) => {
        const data = card.dataset.title.toUpperCase();
        const viewCard = data.includes(inputValue);
        if (!viewCard) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
            card.animate(
                [
                    { transform: 'translateX(20%)', opacity: 0.5 },
                    { transform: 'translateX(0%)', opacity: 1 },
                ],
                {
                    duration: 300,
                }
            );
        }
    });
}
