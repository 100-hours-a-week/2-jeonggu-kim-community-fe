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
        await new Promise((resolve) => setTimeout(resolve, 50));
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

    // 작성자 정보
    const boardAuthorDiv = document.createElement('div');
    boardAuthorDiv.classList.add('board-author');

    const authorIconDiv = document.createElement('div');
    authorIconDiv.classList.add('author-icon');

    const profileImg = document.createElement('img');
    profileImg.classList.add('board-profile-image');
    profileImg.src = profileUrl;
    profileImg.alt = '프로필 이미지';

    const nicknameSpan = document.createElement('span');
    nicknameSpan.textContent = post.nickname;

    authorIconDiv.appendChild(profileImg);
    boardAuthorDiv.appendChild(authorIconDiv);
    boardAuthorDiv.appendChild(nicknameSpan);

    // 게시글 내용
    const boardWrapperDiv = document.createElement('div');
    boardWrapperDiv.classList.add('board-wrapper');

    const titleH2 = document.createElement('h2');
    titleH2.classList.add('board-title');
    titleH2.textContent = post.title;

    const contentSpan = document.createElement('span');
    contentSpan.classList.add('board-content');
    contentSpan.textContent = boardContent;

    boardWrapperDiv.appendChild(titleH2);
    boardWrapperDiv.appendChild(contentSpan);

    // 게시글 메타 정보
    const boardMetaDiv = document.createElement('div');
    boardMetaDiv.classList.add('board-meta');

    // 좋아요 정보
    const likeSpan = document.createElement('span');
    const likeImg = document.createElement('img');
    likeImg.classList.add('board-img-icon', 'width-15');
    likeImg.src = '../../images/like.png';
    likeImg.alt = '좋아요 아이콘';
    likeSpan.appendChild(likeImg);
    likeSpan.append(` ${post.like_cnt}`);

    // 댓글 정보
    const commentSpan = document.createElement('span');
    const commentImg = document.createElement('img');
    commentImg.classList.add('board-img-icon', 'width-10');
    commentImg.src = '../../images/comment.png';
    commentImg.alt = '댓글 아이콘';
    commentSpan.appendChild(commentImg);
    commentSpan.append(` ${post.comment_cnt}`);

    // 조회수 정보
    const viewSpan = document.createElement('span');
    const viewImg = document.createElement('img');
    viewImg.classList.add('board-img-icon', 'width-10');
    viewImg.src = '../../images/view.png';
    viewImg.alt = '조회수 아이콘';
    viewSpan.appendChild(viewImg);
    viewSpan.append(` ${post.view_cnt}`);

    // 작성일 정보
    const dateSpan = document.createElement('span');
    dateSpan.classList.add('board-date');
    const dateImg = document.createElement('img');
    dateImg.classList.add('board-img-icon', 'width-15');
    dateImg.src = '../../images/date.png';
    dateImg.alt = '날짜 아이콘';
    dateSpan.appendChild(dateImg);
    dateSpan.append(` ${formatDate(post.date)}`);

    boardMetaDiv.appendChild(likeSpan);
    boardMetaDiv.appendChild(commentSpan);
    boardMetaDiv.appendChild(viewSpan);
    boardMetaDiv.appendChild(dateSpan);

    // 요소 추가
    boardArticle.appendChild(boardAuthorDiv);
    boardArticle.appendChild(boardWrapperDiv);
    boardArticle.appendChild(boardMetaDiv);

    // 게시글 클릭 이벤트 리스너
    boardArticle.addEventListener("click", () => {
        const board_id = boardArticle.dataset.board_id;
        window.location.href = `/boardInfo?board_id=${board_id}`;
    });

    return boardArticle;
};


// NOTE : 게시글 목록을 서버에서 가져오는 함수
const loadBoardList = async (currentPage = 1, searchKey = "", searchValue = "") => {
    if (isLoading || allPostsLoaded) return;

    try {
        isLoading = true; // NOTE : 로딩 상태로 설정
        showLoadingAnimation(); // NOTE : 로딩 애니메이션 표시

        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 지연

        // NOTE : Query String 생성
        const queryParams = createQueryParams(currentPage, searchKey, searchValue);

        // NOTE : 게시글 목록 API 호출
        const response = await fetch(`${apiUrl}/boards?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
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
    if (result.data) {
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

    // NOTE: 검색 시 기존 게시글 리스트 초기화
    const boardSection = document.querySelector('.board-list');
    boardSection.textContent = ''; // 기존 게시글 제거

    currentPage = 1;  // 페이지를 1로 초기화
    allPostsLoaded = false;  // 모든 게시글 로드 상태 초기화
    hasMore = true;  // 새로운 검색 결과가 더 있을 수 있도록 초기화

    loadBoardList(currentPage, searchKey, searchValue);
};


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
            const selectedText = event.target.textContent;
    
            dropButton.textContent = selectedText;  // 버튼의 텍스트만 추가
            const caretSpan = document.createElement('span');  // ▼ 아이콘을 위한 span 생성
            caretSpan.classList.add('caret-icon');
            caretSpan.textContent = '▼';
    
            dropButton.appendChild(caretSpan);  // ▼ 아이콘을 버튼에 추가
    
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

const showLoadingAnimation = () => {
    const sentinel = document.getElementById("scroll-sentinel");

    // 기존 로딩 요소 제거
    while (sentinel.firstChild) {
        sentinel.removeChild(sentinel.firstChild);
    }

    // 로딩 애니메이션 추가
    const loaderDiv = document.createElement('div');
    loaderDiv.classList.add('loader');  // 로딩 애니메이션 클래스 추가
    sentinel.appendChild(loaderDiv);
};

// NOTE : 로딩 애니메이션 숨김
const hideLoadingAnimation = () => {
    const sentinel = document.getElementById("scroll-sentinel");

    // 모든 자식 요소 제거 (로딩 애니메이션 숨김)
    while (sentinel.firstChild) {
        sentinel.removeChild(sentinel.firstChild);
    }
};

// NOTE : Infinite Scroll 중지 메시지
const stopInfiniteScroll = () => {
    const sentinel = document.getElementById("scroll-sentinel");

    // 기존 메시지 제거
    while (sentinel.firstChild) {
        sentinel.removeChild(sentinel.firstChild);
    }

    // 종료 메시지 추가
    const endMessageDiv = document.createElement('div');
    endMessageDiv.classList.add('end-message');  // 종료 메시지 클래스 추가
    endMessageDiv.textContent = "모든 게시글을 불러왔습니다.";
    sentinel.appendChild(endMessageDiv);
};
  
// NOTE : 화면에 데이터가 충분한지 확인하는 함수
const checkIfMoreDataNeeded = () => {
    const sentinel = document.getElementById("scroll-sentinel");

    if (!isLoading && !allPostsLoaded) {
        const sentinelRect = sentinel.getBoundingClientRect();
        if (sentinelRect.top <= window.innerHeight) {
            if(!hasMore) {return;}
            loadBoardList(currentPage);
        }
    }
};