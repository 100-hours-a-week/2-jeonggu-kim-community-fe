# project
jeonggu.kim community


# Description
This is a simple community web application where users can create, edit, view, and delete posts.
-> 이 프로젝트는 사용자가 게시글을 작성, 수정, 조회, 삭제할 수 있는 간단한 커뮤니티 웹 애플리케이션입니다.


# Technologies Used
HTML, CSS, JavaScript, Express


ver1: vanilla express json
ver2 : react express mySQL
🔗 [FE Github](https://github.com/100-hours-a-week/2-jeonggu-kim-community-fe)
🔗 [BE Github](https://github.com/jeonggu0112/2-jeonggu-kim-community-be)


# Features
- User Authentication: Register and Login functionality
사용자 인증: 회원가입 및 로그인
- Board Management: Create, Edit, View, and Delete posts
게시글 관리: 작성, 수정, 조회, 삭제
- Search Functionality: Search for posts by keywords
검색 기능: 키워드를 통해 게시글 검색
- Header and Footer Integration: Consistent navigation across pages
헤더/푸터: 일관된 페이지 네비게이션 제공


# Project Structure
├─app
│  └─views
│      │  index.html
│      │  login.html
│      │  register.html
│      │
│      ├─board
│      │      board.html
│      │      boardAdd.html
│      │      boardEdit.html
│      │      boardInfo.html
│      │
│      └─user
│              userEdit.html
│
└─resources
    ├─css
    │  │  login.css
    │  │  register.css
    │  │
    │  ├─board
    │  │      board.css
    │  │      boardAdd.css
    │  │      boardEdit.css
    │  │      boardInfo.css
    │  │
    │  ├─common
    │  │      common.css
    │  │      footer.css
    │  │      header.css
    │  │
    │  └─user
    │          userEdit.css
    │
    ├─images
    │
    └─js
        │  login.js
        │  userEdit.js
        │
        ├─board
        │      board.js
        │      boardAdd.js
        │      boardEdit.js
        │      boardInfo.js
        │
        ├─common
        │      auth.js
        │      common.js
        │      footer.js
        │      header.js
        │
        └─user
                register.js
                userEdit.js


#Setup
1. Clone the project
   git clone https://github.com/your-repo/jeonggu-kim-community.git
2. Navigate to the project folder
  cd 2-jeonggu-kim-community-fe
3. Start the application
  node app.js
4. Access the application
  Open your browser and go to http://localhost:5555 to view the application.



# 시연 영상
[![Jeonggu.kim's BOARD_v.1](https://youtu.be/J31R97Q49sQ)
[![Jeonggu.kim's BOARD_v.2](https://youtu.be/pqsBPss-uD8)

 
# Logs and Notes
🔗 **Week 1~4 Notes**  
🔗[2024-10-30](https://typical-peach-2a6.notion.site/1-148b50da96b04c649b6725837294076a?pvs=74)
🔗[2024-11-08](https://typical-peach-2a6.notion.site/2-137645850ce3806f9448d591dcd61c6e?pvs=74)
🔗[2024-11-14](https://typical-peach-2a6.notion.site/3-13e645850ce38059afdbe026d2f9025a?pvs=74)
🔗[2024-11-21](https://typical-peach-2a6.notion.site/4-145645850ce380c6b4d0f42f171fe936?pvs=4)
