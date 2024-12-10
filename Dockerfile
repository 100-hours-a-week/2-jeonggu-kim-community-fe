# NOTE : 기본 이미지
FROM node:16-alpine

# NOTE : 작업 디렉토리 설정 -> 앞으로 모든 명령은 해당 디렉토리 기준으로 실행
WORKDIR /usr/src/app

# NOTE : package.json과 package-lock.json만 복사 (레이어 캐싱 활용)
COPY package*.json ./

# NOTE : 의존성 설치 (Production 의존성만 설치하여 용량 감소)
RUN npm install --production

# NOTE : 애플리케이션 코드 복사
COPY . .

# NOTE : 포트 노출
EXPOSE 3000

# NOTE : 애플리케이션 시작 명령
CMD ["node", "app.js"]