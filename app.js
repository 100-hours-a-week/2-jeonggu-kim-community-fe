const express = require('express');
const cookieParser = require('cookie-parser');

const path = require('path');
const app = express();
const PORT = 5555;
// NOTE : authRoutes와 isAuthenticated 임포트

app.use(express.json());

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message, data: null });
});


app.use(express.static(path.join(__dirname, 'resources')));
app.use('/css', express.static(path.join(__dirname, 'resources/css')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/login.html'));
});
// NOTE : 회원 가입
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/register.html'));
});
// NOTE : 로그인
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/login.html'));
});
// NOTE : 게시판 리스트
app.get('/board', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/board/board.html'));
});
//NOTE : 게시판 상세 
app.get('/boardInfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/board/boardInfo.html'));
});
// NOTE : 게시판 수정
app.get('/boardEdit', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/board/boardEdit.html'));
});
// NOTE : 게시판 추가
app.get('/boardAdd', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/board/boardAdd.html'));
});
// NOTE : 회원 수정
app.get('/userEdit', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/user/userEdit.html'));
});

app.use(cookieParser());

// NOTE : 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});