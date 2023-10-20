// submit관련 요소들을 모듈화 하였다.

async function submitFrom(e, input, html) {
    // input은 Dom요소, html은 파일의 경로이다.
    const value = input.value;

    // 서브밋시 자동 새로고침을 막기위한 이벤트 기본동작정지
    e.preventDefault();
    if (value === '') {
        alert('검색창이 비어있습니다.');
        return;
    }

    //검색어를 세션에 저장하고 서치html로 이동을 목적으로 한 함수이며, 현재 경로가 서치일결우 페이지를 새로고침하도록 사용하고있다.
    sessionStorage.setItem('q', value);
    if (html) {
        location.href = html;
        return;
    } else {
        window.location.reload();
    }
}

export { submitFrom };
