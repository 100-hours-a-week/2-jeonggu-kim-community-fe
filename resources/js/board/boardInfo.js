import { formatDate, fetchConfig } from '/js/common/common.js';
// import { } from '/js/common/auth.js';
const config = await fetchConfig();
const apiUrl = config.apiUrl;
import auth from '../common/auth.js';

const editButton = document.getElementById("btn_edit");
const deleteButton = document.getElementById("btn_delete");
const addButton = document.getElementById('btn_comment_add');
const boardPopup = document.getElementById("div_board_popup");
const commentPopup = document.getElementById("div_comment_popup");
const token = localStorage.getItem("token");

editButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const board_id = urlParams.get('board_id');
    window.location.href = `/boardEdit?board_id=${board_id}`;
});

deleteButton.addEventListener("click", () => openBoardPopup());

const loadBoardInfo = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const board_id = urlParams.get('board_id');
    
    if (!board_id) {
        alert('게시글 번호가 존재하지 않습니다.');
        window.location.replace("/board"); 
        return;
    }

    try {
        // addViewCount가 완료된 후 fetch 요청 실행
        await addViewCount(board_id); 
        const response = await fetch(`${apiUrl}/boards/${board_id}`, {
            method: "GET",
            headers: {
                CurrentPage: `${window.location.href}`,
                Authorization: `Bearer ${token}`, // NOTE : JWT를 Authorization 헤더에 추가
            },
        });

        const result = await response.json();
        
        if (result.data) {
            renderBoardInfo(result.data); // NOTE : 데이터가 있으면 렌더링
        } else {
            alert('게시글 정보를 불러오는 데 실패했습니다.');
            window.location.replace("/board"); 
        }
    } catch (error) {
        console.error('Error loading board info:', error);
        alert('서버 오류가 발생했습니다.');
        window.location.replace("/board"); 
    }
};

const renderBoardInfo = (board) => {
    if (board.isAuthor) {
        document.getElementById('div_board_button').style.display = "block";
        document.getElementById('btn_board_confirm').setAttribute('data-board-no', board.board_id);
    }
    const profileUrl = board.profile_url || "../../images/default_profile.png";
    document.getElementById('img_profile_url').setAttribute("src", profileUrl);
    if (board.image_url) {
        document.getElementById('img_url').setAttribute("src", board.image_url);
    }
    if(board.isChange) {
        document.getElementById("span_board_chg").style.display = "block";
        document.getElementById("span_board_chg").setAttribute('data-chg-time', formatDate(board.chg_dt));
    }
    document.getElementById('h2_section_title').textContent = board.title;
    document.getElementById('span_board_author').textContent = board.nickname;
    document.getElementById('span_board_dt').textContent = formatDate(board.date);
    document.getElementById('p_board_content').textContent = board.content;
    document.getElementById('span_like_cnt').textContent = board.like_cnt || 0;
    document.getElementById('span_view_cnt').textContent = board.view_cnt || 0;
}


// NOTE : 게시판 삭제 팝업 열기
const openBoardPopup = () => boardPopup.style.display = "block";
const closeBoardPopup = () => boardPopup.style.display = "none";
const openCommentPopup = () => commentPopup.style.display = "block";

// NOTE : 댓글 팝업 취소
const closeCommentPopup = (commentId) => {
    const commentPopup = document.getElementById('div_comment_popup');
    const confirmButton = document.getElementById('btn_comment_confirm');

    confirmButton.setAttribute('data-comment-no', commentId);
    commentPopup.style.display = 'block';
}

// NOTE : 댓글 팝업 확인
function confirmCommentDelete(comment_no) {
    document.getElementById("div_comment_popup").style.display = "none";
}


// NOTE : 댓글 불러오기
const loadComments = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const board_id = urlParams.get('board_id');

    if (!board_id) {
        alert('게시글 번호가 존재하지 않습니다.');
        window.location.replace("/board");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/comments/${board_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (result.data) {
            document.getElementById('span_comment_cnt').textContent = result.data.length || 0;
            const commentListSection = document.querySelector('.comment-list');
            commentListSection.textContent = ''; // 기존 댓글 제거

            result.data.forEach((comment) => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.setAttribute('data-comment-no', comment.comment_id);

                // 프로필 이미지
                const profileImg = document.createElement('img');
                profileImg.classList.add('img_profile');
                profileImg.src = comment.profile_url || "../../images/default_profile.png";
                profileImg.alt = '프로필 이미지';

                // 작성자와 날짜 정보
                const commentInfo = document.createElement('div');
                commentInfo.classList.add('comment-info');

                const authorSpan = document.createElement('span');
                authorSpan.classList.add('comment-author');
                authorSpan.textContent = comment.nickname;

                const dateSpan = document.createElement('span');
                dateSpan.classList.add('comment-date');
                dateSpan.textContent = formatDate(comment.reg_dt);

                commentInfo.appendChild(profileImg);
                commentInfo.appendChild(authorSpan);
                commentInfo.appendChild(dateSpan);

                // 댓글 내용
                const commentText = document.createElement('p');
                commentText.classList.add('comment-text');
                commentText.textContent = comment.content;

                // 수정 여부 표시
                if (comment.isChange) {
                    const editedSpan = document.createElement('span');
                    editedSpan.classList.add('board-change');
                    editedSpan.textContent = `(수정됨)`;
                    commentInfo.appendChild(editedSpan);
                }

                commentElement.appendChild(commentInfo);
                commentElement.appendChild(commentText);

                // 작성자일 경우 버튼 추가
                if (comment.isAuthor) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.classList.add('comment-actions');

                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-comment');
                    editButton.dataset.commentNo = comment.comment_id;
                    editButton.textContent = '수정';

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-comment');
                    deleteButton.dataset.commentNo = comment.comment_id;
                    deleteButton.textContent = '삭제';

                    const saveButton = document.createElement('button');
                    saveButton.classList.add('save-comment');
                    saveButton.dataset.commentNo = comment.comment_id;
                    saveButton.style.display = 'none';
                    saveButton.textContent = '저장';

                    actionsDiv.appendChild(editButton);
                    actionsDiv.appendChild(deleteButton);
                    actionsDiv.appendChild(saveButton);
                    commentElement.appendChild(actionsDiv);

                    // 버튼 이벤트 리스너 추가
                    editButton.addEventListener('click', () => toggleEditComment(commentElement, comment));
                    deleteButton.addEventListener('click', () => closeCommentPopup(comment.comment_id));
                    saveButton.addEventListener('click', () => saveEditedComment(comment.comment_id));
                }

                commentListSection.appendChild(commentElement);
            });
        } else {
            console.error('댓글을 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
};

// NOTE : 댓글 입력 시 등록 버튼 활성화
document.getElementById('txt_comment_info').addEventListener('input', (event) => {
    const content = document.getElementById('txt_comment_info').value.trim();
    document.getElementById('btn_comment_add').disabled = !content;
});

// NOTE : 댓글 등록 요청
const addComment = async (board_id) => {
    const content = document.getElementById('txt_comment_info').value;

    const response = await fetch(`${apiUrl}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
            board_id,
            content
        })
    });

    const result = await response.json();

    if (response.ok) {
        alert('댓글이 성공적으로 추가되었습니다.');
        document.getElementById('txt_comment_info').value = ''; // NOTE : 댓글 입력 필드 초기화
        document.getElementById('btn_comment_add').disabled = true;

        const commentCountElement = document.getElementById('span_comment_cnt');
        commentCountElement.textContent = parseInt(commentCountElement.textContent) + 1;
          
        addCommentToList(result.data); // NOTE : 댓글 리스트에 새 댓글 추가
    } else {
        alert(result.message || '댓글 등록에 실패했습니다.');
    }
}

// NOTE : 댓글 등록 버튼 클릭 이벤트
document.getElementById('btn_comment_add').addEventListener('click', () => {
    // NOTE : URL에서 board_id 가져오기
    const board_id = new URLSearchParams(window.location.search).get('board_id');
    if (board_id) {
        addComment(parseInt(board_id, 10));
    } else {
        alert('게시글 번호를 확인할 수 없습니다.');
    }
});
// NOTE: 게시글 삭제 취소 버튼 클릭 이벤트
document.getElementById('btn_board_cancel').addEventListener('click', () => {
    const boardPopup = document.getElementById('div_board_popup');
    if (boardPopup) {
        boardPopup.style.display = 'none';
    }
});

// NOTE: 게시글 삭제 확인 버튼 클릭 이벤트
document.getElementById('btn_board_confirm').addEventListener('click', async (event) => {
    const commentPopup = document.getElementById('div_board_popup');
    if (commentPopup) {
        commentPopup.style.display = 'none';
    }

    try {
        const board_id = event.target.getAttribute('data-board-no');
        const response = await fetch(`${apiUrl}/boards/${board_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: "include",
        });

        if (response.ok) {            
            
            window.location.href = `/board`;

            alert('게시판이 삭제되었습니다.');

        } else {
            alert('게시판 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
});


// NOTE: 댓글 삭제 취소 버튼 클릭 이벤트
document.getElementById('btn_comment_cancel').addEventListener('click', () => {
    const commentPopup = document.getElementById('div_comment_popup');
    if (commentPopup) {
        commentPopup.style.display = 'none';
    }
});

// NOTE: 댓글 삭제 확인 버튼 클릭 이벤트
document.getElementById('btn_comment_confirm').addEventListener('click', async (event) => {
    const commentPopup = document.getElementById('div_comment_popup');
    if (commentPopup) {
        commentPopup.style.display = 'none';
    }

    try {
        const commentNo = event.target.getAttribute('data-comment-no');
        const response = await fetch(`${apiUrl}/comments/${commentNo}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: "include",
        });

        if (response.ok) {            
            const commentElement = document.querySelector(`.comment[data-comment-no="${commentNo}"]`);
            if (commentElement) {
                commentElement.remove(); // 해당 댓글 요소 제거
                
                const commentCountElement = document.getElementById('span_comment_cnt');
                commentCountElement.textContent = parseInt(commentCountElement.textContent) - 1;
            }

            alert('댓글이 삭제되었습니다.');

        } else {
            alert('댓글 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
});

// NOTE : 태그에 댓글 추가하기
const addCommentToList = (comment) => {
    const commentListSection = document.querySelector('.comment-list');
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.setAttribute('data-comment-no', comment.comment_id);

    const actions = document.createElement('div');
    actions.classList.add('comment-actions');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-comment');
    editButton.textContent = '수정';
    editButton.dataset.commentNo = comment.comment_id;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-comment');
    deleteButton.textContent = '삭제';
    deleteButton.dataset.commentNo = comment.comment_id;

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-comment');
    saveButton.textContent = '저장';
    saveButton.dataset.commentNo = comment.comment_id;
    saveButton.style.display = 'none';

    actions.append(editButton, deleteButton, saveButton);

    const info = document.createElement('div');
    info.classList.add('comment-info');

    const img = document.createElement('img');
    img.classList.add('img_profile');
    img.src = comment.profile_url || "../../images/default_profile.png";

    const authorSpan = document.createElement('span');
    authorSpan.classList.add('comment-author');
    authorSpan.textContent = comment.nickname;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('comment-date');
    dateSpan.textContent = formatDate(comment.date);

    info.append(img, authorSpan, dateSpan);

    const contentP = document.createElement('p');
    contentP.classList.add('comment-text');
    contentP.textContent = comment.content;

    commentElement.append(actions, info, contentP);

    // 이벤트 리스너 추가
    editButton.addEventListener('click', () => toggleEditComment(commentElement, comment));
    deleteButton.addEventListener('click', () => closeCommentPopup(comment.comment_id));
    saveButton.addEventListener('click', () => saveEditedComment(comment.comment_id));

    commentListSection.appendChild(commentElement);
};


// NOTE : 댓글 수정 기능
const toggleEditComment = (commentElement, comment) => {
    const commentTextElement = commentElement.querySelector('.comment-text');
    
    if (commentTextElement) {
        const currentText = commentTextElement.textContent;
        
        // NOTE : `<p>` 요소를 `<input>`으로 변경
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = currentText;
        inputElement.classList.add('comment-text');
        inputElement.maxLength = 100;
        inputElement.dataset.commentNo = comment.comment_id;
        commentTextElement.replaceWith(inputElement);

        // NOTE : 저장 버튼 추가
        const commentSaveElement = document.querySelector(`.save-comment[data-comment-no="${comment.comment_id}"]`);
        if (commentSaveElement) {
            commentSaveElement.style.display = "block"
        }

        const commentEditElement = document.querySelector(`.edit-comment[data-comment-no="${comment.comment_id}"]`);
        if (commentEditElement) {
            commentEditElement.textContent = "초기화"
        }
    }
}

// NOTE : 댓글 저장
async function saveEditedComment(comment_id){
    const newContent = document.querySelector(`.comment-text[data-comment-no="${comment_id}"]`);
    if(newContent.value.trim() == ""){
       alert("댓글 내용을 입력해주세요."); 
       return;
    }
    
    try {
        // NOTE : 서버에 PATCH 요청으로 댓글 수정 내용 전송
        const response = await fetch(`${apiUrl}/comments/${comment_id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent.value })
        });

        const commentElement = document.querySelector(`.save-comment[data-comment-no="${comment_id}"]`);
        if (response.ok) {
            // NOTE : 댓글 텍스트를 `<input>`에서 `<p>`로 다시 변경
            const newCommentText = document.createElement('p');
            newCommentText.classList.add('comment-text');
            newCommentText.textContent = newContent.value;
            newContent.replaceWith(newCommentText);
            
            // NOTE : 저장 버튼 숨기기
            if (commentElement) {
                commentElement.style.display = "none"
            }
            
            alert('댓글이 수정되었습니다.');

            const commentEditElement = document.querySelector(`.edit-comment[data-comment-no="${comment_id}"]`);
            if (commentEditElement) {
                commentEditElement.textContent = "수정" 
            }

            const commentDate = document.querySelector(`[data-comment-no="${comment_id}"] .comment-date`)
            if(commentDate)
            {
                commentDate.insertAdjacentHTML('afterend', '<span class="board-change">(수정됨)</span>');
            }
        } else {
            alert('댓글 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split("=");
        if (key === name) return value;
    }
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// NOTE : 조회수 증가
const addViewCount = async(board_id) => {
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const cookieName = `viewed_${board_id}`;

    if (getCookie(cookieName) !== today) {
        setCookie(cookieName, today, 1);
    }else{
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/boards/view/${board_id}`, { 
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }, 
        });
        if (!response.ok) {
            console.error('Failed to increment view count');
        }
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
}

// NOTE : 좋아요 클릭 이벤트 처리 함수
const likeBoard = async(board_id) => {
    try {
        const response = await fetch(`${apiUrl}/boards/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({board_id}),
            credentials: "include",
        });

        const result = await response.json();
        if (response.ok) {
            const likeCountElement = document.getElementById('span_like_cnt');

            likeCountElement.textContent = result.data.like_cnt;
        } else {
            alert('좋아요 처리에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error liking board:', error);
    }
}

// NOTE : 좋아요 버튼 클릭 이벤트 리스너 추가
document.getElementById('div_like_cnt').addEventListener('click', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const board_id = urlParams.get('board_id');
    if (board_id) {
        likeBoard(parseInt(board_id, 10));
    }
});

(async () => {
    // 인증 성공 시 페이지 데이터 로드
    auth.requireLogin(); 
    if(auth.isLoggedIn()){
        loadBoardInfo();
        loadComments();
    }
})();