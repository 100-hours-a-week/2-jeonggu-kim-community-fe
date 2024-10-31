document.addEventListener('DOMContentLoaded', function() {
    const menuProfileButton = document.querySelector('#btn_profile_menu');
    const menuPasswordButton = document.querySelector('#btn_pwd_menu');
    // const menuLogoutButton = document.querySelector('#btn_logout_menu');
    
    menuProfileButton.addEventListener('click', function(event) {
        event.preventDefault();
        const pwdSection = document.getElementById('div_pwd_update');
        const profileSection = document.getElementById('div_profile_section');
        if (pwdSection) {
            pwdSection.style.display = 'none';
            profileSection.style.display = 'block';
        }
    });
    menuPasswordButton.addEventListener('click', function(event) {
        event.preventDefault();
        const profileSection = document.getElementById('div_profile_section');
        const pwdSection = document.getElementById('div_pwd_update');
       if (profileSection) {
            profileSection.style.display = 'none';
            pwdSection.style.display = 'block';
        }
    });

    // NOTE : URL 파라미터에서 type 값을 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    // NOTE : type 값에 따라 특정 섹션을 표시합니다.
    if (type === "user") {
        document.getElementById("div_profile_section").style.display = "block";
        document.getElementById("div_pwd_update").style.display = "none";
    } else if (type === "password") {
        document.getElementById("div_pwd_update").style.display = "block";
        document.getElementById("div_profile_section").style.display = "none";
    }

    // NOTE : 회원탈퇴 링크 클릭 시 팝업 표시
    document.getElementById("a_user_delete").addEventListener("click", (event) => {
        event.preventDefault(); // NOTE : 기본 링크 동작(페이지 이동) 방지
        document.getElementById("div_user_popup").style.display = "block"; 
    });
});

// NOTE : 회원탈퇴 팝업 취소
function closeUserPopup() {
    document.getElementById("div_user_popup").style.display = "none"; 
}
// NOTE : 회원탈퇴 팝업 확인
function confirmUserDelete() {
    document.getElementById("div_user_popup").style.display = "none";
}