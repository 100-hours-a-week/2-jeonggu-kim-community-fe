import { formatDate, fetchConfig } from '/js/common/common.js';
let apiUrl = '';

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
        boardArticle.dataset.board_id = post.board_id;
        let boardContent = post.content;
        let profileUrl = post.profile_url || "../../images/default_profile.png";

        const maxLength = 40;
        if (boardContent.length > maxLength) {
            boardContent = boardContent.slice(0, maxLength) + '...';
        }
        boardArticle.innerHTML = `
            <div class="board-author">
                <div class="author-icon"><img class="board-profile-image" src="${profileUrl}" alt="프로필 이미지"></div>
                <span>${post.nickname}</span>
            </div>
            <div class="board-wrapper">
                <h2 class="board-title">${post.title}</h2>
                <span class="board-content">${boardContent}</span>
            </div>
            <div class="board-meta">
                <span><img class='board-img-icon width-15' src='../../images/like.png'> ${post.like_cnt}</span>
                <span><img class='board-img-icon width-10' src='../../images/comment.png'> ${post.comment_cnt}</span>
                <span><img class='board-img-icon width-10' src='../../images/view.png'> ${post.view_cnt}</span>
                <span class="board-date"><img class='board-img-icon width-15' src='../../images/date.png'> ${formatDate(post.date)}</span>
            </div>
        `;

        boardArticle.addEventListener("click", () => {
            // NOTE : data-board-no 값
            const board_id = boardArticle.dataset.board_id;
    
            // NOTE : /boardInfo로 이동하면서 board_id를 쿼리 파라미터로 전달
            window.location.href = `/boardInfo?board_id=${board_id}`;
        });

        // NOTE : 게시글 추가
        boardSection.appendChild(boardArticle);
    });
};

// NOTE : 게시글 목록을 서버에서 불러오는 함수
const loadBoardList = async (searchKey = "", searchValue = "") => {
    try {
        // NOTE: Query String 생성
        const queryParams = new URLSearchParams();
        if (searchKey !== "") queryParams.append("searchKey", searchKey);
        if (searchValue !== "") queryParams.append("searchValue", searchValue);

        // NOTE : 게시글 목록 API 호출
        const response = await fetch(`${apiUrl}/boards?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
            }
        });

        // 응답 처리
        const result = await response.json();

        if (result.message === 'success' && result.data) {
            renderBoardList(result.data); // NOTE : 성공 시 게시글 렌더링
        } else {
            alert('게시글 목록을 불러오는 데 실패했습니다.');
            window.location.replace("/"); 
        }
    } catch (error) {
        console.error('Error loading board list:', error);
        alert('서버 오류가 발생했습니다.');
        window.location.replace("/"); 
        //window.history.back();
    }
};

const requestSearch = () => {
    const inputElement = document.getElementById("btn_search");
    const searchValue = inputElement.value.trim();
    const searchKey = document.getElementById("dropdown-button").dataset.searchKey;

    loadBoardList(searchKey, searchValue);

}

const setupHeaderEvents = () => {
    const dropButton = document.getElementById('dropdown-button');
    const dropMenu = document.getElementById('dropdown-menu');
    const searchButton = document.getElementById('btn_search');

    // NOTE : 버튼 클릭 시 드롭다운 토글
    dropButton.addEventListener('click', () => {
        const isExpanded = dropButton.getAttribute('aria-expanded') === 'true';
        dropButton.setAttribute('aria-expanded', !isExpanded);
        dropMenu.hidden = isExpanded;
    });

    // NOTE : 메뉴 아이템 클릭 시 선택 처리
    dropMenu.addEventListener('click', (event) => {
        if (event.target.classList.contains('dropdown-item')) {
            const selectedValue = event.target.dataset.value;
            dropButton.innerHTML = `${event.target.textContent} <span class="caret-icon">▼</span>`;
            dropButton.setAttribute('aria-expanded', false);
            dropMenu.hidden = true;
            
            dropButton.dataset.searchKey = selectedValue;
        }
    });

    // NOTE : 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', (event) => {
    if (!dropButton.contains(event.target) && !dropMenu.contains(event.target)) {
        dropButton.setAttribute('aria-expanded', false);
        dropMenu.hidden = true;
    }
    });

    searchButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { // 또는 event.keyCode === 13
            requestSearch();
        }
    });
}
// NOTE : 페이지 로드 시 게시글 목록 불러오기
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // NOTE: 환경 변수 API URL 로드
        const config = await fetchConfig();
        apiUrl = config.apiUrl;

        // NOTE: 초기화 함수 실행
        loadBoardList();
        setupHeaderEvents();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('페이지를 초기화하는 중 오류가 발생했습니다.');
    }
});
