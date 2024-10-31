document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const email = document.getElementById("txt_email").value;
    const password = document.getElementById("txt_pwd").value;
    const helperText = document.getElementById("p_helper_text");

    try {
        // const response = await fetch('/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ email, password })
        // });

        // const result = await response.json();

        // if (response.ok) {
            // NOTE : 로그인 성공 시 /board로 리다이렉션
            window.location.href = '/board';
        // } else {
        //     helperText.textContent = result.message || '로그인 실패';
        // }
    } catch (error) {
        console.error('로그인 요청 오류:', error);
        helperText.textContent = '로그인 중 오류가 발생했습니다.';
    }
});