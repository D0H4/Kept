# React 프론트엔드용 Dockerfile
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사
COPY package*.json ./

# 모든 의존성 설치 (개발 의존성 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# Nginx 이미지 사용
FROM nginx:alpine

# 한글 폰트 설치
RUN apk add --no-cache fontconfig ttf-dejavu

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일들을 Nginx 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"] 