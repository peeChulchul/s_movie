function makeModal(e, movie, backDrop, modal) {
    // 이전페이지 및 다음페이지 없을시 버튼에 상태를 변경해주는거 추가해야함

    // 영화카드 클릭시 실행되는 함수로 백드롭과 모달을 엑티브 시켜주며 모달안에 인자로받은 영화에대한 정보를 담아준다.
    backDrop.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const modalHtml = `<div class="modal__top">
    <div
    class="modal__bg"
    style="background-image: url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')"
></div>
    <h1 class="modal__title">
    ${movie.title}(${movie.release_date.split('-')[0]})
    <span
        style="
            text-align: center;
            display: inline-block;
            background-color: white;
            padding:2px 4px;
            color: black;
            font-weight: bold;
            font-size: 18px;
            border-radius: 4px;
        "
        >${Math.round(movie.vote_average * 10) / 10}</span
    >
</h1>
</div>
<div class="modal__buttom">
<p>
   ${movie.overview}
</p>
</div>


`;

    modal.innerHTML = modalHtml;
}

function exitModal(backDrop, modal) {
    // 모달과 백드롭을 사라지게해주는 함수이다.
    backDrop.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function makeCards(movie, container, modalfn) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = movie.id;
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
    container.appendChild(card);
    card.addEventListener('click', modalfn);
}

export { makeModal, exitModal, makeCards };
