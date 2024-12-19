const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000
const cors = require('cors');

app.use(cors());
// NOTE : authRoutes와 isAuthenticated 임포트

require('dotenv').config({ path: path.resolve(__dirname, 'config/.env') });

app.use(express.json());

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message, data: null });
});


app.use(express.static(path.join(__dirname, 'resources')));
app.use('/css', express.static(path.join(__dirname, 'resources/css')));
app.use('/js', express.static(path.join(__dirname, 'resources/js')));

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

// API 엔드포인트로 환경 변수 전달
app.get('/config', (req, res) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
        res.status(500).json({ error: 'API URL not configured' });
    } else {
        res.json({ apiUrl });
    }
});

// 정적 파일 제공 및 캐시 설정
app.use(
    "/resources/images",
    express.static(path.join(__dirname, "resources/images"), {
      maxAge: "30d", 
    })
  );

// NOTE : 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});