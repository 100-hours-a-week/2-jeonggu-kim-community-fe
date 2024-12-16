import { uploadFile, fetchConfig } from '/js/common/common.js';

const contentHelper = document.getElementById('p_content_helper');
const titleInput = document.getElementById('txt_title');
const contentInput = document.getElementById('txt_content');
const editButton = document.getElementById('btn_board_update');
const token = localStorage.getItem("token");
let apiUrl = '';

// NOTE : 제목, 내용 입력 시 등록 버튼 활성화/비활성화 및 색상 변경
const toggleButtonState = () => {
    const isContentFilled = titleInput.value.trim() !== "" && contentInput.value.trim() !== "";
    editButton.disabled = !isContentFilled;
    contentHelper.textContent = isContentFilled ? "" : "* 제목과 내용을 모두 작성해 주세요";
};

titleInput.addEventListener('blur', () => {
    if (titleInput.value.length > 26) {
        titleInput.value = titleInput.value.slice(0, 26); // NOTE : 26자 초과 입력 방지
    }
    toggleButtonState();
});

contentInput.addEventListener('blur', toggleButtonState);

const getBoardIdFromURL = () => new URLSearchParams(window.location.search).get('board_id');

// NOTE : 페이지 로드 시 게시글 정보 불러오기
const loadBoardData = async () => {
    const board_id = getBoardIdFromURL();
    if (!board_id) {
        alert('잘못된 접근입니다.');
        window.history.back();
        return;
    }

    try {
        const config = await fetchConfig();
        apiUrl = config.apiUrl;
        const response = await fetch(`${apiUrl}/boards/${board_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
            
        if (result.message === 'success' && result.data) {
            displayBoardData(result.data);
        } else {
            alert('게시글을 찾을 수 없습니다.');
            window.history.back();
        }
    } catch (error) {
        console.error('Error loading board data:', error);
        alert('서버 오류가 발생했습니다.');
        window.history.back();
    }
};

// NOTE : 데이터를 화면에 표시
const displayBoardData = (board) => {
    const image_url = board.image_url;
    const title = board.title;
    const content = board.content;
    const image_nm = board.image_nm;

    titleInput.value = title;
    contentInput.value = content;
    document.getElementById('img_upload').setAttribute('data-image-url', image_url || '');
    document.getElementById('file-name-display').textContent = image_nm || '선택된 파일 없음';
    editButton.disabled = false; // NOTE : 수정 버튼 활성화
};

// NOTE : 수정 버튼 클릭 이벤트
const handleUpdate = async () => {
    const board_id = getBoardIdFromURL();
    const image_urlInput = document.getElementById('img_upload');
    const title = titleInput.value;
    const content = contentInput.value;
    const img_url = image_urlInput.getAttribute("data-image-url");

    if (!title || !content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }

    const updatedData = {
        title,
        content,
        ...(image_urlInput.files[0] && {
            image_url: img_url,
            image_nm: document.getElementById('file-name-display').textContent
        })
    };

    try {
        const response = await fetch(`${apiUrl}/boards/${board_id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' ,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('게시글이 수정되었습니다.');
            window.location.href = `/boardInfo?board_id=${board_id}`;
        } else {
            alert(result.message || '게시글 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating board data:', error);
        alert('서버 오류가 발생했습니다.');
    }
};

const imgUploadElement = document.getElementById('img_upload');
imgUploadElement.addEventListener('change', async () => {
    if (imgUploadElement.files.length === 0) return; // NOTE : 파일이 선택되지 않은 경우 종료
            
    try {
        //const result = await uploadImage(imgUploadElement, `${apiUrl}/boards/image`, "boardImage");
        const imageUrl = await uploadFile(imgUploadElement.files[0], "board");
        const fileName = imageUrl.split('/').pop();
        imgUploadElement.setAttribute('data-image-url', imageUrl);
        document.getElementById('file-name-display').textContent = fileName;
    } catch (error) {
        console.error('오류:', error);
        profileHelper.textContent = "* 파일 업로드 중 오류가 발생했습니다.";
    }
});

editButton.addEventListener('click', handleUpdate);
document.addEventListener('DOMContentLoaded', loadBoardData);
