# Go 백엔드용 Dockerfile
FROM golang:1.24-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# Go 모듈 파일 복사
COPY go.mod go.sum ./

# 의존성 다운로드
RUN go mod download

# 소스 코드 복사
COPY . .

# 바이너리 빌드
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 최종 이미지
FROM alpine:latest

# ca-certificates와 한글 폰트 설치
RUN apk --no-cache add ca-certificates fontconfig ttf-dejavu

WORKDIR /root/

# 빌드된 바이너리 복사
COPY --from=builder /app/main .

# 포트 노출
EXPOSE 6727

# 애플리케이션 실행
CMD ["./main"] 