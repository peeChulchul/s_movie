// 임포트
import { options, fetchApi } from './components/api.js';
import { makeModal, exitModal, makeCards, toggleDisplay, initDisplay, throttling } from './components/global.js';
import { submitFrom } from './components/submit.js';
// Dom
const $cardCarousels = document.querySelectorAll('.card_carousel');
const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');
const $btnDay = document.querySelector('.header__mode_icon.sun');
const $btnNight = document.querySelector('.header__mode_icon.moon');
const $loading = document.querySelectorAll('.loading');

// counter
const counter = {
    popular: 0,
    topRated: 0,
    nowPlaying: 0,
};

// 로딩의 상태
let isLoading = true;

// 버튼등록
toggleDisplay($btnDay);
toggleDisplay($btnNight);

// view카드는 캐러셀에 보여줄 카드의 갯수이다.
let viewCard;

// searchHtml은 submit시 보여줄 html의 경로이다.
const searchHtml = '../pages/search/search.html';

// 이벤드 부착
$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input, searchHtml));
window.addEventListener('resize', getOuterWidth);
window.onload = initFn;

// 화면크기에 따라 캐서셀에서 보여줄 이미지의 갯수를 정하는 함수이다.
function getOuterWidth() {
    viewCard = 5;

    if (window.outerWidth <= 580) {
        viewCard = 2;
        return;
    }
    if (window.outerWidth <= 768) {
        viewCard = 3;
        return;
    }
    if (window.outerWidth <= 1200) {
        viewCard = 4;
        return;
    }
}

// 카테고리명과 각각 다른 카테고리의 영화데이터를 가진 Promise다.
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

async function initFn() {
    // 현재 디스플레이모드를 세션에 저장된 값으로 바꿔주는함수다.
    // getOuterWidth를 최초에 실행하여 viewCard수를 조건에 맞게 정해준다.
    initDisplay();
    getOuterWidth();

    // movies는 각 카테고리별 영화리스트들을 가진 배열이다.
    const movies = await fetchApi([Popular, TopRated, NowPlaying], categorys);

    // movies를 잘 가져온 경우에만 모든로딩을 없애준다.
    isLoading = movies.length > 1 ? false : true;
    !isLoading && $loading.forEach((element) => element.classList.remove('active'));

    // movies의 각카테고리마다 makeCarousels에 영화정보를 담아 실행시켰다.
    movies.forEach((movie) => makeCarousels(movie));
}

function makeCarousels(movies) {
    // cardCarousels는 3개가 있으며 각각 해당하는 카테고리명을 클레스로 가지고있다.
    // 클래스명을 통해 movies의 카테고리와 일치하는 클래스명을 가진 html요소를 찾아 container로 선언해줬다.
    const container = Array.from($cardCarousels).find((cardCarousel) =>
        cardCarousel.classList.contains(movies.category)
    );
    const { results } = movies;

    // 캐러셀은 뷰어=>슬라이더=>카드로 이뤄져있으며 뷰어에 overflow:hidden이 붙어있어 이전과 다음버튼을
    // container(슬라이더)가 아닌 뷰어의 자식으로 주고싶었기때문에 insertBefore를 사용하여 container의 부모와 container사이에
    // dom요소를 넣었다.
    // create 및 add 및 append....
    const next = document.createElement('button');
    const nextArrow = document.createElement('i');
    const prevArrow = document.createElement('i');
    const prev = document.createElement('button');
    prevArrow.classList.add('fa-solid');
    prevArrow.classList.add('fa-backward');
    prevArrow.classList.add('card__btn__icon');
    nextArrow.classList.add('fa-solid');
    nextArrow.classList.add('fa-forward');
    nextArrow.classList.add('card__btn__icon');
    next.classList.add('card__next');
    prev.classList.add('card__prev');
    next.appendChild(nextArrow);
    prev.appendChild(prevArrow);

    container.parentNode.insertBefore(prev, container);
    container.parentNode.insertBefore(next, container);

    // next 및 prev에 이벤트리스너 장착
    // throttling함수를 통해 400s동안은 중복클릭해도 동작하지않도록 하였다.
    next.addEventListener(
        'click',
        throttling((e) => onClickCardNav(e, container), 400)
    );
    prev.addEventListener(
        'click',
        throttling((e) => onClickCardNav(e, container), 400)
    );
    results.forEach((movie) => {
        // 영화의 수만큼 카드를 만들어서 어펜드 시켜준다 추가로 카드 클릭시 일어날 이벤트도 등록
        makeCards(movie, container, (e) => makeModal(e, movie, $backDrop, $modal));
    });
}

// 캐러셀 버튼 클릭이벤트
function onClickCardNav(e, container) {
    // 타겟의 클래스명을 통해 이전버튼인지 다음버튼인지 식별
    // 인자로 받은 컨테이너의 클래스명에서 카드 캐러셀을 제외한 클래스명을 반환 (카드캐러셀을 제외하면 카테고리명이 남는다.)
    // maxPage는 데이터를 각 20개씩만 받아오기때문에 20나누기 보여줄 카드 수를 하였다.
    // 소수점이 남으면 안되기때문에 Math.round로 반올림 해버렸다.
    const next = e.target.parentNode.classList.contains('card__next');
    const prev = e.target.parentNode.classList.contains('card__prev');
    const category = Array.from(container.classList).find((name) => name !== 'card_carousel');
    const maxPage = Math.round(20 / viewCard);

    // 전역 변수로 만들어둔 객체 counter는 키로 카테고리명을 벨류로 카운터(숫자)를 가지고있다.
    // 변수로 만들어둔 카테고리명과 같은 키를 통해 카운터를 찾고 카운터의 수에따라 다른 조건의 동작을 하도록 만들었다.
    // if문과 삼항연산자를 통해 현재 카운트와 맥스페이지를 비교하여 기능하도록 하였다.
    if (next && counter[category] < maxPage) {
        counter[category]++;
        container.style.transform = `translateX(-${counter[category] * 100}%)`;
        container.parentNode.children[0].style.display = 'block';
        e.target.parentNode.style.display = counter[category] === maxPage - 1 ? 'none' : 'block';
        return;
    }
    if (prev && counter[category] > 0) {
        counter[category]--;
        container.style.transform = `translateX(-${counter[category] * 100}%)`;
        container.parentNode.children[1].style.display = 'block';
        e.target.parentNode.style.display = counter[category] === 0 ? 'none' : 'block';
        return;
    }
}
