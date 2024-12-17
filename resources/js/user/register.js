import { fetchConfig, uploadFile, encodeBase64 } from '/js/common/common.js';

let apiUrl = '';

document.addEventListener('DOMContentLoaded', async () => {
    const config = await fetchConfig();
    apiUrl = config.apiUrl;
});

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("txt_email");
    const passwordInput = document.getElementById("txt_pwd");
    const confirmPasswordInput = document.getElementById("txt_confirm_pwd");
    const nicknameInput = document.getElementById("txt_nickname");
    const profileIcon = document.getElementById("img_profile");
    const profileInput = document.getElementById("file_profile_url");
    const registerButton = document.getElementById("btn_register");
    const profileText = document.getElementById("spn_profile_txt");

    // NOTE: helper 텍스트
    const emailHelper = document.getElementById("email-helper");
    const passwordHelper = document.getElementById("p_pwd");
    const confirmPasswordHelper = document.getElementById("p_confirm_pwd");
    const nicknameHelper = document.getElementById("p_nickname");
    const profileHelper = document.getElementById("p_profile");

    document.getElementById("img_profile").addEventListener("click", () => {
        if (profileInput.value == "") {
            profileInput.click();
        }
    });

    // NOTE: Email 체크
    emailInput.addEventListener("blur", async () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let isValid = false; // NOTE : (수정) isTrue에서 isValid로 변수명 변경
        if (!emailInput.value) {
            emailHelper.textContent = "* 이메일을 입력해주세요.";
        } else if (!emailPattern.test(emailInput.value)) {
            emailHelper.textContent = "* 올바른 이메일 주소 형식을 입력해주세요.\n(예: example@example.com)";
        } else {
            try {
                const isAvailable = await chkDuplication("email", emailInput.value);
                if (!isAvailable) {
                    emailHelper.textContent = "* 이미 사용 중인 이메일입니다.";
                } else {
                    emailHelper.textContent = "";
                    isValid = true;
                }
            } catch (error) {
                emailHelper.textContent = "* 이메일 중복 확인에 실패했습니다.";
            }
        }
        validateForm(isValid);
    });

    // NOTE: 비밀번호 체크
    passwordInput.addEventListener("blur", () => {
        let isValid = false; // NOTE : (수정) isTrue에서 isValid로 변수명 변경
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,20}$/;
        if (!passwordInput.value) {
            passwordHelper.textContent = "* 비밀번호를 입력해 주세요.";
        } else if (!passwordPattern.test(passwordInput.value)) {
            passwordHelper.textContent = "* 비밀번호는 8자 이상, 20자 이하이며,\n대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        } else {
            passwordHelper.textContent = "";
            isValid = true;
        }
        validateForm(isValid);
    });

    // NOTE: 비밀번호 확인 체크
    confirmPasswordInput.addEventListener("blur", () => {
        let isValid = false; // NOTE : (수정) isTrue에서 isValid로 변수명 변경
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

    // NOTE: Nickname 체크
    nicknameInput.addEventListener("blur", async () => {
        let isValid = false; // NOTE : (수정) isTrue에서 isValid로 변수명 변경
        const nicknamePattern = /^[^\s]{1,10}$/;
        if (!nicknameInput.value) {
            nicknameHelper.textContent = "* 닉네임을 입력해 주세요.";
        } else if (/\s/.test(nicknameInput.value)) {
            nicknameHelper.textContent = "* 닉네임에 띄어쓰기를 사용하지 마세요.";
        } else if (!nicknamePattern.test(nicknameInput.value)) {
            nicknameHelper.textContent = "* 닉네임은 최대 10자까지 작성 가능합니다.";
        } else {
            try {
                const isAvailable = await chkDuplication("nickname", nicknameInput.value);
                if (!isAvailable) {
                    nicknameHelper.textContent = "* 이미 사용 중인 닉네임입니다.";
                } else {
                    nicknameHelper.textContent = ""; // NOTE: 사용 가능한 닉네임
                    isValid = true;
                }
            } catch (error) {
                nicknameHelper.textContent = "* 닉네임 중복 확인에 실패했습니다.";
            }
        }
        validateForm(isValid);
    });

    // NOTE: 회원 가입
    const validateForm = (isValid) => { // NOTE : (수정) isTrue에서 isValid로 변수명 변경
        if (isValid
        &&  emailHelper.textContent.trim() === ''
        &&  passwordHelper.textContent.trim() === ''
        &&  confirmPasswordHelper.textContent.trim() === ''
        &&  nicknameHelper.textContent.trim() === '') {
            registerButton.disabled = false;
            // NOTE: 활성화 색상 및 활성화 커서
            registerButton.style.cursor = "pointer";
        } else {
            registerButton.disabled = true;
            // NOTE: 비활성화 색상 및 비활성화 커서
            registerButton.style.cursor = "not-allowed";
        }
    };

    document.getElementById("registerForm").addEventListener("submit", async (event) => { // NOTE : 수정: function()에서 화살표 함수로 변경
        event.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const nickname = nicknameInput.value;
        const profile_url = document.getElementById('file_profile_url').getAttribute("data-image-url"); // NOTE: 파일 업로드 처리 로직이 추가되어야 함
        const hashedPassword = encodeBase64(password);

        try {
            const response = await fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password:hashedPassword, nickname, profile_url })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("회원가입이 성공적으로 완료되었습니다.");
                window.location.href = "/";
            } else {
                alert(result.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("서버 오류가 발생했습니다.");
        }
    });

    const chkDuplication = async (key, value) => { // NOTE : (수정) function()에서 화살표 함수로 변경
        try {
            const response = await fetch(`${apiUrl}/users/check?key=${key}&value=${value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            if (!response.ok) {
                throw new Error('사용자 조회 실패');
            }
    
            const users = await response.json();
            return users.data["success"];
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // NOTE : 파일이 선택되면 서버에 업로드
    /*
    profileInput.addEventListener("change", async function () {
        if (profileInput.files.length === 0) return; // NOTE : 파일이 선택되지 않은 경우 종료
        
        const formData = new FormData();
        formData.append('profileImage', profileInput.files[0]); // NOTE : 파일 추가
        formData.append('folderName', "profile");
        try {
            const response = await fetch(`${apiUrl}/images`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('파일 업로드에 실패했습니다.');
            } else {
                const result_json = await response.json();
                const imageUrl = result_json.url;

                profileInput.setAttribute('data-image-url', imageUrl);
                profileIcon.style.backgroundImage = `url(${imageUrl})`;
                
                profileHelper.textContent = profileInput.files.length > 0 ? "" : "* 프로필 사진을 선택해 주세요";
                
                profileIcon.textContent = ""; // NOTE : 기존 텍스트 제거

                alert("파일 업로드에 성공하였습니다.");
            }
        } catch (error) {
            console.error('오류:', error);
            profileHelper.textContent = "* 파일 업로드 중 오류가 발생했습니다.";
        }
    });
    */
    profileInput.addEventListener("change", async function () {
        if (profileInput.files.length === 0) return; // NOTE : 파일이 선택되지 않은 경우 종료

        try {
            const imageUrl = await uploadFile(profileInput.files[0], "profile");

            profileInput.setAttribute('data-image-url', imageUrl);
            profileIcon.setAttribute("src", imageUrl);
            
            profileHelper.textContent = profileInput.files.length > 0 ? "" : "* 프로필 사진을 선택해 주세요";
            
            profileIcon.textContent = ""; // NOTE : 기존 텍스트 제거
            profileText.style.display = "none";
            alert("파일 업로드에 성공하였습니다.");
        
        } catch (error) {
            console.error('오류:', error);
            profileHelper.textContent = "* 파일 업로드 중 오류가 발생했습니다.";
        }
    });

    document.getElementById("btn_reupload").addEventListener("click", function () {
        const fileInput = document.getElementById("file_profile_url");
        fileInput.value = "";
    
        const imgElement = document.getElementById("img_profile");
        imgElement.src = "";
    
        profileText.style.display = "block";
    });
});