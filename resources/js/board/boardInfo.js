document.getElementById("btn_edit").addEventListener("click", () => {
    window.location.href = "/boardEdit";
});

// NOTE : 게시판 팝업 열기
function openBoardPopup() {
    document.getElementById("div_board_popup").style.display = "block";
}
// NOTE : 게시판 팝업 취소
function closeBoardPopup() {
    document.getElementById("div_board_popup").style.display = "none";
}
// NOTE : 게시판 팝업 확인
function confirmBoardDelete() {
    document.getElementById("div_board_popup").style.display = "none";
}

// NOTE : 댓글 팝업 열기
function openCommentPopup() {
    document.getElementById("div_comment_popup").style.display = "block";
}
// NOTE : 댓글 팝업 취소
function closeCommentPopup() {
    document.getElementById("div_comment_popup").style.display = "none";
}
// NOTE : 댓글 팝업 확인
function confirmCommentDelete() {
    document.getElementById("div_comment_popup").style.display = "none";
}