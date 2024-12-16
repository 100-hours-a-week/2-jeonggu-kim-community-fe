import { fetchConfig, encodeBase64 } from '/js/common/common.js';
const config = await fetchConfig();

const emailInput = document.getElementById("txt_email");
const passwordInput = document.getElementById("txt_pwd");
const loginButton = document.getElementById("btn_login");
const helperText = document.getElementById("p_helper_text");

// NOTE : 초기 버튼 비활성화 상태로 설정
loginButton.disabled = true;

// NOTE: 이메일 유효성 검사
emailInput.addEventListener("blur", function () {
  let isTrue = false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailInput.value) {
      helperText.textContent = "* 이메일을 입력해 주세요.";
    } else if(!emailRegex.test(emailInput.value.trim())) {
      helperText.textContent = "* 올바른 이메일 주소 형식을 입력해 주세요.";
  } else {
    helperText.textContent = ""; 
      isTrue = true;
  }
  validateForm(isTrue);
});

// NOTE: 비밀번호 유효성 검사
passwordInput.addEventListener("blur", function () {
  let isTrue = false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

  if (!passwordInput.value) {
    helperText.textContent = "* 비밀번호를 입력해 주세요.";
  } else if (!passwordRegex.test(passwordInput.value)) {
    helperText.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  } else {
    helperText.textContent = ""; 
      isTrue = true;
  }
  validateForm(isTrue);
});

const validateForm = (isTrue) => {
  if (isTrue
  && helperText.textContent.trim() == ''
  && passwordInput.value.trim() !== ''
  && emailInput.value.trim() !== ''
  ) {
      loginButton.disabled = false;
      // NOTE : 활성화 색상 and 활성화 커서
      loginButton.style.cursor = "pointer";
  } else {
      loginButton.disabled = true;
      // NOTE : 비활성화 색상 and 비활성화 커서
      loginButton.style.cursor = "not-allowed";

  }
};

// NOTE : 로그인 버튼 클릭 시 페이지 이동 처리
loginButton.addEventListener("click", async (event) => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const hashedPassword = encodeBase64(password);

  event.preventDefault();
  
  // NOTE : 유효성 검사가 통과되었을 때만 처리
  if (!loginButton.disabled) {
    try {
      const response = await fetch(`${config.apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password:hashedPassword})
      });

      const result = await response.json();
      if (response.status === 200 && result.data["success"]) {
          localStorage.setItem("token", result.data.token);
          alert("로그인에 성공하였습니다.");
          window.location.href = '/board';
      } else{
        alert("아이디와 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
        alert("서버 오류가 발생했습니다.");
    }
  }
});