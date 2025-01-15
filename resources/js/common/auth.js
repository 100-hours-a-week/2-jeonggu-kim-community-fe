// /js/common/auth.js
const auth = {
    /**
     * 로그인 여부 확인 함수
     * @returns {boolean} 로그인 여부
     */
    isLoggedIn: function () {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        const expireTime = localStorage.getItem('expireTime');
        const currentTime = new Date().getTime();

        if (loggedIn && expireTime && currentTime < expireTime) {
            return true;
        }

        return false;
    },

    /**
     * 로그인 상태 강제 확인 함수
     * 로그인하지 않았을 경우 로그인 페이지로 리다이렉트
     */
    requireLogin: function () {
        if (!this.isLoggedIn()) {
            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            window.location.href = '/';
        }
    },

    /**
     * 로그인 처리 함수
     * @param {string} token - 사용자 세션 토큰 (선택)
     */
    setLogin: function (token, hours = 1) {
        const expireTime = new Date().getTime() + hours * 60 * 60 * 1000; // 현재 시간 + 시간(ms)
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('expireTime', expireTime);
        if (token) {
            localStorage.setItem('session_token', token);
        }
        console.log('로그인되었습니다.');
    },

    /**
     * 로그아웃 처리 함수
     * 로그아웃 시 로컬스토리지 및 세션 토큰 삭제 후 로그인 페이지로 이동
     */
    logout: function () {
        localStorage.removeItem('loggedIn'); 
        localStorage.removeItem('expireTime'); 
        localStorage.removeItem('session_token'); 
        alert('로그아웃되었습니다.');
        window.location.href = '/login';
    },

    /**
     * 현재 로그인된 사용자 정보 가져오기
     * @returns {object|null} 로그인된 사용자 정보 또는 null
     */
    getUserInfo: function () {
        if (!this.isLoggedIn()) return null;
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    /**
     * 사용자 정보 설정 함수
     * @param {object} userInfo - 사용자 정보 객체
     */
    setUserInfo: function (userInfo) {
        if (typeof userInfo === 'object') {
            localStorage.setItem('user_info', JSON.stringify(userInfo));
        }
    },

    /**
     * 로그아웃 버튼 추가 핸들러
     * @param {string} selector - 로그아웃 버튼의 CSS 선택자
     */
    addLogoutButtonHandler: function (selector) {
        const logoutButton = document.querySelector(selector);
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.logout();
            });
        }
    }
};

export default auth;
