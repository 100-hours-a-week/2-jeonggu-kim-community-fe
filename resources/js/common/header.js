// 공통 헤더 생성 함수
function createHeader() {
    const currentUrl = window.location.href.split('/').pop();
    let headerHTML = ``;
    if (currentUrl !== ("login")) {
        headerHTML += `<div><img class="back-icon" src="/images/back_icon.png" alt="뒤로가기"></div>`;
    }
    headerHTML += `<h2>Jeonggu.kim's BOARD</h2>`;
    // 조건에 따라 headerHTML 추가
    if (currentUrl !== ("login") && currentUrl !== ("register")) {
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
            window.location.href = "/login";
        });
    }

    // NOTE: 헤더 제목 클릭 시
    if (header) {
        header.addEventListener("click", () => {
            const currentUrl = window.location.href.split('/').pop();
            if (currentUrl !== ("login") && currentUrl !== ("register")) {
                window.location.href = "/board";
            }
        });
    }
}

// 페이지 로드 시 헤더 생성
document.addEventListener('DOMContentLoaded', createHeader);