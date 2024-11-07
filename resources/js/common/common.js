document.addEventListener("DOMContentLoaded", () => {
    // NOTE: .back-icon 요소를 선택하고 클릭 이벤트 리스너를 추가
    const backIcon = document.querySelector(".back-icon"); // NOTE : (수정) 변수명 back_icon에서 backIcon으로 변경
    if (backIcon) {
        backIcon.addEventListener("click", () => { // NOTE : (수정) 중복된 document.querySelector(".back-icon") 제거
            // NOTE: 이전 페이지로 이동
            window.history.back();
        });
    }

    const profileIcon = document.querySelector(".profile-icon"); // NOTE : (수정) 변수명 profile_icon에서 profileIcon으로 변경
    if (profileIcon) {
        profileIcon.addEventListener("click", () => { // NOTE : (수정) 중복된 document.querySelector(".profile-icon") 제거
            const profileMenu = document.querySelector(".profile-menu");

            if(profileMenu){
                // NOTE: profile-menu의 display 속성을 토글
                profileMenu.style.display = profileMenu.style.display === "none" || !profileMenu.style.display ? "block" : "none"; // NOTE : (수정) 조건문을 단일 줄로 축약
            }
        });
    }

    const btnProfileMenu = document.getElementById("btn_profile_menu"); // NOTE : (수정) 변수명 btn_profile_menu에서 btnProfileMenu으로 변경
    if (btnProfileMenu) {
        // NOTE: 회원정보 수정 버튼 클릭 시 user 파라미터 전달
        btnProfileMenu.addEventListener("click", () => {
            window.location.href = "/userEdit?type=user";
        });
    }

    const btnPwdMenu = document.getElementById("btn_pwd_menu"); // NOTE : (수정) 변수명 btn_pwd_menu에서 btnPwdMenu으로 변경
    if (btnPwdMenu) {
        // NOTE: 비밀번호 수정 버튼 클릭 시 password 파라미터 전달
        btnPwdMenu.addEventListener("click", () => {
            window.location.href = "/userEdit?type=password";
        });
    }

    const btnLogoutMenu = document.getElementById("btn_logout_menu"); // NOTE : (수정) 변수명 btn_profile_menu에서 btnLogoutMenu으로 변경
    if (btnLogoutMenu) {
        // NOTE: 로그아웃 버튼 클릭 시 로그인 페이지로 이동
        btnLogoutMenu.addEventListener("click", () => {
            window.location.href = "/login";
        });
    }

    const header = document.querySelector(".header h2"); // NOTE : (수정) 변수명 profile_icon에서 profileIcon으로 변경
    if (header) {
        header.addEventListener("click", () => { // NOTE : (수정) 중복된 document.querySelector(".profile-icon") 제거
            window.location.href = "/board";
        });
    }
});

// NOTE : "YYYY-MM-DD HH:MM:SS" 형식으로
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // NOTE : 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// NOTE : 공통 파일 업로드 함수

export const uploadImage = async (fileInput, uploadUrl, imageType) => {
    if (fileInput.files.length === 0) return { success: false, message: '파일이 없습니다.' }; // NOTE : 파일이 선택되지 않은 경우 종료
            
    const formData = new FormData();
    formData.append(imageType, fileInput.files[0]);

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error('파일 업로드에 실패했습니다.');
            return { success: false, message: result.message || '이미지 업로드 실패' };
        }else {
            return { success: true, filePath: result.filePath, message: '이미지 업로드 성공' };
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, message: '서버 오류가 발생했습니다.' };
    }
}

export const checkAuthentication = async () => {
    fetch('/auth/check')
    .then(response => {
        console.log("das");
        if (response.status === 401) {
            alert('인증이 필요합니다.');
            window.location.href = '/login';
        }
    })
    .catch(error => console.error('Error checking authentication:', error));
}