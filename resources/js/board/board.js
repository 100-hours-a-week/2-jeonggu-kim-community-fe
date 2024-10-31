document.getElementById("btn_board_add").addEventListener("click", function () {
    // NOTE : 버튼 클릭 시 /boardAdd로 이동
    window.location.href = '/boardAdd';
});

// 모든 .board 클래스를 가진 요소들을 선택합니다.
const boardArticles = document.querySelectorAll(".board");

// 각 .board 요소에 클릭 이벤트 리스너를 추가합니다.
boardArticles.forEach(article => {
    article.addEventListener("click", () => {
        // NOTE : data-boardno 값을 가져옵니다.
        const boardNo = article.getAttribute("data-boardno");

        // NOTE : /boardInfo로 이동하면서 boardNo를 쿼리 파라미터로 전달합니다.
        window.location.href = `/boardInfo?boardNo=${boardNo}`;
    });
});