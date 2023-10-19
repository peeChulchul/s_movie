async function submitFrom(e, input, html) {
    // 서브밋시 자동 새로고침을 막기위한 이벤트 기본동작정지
    e.preventDefault();
    const value = input.value;
    sessionStorage.setItem('q', value);
    return (location.href = html);
}

export { submitFrom };
