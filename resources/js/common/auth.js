import { fetchConfig } from '/js/common/common.js';
const publicPages = ['/login', '/register', '/board', '/']; // NOTE : 로그인이 필요 없는 페이지
const config = await fetchConfig();
const apiUrl = config.apiUrl;

// NOTE : 인증 검사
const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = "/";
        return false; 
    }

    try {
        const response = await fetch(`${apiUrl}/auth`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('에러 메시지:', errorData.message);
            alert("로그인 후 이용해주세요.");
            window.location.href = "/";
            return false;
        }
        return true;
    } catch (error) {
        console.error('요청 중 오류 발생:', error);
        alert('서버에 연결할 수 없습니다.');
        window.location.href = "/";
        return false; 
    }
};

(async () => {
    if (!publicPages.includes(window.location.pathname)) {
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = "/";
            return;
        }
    }
})();

// NOTE : 뒤로가기 실행시에도 인증 확인하기 위해
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});
