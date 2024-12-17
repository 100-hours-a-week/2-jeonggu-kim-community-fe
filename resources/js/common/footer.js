function createFooter() {
    const footerHTML = `
        <div class="footer-container">
            <p>&copy; 2024 Jeonggu.kim. All Rights Reserved.</p>
            <ul class="footer-links">
                <li><a href="https://github.com/dev-jeonggu/2-jeonggu-kim-community-fe">About</a></li>
                <li><a href="mailto:dev.jeonggu@gmail.com?subject=Contact%20Us">Contact</a></li>
            </ul>
        </div>
    `;

    // NOTE: Footer를 페이지 하단에 추가
    const footerContainer = document.getElementById("footer");
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

// NOTE: 페이지 로드 시 Footer 추가
document.addEventListener("DOMContentLoaded", createFooter);
