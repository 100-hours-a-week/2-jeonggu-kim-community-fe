// NOTE : "YYYY-MM-DD HH:MM:SS" 형식으로
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // NOTE : 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// NOTE : 공통 파일 업로드 함수
export const uploadImage = async (fileInput, uploadUrl, imageType) => {
    if (fileInput.files.length === 0) return { success: false, message: '파일이 없습니다.' }; // NOTE : 파일이 선택되지 않은 경우 종료
            
    const formData = new FormData();
    formData.append(imageType, fileInput.files[0]);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,
            },
            body: formData
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error('파일 업로드에 실패했습니다.');
            return { success: false, message: result.message || '이미지 업로드 실패' };
        }else {
            return { success: true, filePath: result.filePath, message: '이미지 업로드 성공' };
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, message: '서버 오류가 발생했습니다.' };
    }
}

export const uploadFile = async (file, folderName) => {
    const config = await fetchConfig();
    const apiUrl = config.apiUrl;

    const formData = new FormData();
    
    formData.append('profileImage', file);
    formData.append('folderName', folderName);

    try {
        const response = await fetch(`${apiUrl}/images`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('파일 업로드에 실패했습니다.');
        }

        const resultJson = await response.json();
        return resultJson.url; // NOTE: 업로드된 파일 URL 반환
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        throw error; // NOTE: 호출한 함수에서 처리하도록 오류 던짐
    }
}

// NOTE : 환경 변수
export const fetchConfig = async () => {
    try {
        const response = await fetch('/config'); // 서버에서 환경 변수 호출
        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.status}`);
        }
        const config = await response.json();
        return config; // 전체 환경 변수 객체 반환
    } catch (error) {
        console.error('Error fetching config:', error);
        throw error;
    }
};

export const encodeBase64 = (data) => {
    return btoa(data);
};