import { formatDate } from '/js/common/common.js';

document.getElementById("btn_board_add").addEventListener("click", () => {
    // NOTE : 버튼 클릭 시 /boardAdd로 이동
    window.location.href = '/boardAdd';
});

// NOTE : 게시글 목록을 HTML에 렌더링하는 함수
const renderBoardList = (boardList) => {
    const boardSection = document.querySelector('.board-list');
    boardSection.innerHTML = ''; // NOTE : 기존 게시글을 지우기

    boardList.forEach(post => {
        const boardArticle = document.createElement('article');
        boardArticle.classList.add('board');
        boardArticle.dataset.boardNo = post.boardNo;

        boardArticle.innerHTML = `
            <h2 class="board-title">${post.title}</h2>
            <div class="board-meta">
                <span>좋아요 ${post.likeCnt}</span>
                <span>댓글 ${post.commentCnt}</span>
                <span>조회수 ${post.viewCnt}</span>
                <span class="board-date">${formatDate(post.date)}</span>
            </div>
            <hr class="full-width-line">
            <div class="board-author">
                <div class="author-icon"><img class="board-profile-image" src="${post.profileUrl}" alt="프로필 이미지"></div>
                <span>${post.nickname}</span>
            </div>
        `;

        boardArticle.addEventListener("click", () => {
            // NOTE : data-board-no 값
            const boardNo = boardArticle.dataset.boardNo;
    
            // NOTE : /boardInfo로 이동하면서 boardNo를 쿼리 파라미터로 전달
            window.location.href = `/boardInfo?boardNo=${boardNo}`;
        });

        // NOTE : 게시글 추가
        boardSection.appendChild(boardArticle);
    });
};

// NOTE : 게시글 목록을 서버에서 불러오는 함수
const loadBoardList = async () => {
    try {
        // NOTE : 게시글 목록 API 호출
        const response = await fetch('/board/list');
        const result = await response.json();

        if (result.message === 'success' && result.data) {
            renderBoardList(result.data); // NOTE : 성공 시 게시글 렌더링
        } else {
            alert('게시글 목록을 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('Error loading board list:', error);
        alert('서버 오류가 발생했습니다.');
    }
};

// NOTE : 페이지 로드 시 게시글 목록 불러오기
document.addEventListener('DOMContentLoaded', loadBoardList);
