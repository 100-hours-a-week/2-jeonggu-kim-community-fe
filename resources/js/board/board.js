import { formatDate, fetchConfig } from '/js/common/common.js';
let apiUrl = '';
let currentPage = 1; // 현재 페이지
let isLoading = false; // 로딩 중인지 확인
let allPostsLoaded = false; // 모든 데이터가 로드되었는지 확인
let hasMore = true;
document.getElementById("btn_board_add").addEventListener("click", () => {
    // NOTE : 버튼 클릭 시 /boardAdd로 이동
    window.location.href = '/boardAdd';
});

// NOTE : 게시글 목록을 HTML에 렌더링하는 함수
const renderBoardList = async (boardList) => {
    const boardSection = document.querySelector('.board-list');

    for (const [index, board] of boardList.entries()) {
        const boardArticle = createBoardElement(board);
        boardSection.appendChild(boardArticle);

        // NOTE : 하나씩 렌더링하는 효과를 위해 100ms 대기
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
};

const createBoardElement = (post) => {
    const boardArticle = document.createElement('article');
    boardArticle.classList.add('board');
    boardArticle.dataset.board_id = post.board_id;

    let boardContent = post.content;
    const profileUrl = post.profile_url || "../../images/default_profile.png";

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
        const board_id = boardArticle.dataset.board_id;
        window.location.href = `/boardInfo?board_id=${board_id}`;
    });

    return boardArticle;
};


// NOTE : 게시글 목록을 서버에서 가져오는 함수
const loadBoardList = async (currentPage = 1, searchKey = "", searchValue = "") => {
    if (isLoading || allPostsLoaded) return;
    if (!hasMore) return;

    try {
        isLoading = true; // NOTE : 로딩 상태로 설정
        showLoadingAnimation(); // NOTE : 로딩 애니메이션 표시

        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연

        // NOTE : Query String 생성
        const queryParams = createQueryParams(currentPage, searchKey, searchValue);

        // NOTE : 게시글 목록 API 호출
        const response = await fetch(`${apiUrl}/boards?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            handleResponse(result);

            // NOTE : 모든 데이터 로드 확인
            if (result.length < 6) {
              allPostsLoaded = true;
              stopInfiniteScroll();
            } 
          } else {
            console.warn("데이터를 불러오지 못했습니다.");
          }

    } catch (error) {
        console.error('Error loading board list:', error);
        alert('게시글 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
        isLoading = false; // NOTE : 로딩 상태 해제
        hideLoadingAnimation();
        checkIfMoreDataNeeded();
      }
};

// NOTE : Query String 생성 함수
const createQueryParams = (currentPage, searchKey, searchValue) => {
    const queryParams = new URLSearchParams();
    if (searchKey) queryParams.append("searchKey", searchKey);
    if (searchValue) queryParams.append("searchValue", searchValue);
    if (currentPage) queryParams.append("currentPage", currentPage);
    return queryParams;
};

// NOTE : 응답 처리 함수
const handleResponse = (result) => {
    if (result.message === 'success' && result.data) {
        renderBoardList(result.data);
        hasMore = result.hasMore;
        currentPage++;
    } else {
        alert('게시글 목록을 불러오는 데 실패했습니다.');

    }
};

const requestSearch = () => {
    const inputElement = document.getElementById("btn_search");
    const searchValue = inputElement.value.trim();
    const searchKey = document.getElementById("dropdown-button").dataset.searchKey;

    loadBoardList(1, searchKey, searchValue);
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
        if (event.key === 'Enter') {
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
        setupHeaderEvents();
        initInfiniteScroll(); // NOTE : Infinite Scroll 초기화
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('페이지를 초기화하는 중 오류가 발생했습니다.');
    }
});

const initInfiniteScroll = () => {
    const sentinel = document.getElementById("scroll-sentinel");
  
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !allPostsLoaded && !isLoading) {
            loadBoardList(currentPage);
        }
      },
      {
        root: null, // NOTE : 뷰포트 기준
        rootMargin: "0px", // NOTE : 감지 범위 여유
        threshold: 1.0, // NOTE : 요소가 완전히 보여야 감지
      }
    );
  
    observer.observe(sentinel);
};

// NOTE : 로딩 애니메이션 표시
const showLoadingAnimation = () => {
    const sentinel = document.getElementById("scroll-sentinel");
    sentinel.innerHTML = `<div class="loader"></div>`;
};
  
  // NOTE : 로딩 애니메이션 숨김
const hideLoadingAnimation = () => {
    const sentinel = document.getElementById("scroll-sentinel");
    sentinel.innerHTML = "";
};
  
// NOTE : Infinite Scroll 중지
const stopInfiniteScroll = () => {
    const sentinel = document.getElementById("scroll-sentinel");
    sentinel.innerHTML = `<div class="end-message">모든 게시글을 불러왔습니다.</div>`;
};
  
// NOTE : 화면에 데이터가 충분한지 확인하는 함수
const checkIfMoreDataNeeded = () => {
    const sentinel = document.getElementById("scroll-sentinel");

    if (!isLoading && !allPostsLoaded) {
        const sentinelRect = sentinel.getBoundingClientRect();
        if (sentinelRect.top <= window.innerHeight) {
            loadBoardList(currentPage);
        }
    }
};