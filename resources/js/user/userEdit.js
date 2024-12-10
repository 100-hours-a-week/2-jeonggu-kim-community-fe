import { fetchConfig, uploadFile, encodeBase64 } from '/js/common/common.js';

const InfoEditButton = document.getElementById('btn_info_edit');
const nicknameText = document.getElementById('txt_nickname');
const passwordEditButton = document.getElementById('btn_pwd_update');
const profileInput = document.getElementById("file_profile_url");
const profileHelper = document.getElementById('p_content_helper');
const token = localStorage.getItem("token");
const config = await fetchConfig();
const apiUrl = config.apiUrl;

// NOTE : 회원 정보 로딩
const loadUserInfo = async () => {
    try {
        const response = await fetch(`${apiUrl}/users`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if (response.ok) {
            const result = await response.json();
            if (result.message === 'success' && result.data) {
                document.getElementById('txt_email').value = result.data.email;
                document.getElementById('txt_nickname').value = result.data.nickname;
                document.getElementById('img_profile_url').setAttribute("src", result.data.profile_url);
            }
        } else {
            console.error('Failed to load user information');
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};

// NOTE : 회원정보 수정
InfoEditButton.addEventListener('click', async () => {
    try {
        const profile_url = document.getElementById('img_profile_url').getAttribute("src");
        const response = await fetch(`${apiUrl}/users`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
                nickname: nicknameText.value, 
                password: '',
                profile_url: profile_url
            })
        });

        if (response.ok) {
            const result_json = await response.json();
            localStorage.setItem("token", result_json.data.token);
            alert('회원정보가 수정되었습니다.');
        } else {
            alert('회원정보 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating nickname:', error);
        alert('서버 오류가 발생했습니다.');
    }
});

// NOTE : 비밀번호 수정
passwordEditButton.addEventListener('click', async () => {
    try {
        const password = document.getElementById("txt_pwd").value;
        const hashedPassword = encodeBase64(password);

        const response = await fetch(`${apiUrl}/users`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
                nickname: '', 
                password: hashedPassword
            })
        });

        if (response.ok) {
            alert('비밀번호 수정되었습니다.');
        } else {
            alert('비밀번호 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating nickname:', error);
        alert('서버 오류가 발생했습니다.');
    }
});

// NOTE : URL 파라미터에서 type 값을 가져와 특정 섹션 표시
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");

document.getElementById(type === "password" ? "div_pwd_update" : "div_profile_section").style.display = "block";
document.getElementById(type !== "password" ? "div_pwd_update" : "div_profile_section").style.display = "none";

// NOTE : 회원탈퇴 링크 클릭 시 팝업 표시
document.getElementById("a_user_delete").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("div_user_popup").style.display = "block"; 
});

// NOTE : 회원탈퇴 팝업 취소
const closeUserPopup = () => {
    document.getElementById("div_user_popup").style.display = "none"; 
};

// NOTE : 회원탈퇴 팝업 확인
const confirmUserDelete = () => {
    document.getElementById("div_user_popup").style.display = "none";
};

// NOTE: 비밀번호 체크
const passwordInput = document.getElementById("txt_pwd");
passwordInput.addEventListener("blur", () => {
    const passwordHelper = document.getElementById("p_pwd");

    let isValid = false;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,20}$/;
    if (!passwordInput.value) {
        passwordHelper.textContent = "* 비밀번호를 입력해 주세요.";
    } else if (!passwordPattern.test(passwordInput.value)) {
        passwordHelper.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
    } else {
        passwordHelper.textContent = "";
        isValid = true;
    }
    validateForm(isValid);
});

// NOTE: 비밀번호 확인 체크
const confirmPasswordInput = document.getElementById("txt_confirm_pwd");
confirmPasswordInput.addEventListener("blur", () => {
    const confirmPasswordHelper = document.getElementById("p_confirm_pwd");

    let isValid = false;
    if (!confirmPasswordInput.value) {
        confirmPasswordHelper.textContent = "* 비밀번호를 한 번 더 입력해 주세요.";
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordHelper.textContent = "* 비밀번호가 다릅니다.";
    } else {
        confirmPasswordHelper.textContent = "";
        isValid = true;
    }
    validateForm(isValid);
});

// NOTE: 수정하기 버튼 활성화
const validateForm = (isValid) => {
    const confirmPasswordHelper = document.getElementById("p_confirm_pwd");
    const passwordHelper = document.getElementById("p_pwd");
    if (isValid 
    &&  passwordHelper.textContent.trim() === ''
    &&  confirmPasswordHelper.textContent.trim() === '') {
        passwordEditButton.disabled = false;
        passwordEditButton.style.cursor = "pointer";
    } else {
        passwordEditButton.disabled = true;
        passwordEditButton.style.cursor = "not-allowed";
    }
};

// NOTE : 이미지 파일 등록
document.getElementById("img_profile_url").addEventListener('click', () => {
    document.getElementById('file_profile_url').click();
});

// NOTE : 파일이 선택되면 서버에 업로드
profileInput.addEventListener("change", async () => {
    if (profileInput.files.length === 0) return; // NOTE : 파일이 선택되지 않은 경우 종료

    try {
        const imageUrl = await uploadFile(profileInput.files[0], "profile");
        
        document.getElementById('img_profile_url').setAttribute("src",  `${imageUrl}`);
        profileHelper.textContent = profileInput.files.length > 0 ? "" : "* 프로필 사진을 선택해 주세요";
        alert("파일 업로드에 성공하였습니다.");
    
    } catch (error) {
        console.error('오류:', error);
        profileHelper.textContent = "* 파일 업로드 중 오류가 발생했습니다.";
    }
});

// NOTE : 회원탈퇴 버튼 동작
document.getElementById("btn_user_cancel").addEventListener('click', closeUserPopup);
document.getElementById("a_user_delete").addEventListener('click', () => {
    document.getElementById("div_user_popup").style.display = "block"; 
});

// NOTE : 회원 탈퇴 실행
document.getElementById("btn_user_confirm").addEventListener('click', async () => {
    try {
        const response = await fetch(`${apiUrl}/users`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
        }, });
        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            alert(result.message || '회원 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('서버 오류가 발생했습니다.');
    }
});

loadUserInfo();