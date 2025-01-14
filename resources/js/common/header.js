// NOTE : 공통 헤더 생성 함수
function createHeader() {
    const currentUrl = window.location.href.split('/').pop();

    // NOTE : 헤더 컨테이너 가져오기
    const headerContainer = document.getElementById('header');
    if (!headerContainer) return;

    // NOTE : 기존 헤더 내용 제거
    while (headerContainer.firstChild) {
        headerContainer.removeChild(headerContainer.firstChild);
    }

    // NOTE : 1. 뒤로가기 버튼
    if (currentUrl !== "login" && currentUrl !== "board" && currentUrl !== "") {
        const backDiv = document.createElement('div');
        const backImg = document.createElement('img');
        backImg.classList.add('back-icon');
        backImg.src = "/images/back_icon.png";
        backImg.alt = "뒤로가기";
        backDiv.appendChild(backImg);
        headerContainer.appendChild(backDiv);
    }

    // NOTE : 2. 알림 아이콘 (게시판 페이지일 때만)
    if (currentUrl === "board") {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('header-icon', 'notification-icon');
        notificationDiv.id = 'div_notification';
        const notificationImg = document.createElement('img');
        notificationImg.classList.add('width-40');
        notificationImg.src = "/images/notification-icon.png";
        notificationImg.alt = "알림";
        notificationDiv.appendChild(notificationImg);
        headerContainer.appendChild(notificationDiv);
    }

    // NOTE : 3. 제목 추가
    const title = document.createElement('h2');
    title.textContent = "Jeonggu.kim's BOARD";
    headerContainer.appendChild(title);

    // NOTE : 4. 프로필 메뉴
    if (currentUrl !== "login" && currentUrl !== "register" && currentUrl !== "") {
        const profileContainer = document.createElement('div');
        profileContainer.classList.add('profile-container');

        const profileIconDiv = document.createElement('div');
        profileIconDiv.classList.add('header-icon', 'profile-icon');

        const profileImg = document.createElement('img');
        profileImg.classList.add('width-40');
        profileImg.src = "/images/cloud-icon-v.2.png";
        profileImg.alt = "프로필";
        profileIconDiv.appendChild(profileImg);

        const profileMenu = document.createElement('div');
        profileMenu.classList.add('profile-menu');
        profileMenu.style.display = 'none';

        // NOTE : 프로필 메뉴 버튼 생성 함수
        const createMenuButton = (id, text) => {
            const button = document.createElement('button');
            button.classList.add('text-center', 'header-menu');
            button.id = id;
            button.textContent = text;
            return button;
        };

        // NOTE : 알림 버튼
        // const notificationButton = createMenuButton('btn_notification_menu', '알림');
        // const notificationIcon = document.createElement('span');
        // notificationIcon.classList.add('notification-icon');
        // notificationButton.appendChild(notificationIcon);
        // profileMenu.appendChild(notificationButton);

        // NOTE : 회원정보수정, 비밀번호수정, 로그아웃 버튼
        profileMenu.appendChild(createMenuButton('btn_profile_menu', '회원정보수정'));
        profileMenu.appendChild(createMenuButton('btn_pwd_menu', '비밀번호수정'));
        profileMenu.appendChild(createMenuButton('btn_logout_menu', '로그아웃'));

        profileContainer.appendChild(profileIconDiv);
        profileContainer.appendChild(profileMenu);
        headerContainer.appendChild(profileContainer);
    }

    // NOTE : 필요한 이벤트 리스너 추가
    setupHeaderEvents();
}


// NOTE : 헤더의 이벤트 설정
function setupHeaderEvents() {
    // NOTE : NOTE: 주요 요소 선택
    const profileMenu = document.querySelector(".profile-menu");
    const profileIcon = document.querySelector(".profile-icon");
    const backIcon = document.querySelector(".back-icon");
    const btnProfileMenu = document.getElementById("btn_profile_menu");
    const btnPwdMenu = document.getElementById("btn_pwd_menu");
    const btnLogoutMenu = document.getElementById("btn_logout_menu");
    const header = document.querySelector(".header h2");
    const profileContainer = document.querySelector(".profile-container");
    
    // NOTE : NOTE: 프로필 아이콘 클릭 시 메뉴 토글
    if (profileIcon) {
        profileIcon.addEventListener("click", () => {
            if (profileMenu) {
                profileMenu.style.display = profileMenu.style.display === "none" || !profileMenu.style.display ? "block" : "none"; // NOTE : NOTE : (수정) 조건문을 단일 줄로 축약
            }
        });
    }
    
    if (profileContainer && profileMenu) {
        // NOTE : NOTE: 아이콘에 마우스를 올리면 메뉴 보이기
        profileContainer.addEventListener("mouseover", () => {
            profileMenu.style.display = "block";
        });

        // NOTE : NOTE: 아이콘에서 마우스를 떼면 메뉴 숨기기
        profileContainer.addEventListener("mouseleave", () => {
            profileMenu.style.display = "none";
        });
    }

    // NOTE : NOTE: 뒤로가기 버튼 클릭 시
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
    
            // NOTE : NOTE : 조건에 맞는 경로가 없으면 기본 뒤로 가기
            window.history.back();
        });
    }

    // NOTE : NOTE: 회원정보 수정 버튼 클릭 시
    if (btnProfileMenu) {
        btnProfileMenu.addEventListener("click", () => {
            window.location.href = "/userEdit?type=user";
        });
    }

    // NOTE : NOTE: 비밀번호 수정 버튼 클릭 시
    if (btnPwdMenu) {
        btnPwdMenu.addEventListener("click", () => {
            window.location.href = "/userEdit?type=password";
        });
    }

    // NOTE : NOTE: 로그아웃 버튼 클릭 시
    if (btnLogoutMenu) {
        btnLogoutMenu.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/";
        });
    }

    // NOTE : NOTE: 헤더 제목 클릭 시
    if (header) {
        header.addEventListener("click", () => {
            const currentUrl = window.location.href.split('/').pop();
            if (currentUrl !== ("login") && currentUrl !== ("register") && currentUrl !== ("")) {
                window.location.href = "/board";
            }
        });
    }
    
}
const notifications = async () => {
    try {
        // NOTE : NOTE : 게시글 목록 API 호출
        const response = await fetch(`${apiUrl}/notifications`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

        if (response.ok) {
            const result = await response.json();
            handleResponse(result);

            // NOTE : NOTE : 모든 데이터 로드 확인
            if (result.length < 6) {
              allPostsLoaded = true;
              stopInfiniteScroll();
            } 
          } else {
            console.warn("데이터를 불러오지 못했습니다.");
          }

    } catch (error) {
        console.error('Error loading board list:', error);
        alert('게시글 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
        isLoading = false; // NOTE : NOTE : 로딩 상태 해제
        hideLoadingAnimation();
        checkIfMoreDataNeeded();
      }
}
// NOTE : NOTE : 페이지 로드 시 헤더 생성
document.addEventListener('DOMContentLoaded', createHeader);