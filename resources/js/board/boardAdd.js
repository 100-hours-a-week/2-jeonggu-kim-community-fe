import { uploadFile, fetchConfig } from '/js/common/common.js';
const config = await fetchConfig();
const apiUrl = config.apiUrl;

const titleInput = document.getElementById('txt_title');
const contentInput = document.getElementById('txt_content');
const addButton = document.getElementById('btn_board_add');
const contentHelper = document.getElementById('p_content_helper'); // 안내 문구 요소 선택
const token = localStorage.getItem("token");

// NOTE : 제목, 내용 입력 시 등록 버튼 활성화/비활성화 및 색상 변경
const toggleButtonState = () => {
    const isContentFilled = titleInput.value.trim() !== "" && contentInput.value.trim() !== "";
    addButton.disabled = !isContentFilled;
    contentHelper.textContent = isContentFilled ? "" : "* 제목과 내용을 모두 작성해 주세요";
};

// NOTE : 제목 입력 시 글자 수 제한 및 버튼 활성화/비활성화
titleInput.addEventListener('blur', () => {
    if (titleInput.value.length > 26) {
        titleInput.value = titleInput.value.slice(0, 26); // NOTE : 26자 초과 입력 방지
    }
    toggleButtonState();
});

// NOTE : 내용 입력 시 버튼 활성화/비활성화
contentInput.addEventListener('blur', toggleButtonState);

addButton.addEventListener("click", async () => {
    const title = titleInput.value;
    const content = contentInput.value;
    const image_urlInput = document.getElementById('img_upload');
    const img_url = image_urlInput.getAttribute("data-image-url");
    const image_name = image_urlInput.files[0]?.name;
    const formData = { title, content };

    if (image_urlInput.files[0]) {
        formData.image_url = img_url;
        formData.image_nm = image_name;
    }

    try {
        const response = await fetch(`${apiUrl}/boards`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' ,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.message === 'success') {
            alert('게시글이 성공적으로 추가되었습니다.');
            window.location.href = '/board';
        } else {
            alert('게시글 추가에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
    }
});

// NOTE : img_upload 요소가 있는 경우에만 이벤트 리스너 등록
const imgUploadElement = document.getElementById('img_upload');
imgUploadElement.addEventListener('change', async () => {
    if (imgUploadElement.files.length === 0) return; // NOTE : 파일이 선택되지 않은 경우 종료

    try {
        const imageUrl = await uploadFile(imgUploadElement.files[0], "board");
        imgUploadElement.setAttribute('data-image-url', imageUrl);
        alert("파일 업로드에 성공하였습니다.");
    
    } catch (error) {
        console.error('오류:', error);
        alert("파일 업로드에 실패하였습니다.");
    }

    
    // if (imgUploadElement.files.length === 0) return; // NOTE : 파일이 선택되지 않은 경우 종료

    // const result = await uploadImage(imgUploadElement, `${apiUrl}/boards/image`, "boardImage");

    // if (result.success) {
    //     const filePath = result.filePath.split('/').pop();
    //     const imageUrl = `${apiUrl}/boards/image/${filePath}`;

    //     imgUploadElement.setAttribute('data-image-url', imageUrl);
    //     alert(result.message);
    // } else {
    //     alert(result.message);
    // }
});
