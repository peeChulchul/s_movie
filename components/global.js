function exitModal(backDrop, modal) {
    // 모달과 백드롭을 사라지게해주는 함수이다.
    backDrop.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function makeModal(e, movie, backDrop, modal) {
    // 이전페이지 및 다음페이지 없을시 버튼에 상태를 변경해주는거 추가해야함

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
    if (movie.backdrop_path === null) {
        return;
    }
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = movie.id;
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
    container.appendChild(card);
    card.addEventListener('click', modalfn);
}

function toggleDisplay(button) {
    button.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        isDark ? sessionStorage.setItem('display', 'dark') : sessionStorage.setItem('display', 'light');
    });
}

function initDisplay() {
    const display = sessionStorage.getItem('display');
    display === 'dark' ? document.body.classList.add('dark') : document.body.classList.remove('dark');
}

export { makeModal, exitModal, makeCards, toggleDisplay, initDisplay };
