// 공통적으로 쓰이는 함수들을 모듈화 하였다.

function exitModal(backDrop, modal) {
    // backDrop및 modal 은 Dom요소이다.
    // 모달과 백드롭을 사라지게해주는 함수이다.
    backDrop.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function makeModal(e, movie, backDrop, modal) {
    // backDrop,modal Dom요소 movie는 영화이다.

    // 영화카드 클릭시 실행되는 함수로 백드롭과 모달을 엑티브 시켜주며 모달안에 인자로받은 영화에대한 정보를 담아준다.
    backDrop.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const exitModalBtn = document.createElement('button');
    const exitIcon = document.createElement('i');
    exitIcon.classList.add('fa-solid');
    exitIcon.classList.add('fa-x');
    exitModalBtn.classList.add('modal__exitBtn');
    exitModalBtn.append(exitIcon);
    exitModalBtn.addEventListener('click', () => exitModal(backDrop, modal));

    const modalHtml = `
    <div class="modal__top">
        <div class="modal__bg" style="background-image: url('https://image.tmdb.org/t/p/original/${
            movie.backdrop_path
        }')"></div>
        <h1 class="modal__title">${movie.title}(${movie.release_date.split('-')[0]})</h1>
        <span   style=" margin:0px 6px;
                        text-align: center;
                        display: inline-block;
                        background-color: white;
                        padding:2px 4px;
                        color: black;
                        font-weight: bold;
                        font-size: 18px;
                        border-radius: 4px;">
                        ${Math.round(movie.vote_average * 10) / 10}</span>
        <button style="color: white;" onClick="alert('영화 ID:' + ${movie.id})">ID</button>
    </div>
    <div class="modal__buttom">
        <p>${movie.overview}</p>
    </div>
`;

    modal.innerHTML = modalHtml;
    modal.append(exitModalBtn);
}

function makeCards(movie, container, modalfn) {
    // movie는 영화정보이다, container는 Dom요소 , modalfn은 실질적으로 위에 선언된 makeModal함수이다.
    if (movie.backdrop_path === null) {
        return;
    }
    // 데이터중에 이미지가없는 데이터가있길래 아예 제거해버렸다.

    // 카드를 만들고 해당 요소에 스타일 이벤트 클래스를 부여하고 container에 어펜드시킨다.
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = movie.id;
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
    container.appendChild(card);
    card.addEventListener('click', modalfn);
}

function toggleDisplay(button) {
    // button은 Dom요소이다.

    // 버튼에 클릭이벤트를 부착하였다. 현재모드를 세션스토리지에 저장시켰다.
    button.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        isDark ? sessionStorage.setItem('display', 'dark') : sessionStorage.setItem('display', 'light');
    });
}

function initDisplay() {
    // 화면출력시 시작 세션스토리지에 저장된 디스플레이모드를 확인하여 바디에 맞는 클레스명을 부여하도록하였다.
    const display = sessionStorage.getItem('display');
    display === 'dark' ? document.body.classList.add('dark') : document.body.classList.remove('dark');
}

export { makeModal, exitModal, makeCards, toggleDisplay, initDisplay };
