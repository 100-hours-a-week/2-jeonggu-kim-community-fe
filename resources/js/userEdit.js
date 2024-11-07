document.addEventListener('DOMContentLoaded', () => {
    const menuProfileButton = document.querySelector('#btn_profile_menu');
    const menuPasswordButton = document.querySelector('#btn_pwd_menu');
    
    menuProfileButton.addEventListener('click', (event) => {
        event.preventDefault();
        const pwdSection = document.getElementById('div_pwd_update');
        const profileSection = document.getElementById('div_profile_section');
        
        // NOTE: 비밀번호 수정 섹션을 숨기고, 프로필 수정 섹션을 표시
        if (pwdSection) {
            pwdSection.style.display = 'none';
            profileSection.style.display = 'block';
        }
    });

    menuPasswordButton.addEventListener('click', (event) => {
        event.preventDefault();
        const profileSection = document.getElementById('div_profile_section');
        const pwdSection = document.getElementById('div_pwd_update');
        
        // NOTE: 프로필 수정 섹션을 숨기고, 비밀번호 수정 섹션을 표시
        if (profileSection) {
            profileSection.style.display = 'none';
            pwdSection.style.display = 'block';
        }
    });
});