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
    // function showPopup() {
    //     document.getElementById("popup").style.display = "block";
    // }
    
    // function closePopup() {
    //     document.getElementById("popup").style.display = "none";
    // }
});