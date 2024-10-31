document.addEventListener("DOMContentLoaded", () => {
    // NOTE : .back-icon 요소를 선택하고 클릭 이벤트 리스너를 추가
    const back_icon = document.querySelector(".back-icon");
    if (back_icon){
        document.querySelector(".back-icon").addEventListener("click", () => {
            // NOTE : 이전 페이지로 이동
            window.history.back();
        });
    }

    const profile_icon = document.querySelector(".profile-icon");
    if(profile_icon){

        document.querySelector(".profile-icon").addEventListener("click", () => {
            const profileMenu = document.querySelector(".profile-menu");
            
            // NOTE : profile-menu의 display 속성을 토글
            if (profileMenu.style.display === "none" || !profileMenu.style.display) {
                profileMenu.style.display = "block";
            } else {
                profileMenu.style.display = "none";
            }
        });
    }

    const btn_profile_menu = document.getElementById("btn_profile_menu");
    if(btn_profile_menu){

        // NOTE : 회원정보 수정 버튼 클릭 시 user 파라미터 전달
        document.getElementById("btn_profile_menu").addEventListener("click", () => {
            window.location.href = "/userEdit?type=user";
        });
    }

    const btn_pwd_menu = document.getElementById("btn_pwd_menu");
    if(btn_pwd_menu){
        // NOTE : 비밀번호 수정 버튼 클릭 시 password 파라미터 전달
        document.getElementById("btn_pwd_menu").addEventListener("click", () => {
            window.location.href = "/userEdit?type=password";
        });
    }

    
    const btn_logout_menu = document.getElementById("btn_logout_menu");
    if(btn_profile_menu){

        // NOTE : 회원정보 수정 버튼 클릭 시 user 파라미터 전달
        document.getElementById("btn_logout_menu").addEventListener("click", () => {
            window.location.href = "/login";
        });
    }
});