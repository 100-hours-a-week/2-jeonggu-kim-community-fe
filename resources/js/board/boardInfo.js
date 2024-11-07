import { formatDate } from '/js/common/common.js';

const editButton = document.getElementById("btn_edit");
const deleteButton = document.getElementById("btn_delete");
const addButton = document.getElementById('btn_comment_add');
const boardPopup = document.getElementById("div_board_popup");
const commentPopup = document.getElementById("div_comment_popup");

editButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const boardNo = urlParams.get('boardNo');
    window.location.href = `/boardEdit?boardNo=${boardNo}`;
});

deleteButton.addEventListener("click", () => openBoardPopup());

const loadBoardInfo = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const boardNo = urlParams.get('boardNo');
    
    if (!boardNo) {
        alert('게시글 번호가 존재하지 않습니다.');
        history.back(); // NOTE : 이전 페이지로 이동
        return;
    }

    try {
        const response = await fetch(`/board/${boardNo}`); // NOTE : 서버로 boardNo 요청
        const result = await response.json();
        
        if (result.message === 'success' && result.data) {
            renderBoardInfo(result.data); // NOTE : 데이터가 있으면 렌더링
        } else {
            alert('게시글 정보를 불러오는 데 실패했습니다.');
            history.back(); // NOTE : 이전 페이지로 이동
        }
    } catch (error) {
        console.error('Error loading board info:', error);
        alert('서버 오류가 발생했습니다.');
        history.back(); // NOTE : 이전 페이지로 이동
    }

    addViewCount(boardNo)

}

const renderBoardInfo = (board) => {
    if (board.isAuthor) {
        document.getElementById('div_board_button').style.display = "block";
        document.getElementById('btn_board_confirm').setAttribute('data-board-no', board.id);
    }
    document.getElementById('img_profile_url').setAttribute("src", board.profileUrl);
    if (board.imageFile) {
        document.getElementById('img_url').setAttribute("src", board.imageFile);
    }
    document.getElementById('h2_section_title').textContent = board.title;
    document.getElementById('span_board_author').textContent = board.nickname;
    document.getElementById('span_board_dt').textContent = formatDate(board.date);
    document.getElementById('p_board_content').textContent = board.content;
    document.getElementById('span_like_cnt').textContent = board.likeCnt || 0;
    document.getElementById('span_view_cnt').textContent = board.viewCnt || 0;
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
    const boardNo = urlParams.get('boardNo');
    
    if (!boardNo) {
        alert('게시글 번호가 존재하지 않습니다.');
        history.back(); // NOTE : 이전 페이지로 이동
        return;
    }

    try {
        const response = await fetch(`/comment/${boardNo}`);
        const result = await response.json();
        if (result.message === 'success' && result.data) {
            document.getElementById('span_comment_cnt').textContent = result.data.length || 0;

            const commentListSection = document.querySelector('.comment-list');
            commentListSection.innerHTML = ''; // NOTE : 기존 댓글 제거
            
            result.data.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.setAttribute('data-comment-no', comment.id);

                let html = ``;
                if (comment.isAuthor) {
                html += `<div class="comment-actions">
                            <button class="edit-comment" data-comment-no="${comment.id}">수정</button>
                            <button class="delete-comment" data-comment-no="${comment.id}">삭제</button>
                            <button class="save-comment" data-comment-no="${comment.id}" style="display:none;">저장</button>
                            </div>`;
                }
                html += `<div class="comment-info">
                                <img class="img_profile" src="${comment.profileFile}">
                                <span class="comment-author">${comment.email}</span>
                                <span class="comment-date">${comment.date}</span>
                        </div>
                        <p class="comment-text">${comment.content}</p>`;
                commentElement.innerHTML = html;
                if(comment.isAuthor) {
                    commentElement.querySelector('.edit-comment').addEventListener('click', () => toggleEditComment(commentElement, comment));
                    commentElement.querySelector('.delete-comment').addEventListener('click', () => {closeCommentPopup(comment.id)});
                    commentElement.querySelector('.save-comment').addEventListener('click', () => {saveEditedComment(comment.id)});
                }
                
                commentListSection.appendChild(commentElement);
            });
        } else {
            console.error('댓글을 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// NOTE : 댓글 입력 시 등록 버튼 활성화
document.getElementById('txt_comment_info').addEventListener('input', (event) => {
    const content = document.getElementById('txt_comment_info').value.trim();
    document.getElementById('btn_comment_add').disabled = !content;
});

// NOTE : 댓글 등록 요청
const addComment = async (boardNo) => {
    const content = document.getElementById('txt_comment_info').value;
    const response = await fetch('/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            boardNo,
            content
        })
    });

    const result = await response.json();

    if (response.ok && result.message === 'success') {
        alert('댓글이 성공적으로 추가되었습니다.');
        document.getElementById('txt_comment_info').value = ''; // NOTE : 댓글 입력 필드 초기화
        document.getElementById('btn_comment_add').disabled = true;

        const commentCountElement = document.getElementById('span_comment_cnt');
        commentCountElement.textContent = result.data.commentCnt;
          
        addCommentToList(result.data); // NOTE : 댓글 리스트에 새 댓글 추가
    } else {
        alert(result.message || '댓글 등록에 실패했습니다.');
    }
}

// NOTE : 댓글 등록 버튼 클릭 이벤트
document.getElementById('btn_comment_add').addEventListener('click', () => {
    // NOTE : URL에서 boardNo 가져오기
    const boardNo = new URLSearchParams(window.location.search).get('boardNo');
    if (boardNo) {
        addComment(parseInt(boardNo, 10));
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
        const boardNo = event.target.getAttribute('data-board-no');
        const response = await fetch(`/board/${boardNo}`, {
            method: 'DELETE'
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
        const response = await fetch(`/comment/${commentNo}`, {
            method: 'DELETE'
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
    commentElement.setAttribute('data-comment-no', comment.id);

    let html = '';
    html += `<div class="comment-actions">
                <button class="edit-comment" data-comment-no="${comment.id}">수정</button>
                <button class="delete-comment" data-comment-no="${comment.id}">삭제</button>
                <button class="save-comment" data-comment-no="${comment.id}" style="display:none;">저장</button>
                </div>`;
    html += `<div class="comment-info">
                <img class="img_profile" src="${comment.profileFile}">
                <span class="comment-author">${comment.email}</span>
                <span class="comment-date">${comment.date}</span>
             </div>
             <p class="comment-text">${comment.content}</p>`;
    commentElement.innerHTML = html;

    // NOTE : 이벤트 리스너 추가
    commentElement.querySelector('.edit-comment').addEventListener('click', () => toggleEditComment(commentElement, comment));
    commentElement.querySelector('.delete-comment').addEventListener('click', () => {closeCommentPopup(comment.id)});
    commentElement.querySelector('.save-comment').addEventListener('click', () => {saveEditedComment(comment.id)});

    // NOTE : 댓글 리스트에 새 댓글 요소 추가
    commentListSection.appendChild(commentElement);
}

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
        inputElement.dataset.commentNo = comment.id;
        commentTextElement.replaceWith(inputElement);
        
        // NOTE : 저장 버튼 추가
        const commentElement = document.querySelector(`.save-comment[data-comment-no="${comment.id}"]`);
        if (commentElement) {
            commentElement.style.display = "block" // 해당 댓글 요소 제거
        }
    }
}

// NOTE : 댓글 저장
async function saveEditedComment(commentId){
    const newContent = document.querySelector(`.comment-text[data-comment-no="${commentId}"]`);
    try {
        // NOTE : 서버에 PATCH 요청으로 댓글 수정 내용 전송
        const response = await fetch(`/comment/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent.value })
        });

        const commentElement = document.querySelector(`.save-comment[data-comment-no="${commentId}"]`);
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
        } else {
            alert('댓글 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
}

// NOTE : 조회수 증가
const addViewCount = async(boardNo) => {
    try {
        const response = await fetch(`/board/view/${boardNo}`, { method: 'PATCH' });
        if (!response.ok) {
            console.error('Failed to increment view count');
        }
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
}
// NOTE : 좋아요 클릭 이벤트 처리 함수
const likeBoard = async(boardNo) => {
    try {
        const response = await fetch('/board/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({boardNo})
        });

        const result = await response.json();
        if (response.ok) {
            const likeCountElement = document.getElementById('span_like_cnt');

            likeCountElement.textContent = result.data.likeCnt;
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
    const boardNo = urlParams.get('boardNo');
    if (boardNo) {
        likeBoard(parseInt(boardNo, 10));
    }
});

loadBoardInfo();
loadComments();