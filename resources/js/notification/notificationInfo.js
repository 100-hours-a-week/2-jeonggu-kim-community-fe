import { fetchConfig } from '/js/common/common.js';
const config = await fetchConfig();
const apiUrl = config.apiUrl;

import auth from '../common/auth.js';

// NOTE : 로그인 체크
const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return false; 
    }

    try {
        const response = await fetch(`${apiUrl}/auth`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

const notification = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/notifications`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: "include",
        });

        const result = await response.json();
        if (response.ok) {
            const notification = document.getElementById("div_notification");
            if (notification) {
                const dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'notification-dropdown';
                dropdownDiv.style.display = 'none';
                const headerDiv = document.createElement('div');
                headerDiv.className = 'notification-header';
                const titleSpan = document.createElement('span');
                titleSpan.textContent = '알림';
                const markAllReadBtn = document.createElement('button');
                markAllReadBtn.id = 'btn_all_read';
                markAllReadBtn.className = 'mark-all-read-btn';
                markAllReadBtn.textContent = '모두 읽음 처리';

                headerDiv.appendChild(titleSpan);
                headerDiv.appendChild(markAllReadBtn);
                dropdownDiv.prepend(headerDiv);

                const ul = document.createElement('ul');
                ul.className = 'notification-list';
                if(result.length > 0){
                    result.forEach((noticeInfo) => {
                        const li = document.createElement('li');
                        let notificationIds = noticeInfo.notification_ids;
                        let contentDetail = noticeInfo.contentDetail;
                        let count = noticeInfo.count;
                        const boardId = noticeInfo.boardId;
                        const maxLength = 10;
                        if (contentDetail) {
                            if (count){
                                li.textContent = noticeInfo.content + " : (" + count + ") " + contentDetail;
                            } else{
                                if (contentDetail.length > maxLength) {
                                    contentDetail = contentDetail.substring(0, maxLength) + '...';
                                }
                                li.textContent = noticeInfo.content + " : " + contentDetail;
                            }
                        } else {
                            li.textContent = noticeInfo.content;
                        }
                        
                        if(notificationIds) {
                            li.dataset.notificationId = notificationIds;
                        } else{
                            li.dataset.notificationId = noticeInfo.notification_id;
                        }
                        
                        if(boardId){
                            li.addEventListener('click', () => {
                                oneNotification(li, boardId);
                            });
                        }

                        ul.appendChild(li);
                    });
                } else{
                    const li = document.createElement('li');
                    li.textContent = "확인할 알림이 없습니다.";
                    ul.appendChild(li);
                }
                dropdownDiv.appendChild(ul);
                notification.insertAdjacentElement('afterend', dropdownDiv);

                let isInsideDropdown = false;

                // NOTE : 드롭다운 및 부모 요소에 이벤트 리스너 등록
                dropdownDiv.addEventListener('mouseenter', () => {
                    isInsideDropdown = true; 
                });

                dropdownDiv.addEventListener('mouseleave', () => {
                    isInsideDropdown = false; 
                    dropdownDiv.style.display = 'none'; 
                });

                notification.addEventListener('mouseenter', () => {
                    dropdownDiv.style.display = 'block';
                });

                notification.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        if (!isInsideDropdown) {
                            dropdownDiv.style.display = 'none';
                        }
                    }, 100); 
                });

                markAllReadBtn.addEventListener('click', () => {
                    allNotification(ul);            
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const allNotification = async (ulElement) => {
    try {
        const token = localStorage.getItem('token');
        const liElements = ulElement.querySelectorAll('li');

        const notificationIds = Array.from(liElements)
            .map((li) => li.dataset.notificationId)
            .filter((id) => id)
            .join(',');

        if(notificationIds == ""){
            alert("읽지 않은 알림이 없습니다.");
            return;
        }
        const response = await fetch(`${apiUrl}/notifications/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({notificationIds : notificationIds }),
            credentials: "include",
        });

        const result = await response.json();
        if (response.ok) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = '확인할 알림이 없습니다.';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#888';
            
            ulElement.replaceChildren(emptyMessage);

            alert('모두 읽음 처리되었습니다!');
        }
    } catch (error) {
        console.log(error);
    }
};

const oneNotification = async (liElement, boardId) => {
    try {
        const token = localStorage.getItem('token');
        const notificationId = liElement.dataset.notificationId;
        const response = await fetch(`${apiUrl}/notifications/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({notificationIds : notificationId }),
            credentials: "include",
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = `/boardInfo?board_id=${boardId}`;
        }
    } catch (error) {
        console.log(error);
    }
};

(async () => {
    if (auth.isLoggedIn()) {
        notification();
    }
})();