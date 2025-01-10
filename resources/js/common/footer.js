function createFooter() {
    // NOTE : Footer 컨테이너 생성
    const footerContainer = document.getElementById("footer");
    if (!footerContainer) return;

    // NOTE : 기존 footer 내용을 제거
    while (footerContainer.firstChild) {
        footerContainer.removeChild(footerContainer.firstChild);
    }

    // NOTE : Footer 구조 생성
    const footerDiv = document.createElement('div');
    footerDiv.classList.add('footer-container');

    const footerText = document.createElement('p');
    footerText.textContent = "© 2024 Jeonggu.kim. All Rights Reserved.";

    const footerLinks = document.createElement('ul');
    footerLinks.classList.add('footer-links');

    // NOTE : About 링크
    const aboutLi = document.createElement('li');
    const aboutLink = document.createElement('a');
    aboutLink.href = "https:// NOTE :github.com/dev-jeonggu/2-jeonggu-kim-community-fe";
    aboutLink.textContent = "About";
    aboutLi.appendChild(aboutLink);

    // NOTE : Contact 링크
    const contactLi = document.createElement('li');
    const contactLink = document.createElement('a');
    contactLink.href = "mailto:dev.jeonggu@gmail.com?subject=Contact%20Us";
    contactLink.textContent = "Contact";
    contactLi.appendChild(contactLink);

    footerLinks.appendChild(aboutLi);
    footerLinks.appendChild(contactLi);

    // NOTE : Footer 요소 추가
    footerDiv.appendChild(footerText);
    footerDiv.appendChild(footerLinks);
    footerContainer.appendChild(footerDiv);
}


// NOTE : NOTE: 페이지 로드 시 Footer 추가
document.addEventListener("DOMContentLoaded", createFooter);
