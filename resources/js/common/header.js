// 공통 헤더 생성 함수
function createHeader() {
    const currentUrl = window.location.href.split('/').pop();
    let headerHTML = ``;
    if (currentUrl !== ("login") && currentUrl !== ("board") && currentUrl !== ("")) {
        headerHTML += `<div><img class="back-icon" src="/images/back_icon.png" alt="뒤로가기"></div>`;
    }
    headerHTML += `<h2>Jeonggu.kim's BOARD</h2>`;
    // NOTE : 조건에 따라 headerHTML 추가
    if (currentUrl !== ("login") && currentUrl !== ("register") && currentUrl !== ("")) {
        headerHTML += `<!-- NOTE : profile menu -->
                <div class="profile-container">
                    <div class="profile-icon"><img class="width-40" src="/images/cloud-icon-v.2.png" alt="프로필"></div>
                    <div class="profile-menu" style="display:none;">
                        <button class="text-center header-menu" id="btn_profile_menu">회원정보수정</button>
                        <button class="text-center header-menu" id="btn_pwd_menu">비밀번호수정</button>
                        <button class="text-center header-menu" id="btn_logout_menu">로그아웃</button>
                    </div>
                </div>`;
    }
    // 헤더 삽입
    document.getElementById('header').innerHTML = headerHTML;

    // 필요한 이벤트 리스너 추가
    setupHeaderEvents();
}

// 헤더의 이벤트 설정
function setupHeaderEvents() {
    // NOTE: 주요 요소 선택
    const profileMenu = document.querySelector(".profile-menu");
    const profileIcon = document.querySelector(".profile-icon");
    const backIcon = document.querySelector(".back-icon");
    const btnProfileMenu = document.getElementById("btn_profile_menu");
    const btnPwdMenu = document.getElementById("btn_pwd_menu");
    const btnLogoutMenu = document.getElementById("btn_logout_menu");
    const header = document.querySelector(".header h2");
    const profileContainer = document.querySelector(".profile-container");

    // NOTE: 프로필 아이콘 클릭 시 메뉴 토글
    if (profileIcon) {
        profileIcon.addEventListener("click", () => {
            if (profileMenu) {
                profileMenu.style.display = profileMenu.style.display === "none" || !profileMenu.style.display ? "block" : "none"; // NOTE : (수정) 조건문을 단일 줄로 축약
            }
        });
    }
    
    if (profileContainer && profileMenu) {
        // NOTE: 아이콘에 마우스를 올리면 메뉴 보이기
        profileContainer.addEventListener("mouseover", () => {
            profileMenu.style.display = "block";
        });

        // NOTE: 아이콘에서 마우스를 떼면 메뉴 숨기기
        profileContainer.addEventListener("mouseleave", () => {
            profileMenu.style.display = "none";
        });
    }

    // NOTE: 뒤로가기 버튼 클릭 시
    if (backIcon) {
        backIcon.addEventListener("click", () => {
            const currentUrl = window.location.href;
            const data = window.location.href.split("?");

            const routes = {
                register: "/",
                boardInfo: "/board",
                boardAdd: "/board",
                userEdit: "/board",
                boardEdit: "/boardInfo" + "?" + data[1],
            };
    
            for (const key in routes) {
                if (currentUrl.includes(key)) {
                    window.location.href = routes[key];
                    return;
                }
            }
    
            // NOTE : 조건에 맞는 경로가 없으면 기본 뒤로 가기
            window.history.back();
        });
    }

    // NOTE: 회원정보 수정 버튼 클릭 시
    if (btnProfileMenu) {
        btnProfileMenu.addEventListener("click", () => {
            window.location.href = "/userEdit?type=user";
        });
    }

    // NOTE: 비밀번호 수정 버튼 클릭 시
    if (btnPwdMenu) {
        btnPwdMenu.addEventListener("click", () => {
            window.location.href = "/userEdit?type=password";
        });
    }

    // NOTE: 로그아웃 버튼 클릭 시
    if (btnLogoutMenu) {
        btnLogoutMenu.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/";
        });
    }

    // NOTE: 헤더 제목 클릭 시
    if (header) {
        header.addEventListener("click", () => {
            const currentUrl = window.location.href.split('/').pop();
            if (currentUrl !== ("login") && currentUrl !== ("register") && currentUrl !== ("")) {
                window.location.href = "/board";
            }
        });
    }
}

// NOTE : 페이지 로드 시 헤더 생성
document.addEventListener('DOMContentLoaded', createHeader);


// NOTE : 파일 취소를 진행할 때 마우스 커서 풀리는 부분 관련 적용
const fileInputs = document.querySelectorAll('input[type="file"]');

fileInputs.forEach(fileInput => {
    fileInput.addEventListener('click', () => {
        document.body.style.cursor = "url('../../images/cloud-icon-v.1.png'), auto";
        fileInput.style.cursor = "url('../../images/cloud-icon-v.1.png'), auto";
    });

    fileInput.addEventListener('change', () => {
        if (!fileInput.value) {
            document.body.style.cursor = "url('../../images/cloud-icon-v.1.png'), auto";
            fileInput.style.cursor = "url('../../images/cloud-icon-v.1.png'), auto";
        }
    });
});
window.addEventListener('focus', () => {
    document.body.style.cursor = "url('../../images/cloud-icon-v.1.png'), auto";
    fileInputs.forEach(fileInput => {
        fileInput.style.cursor = "url('../../images/cloud-icon-v.1.png'), auto";
    });
});