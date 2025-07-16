# Docker 배포 가이드

이 문서는 Kept 애플리케이션을 Docker를 사용하여 배포하는 방법을 설명합니다.

## 사전 요구사항

- Docker
- Docker Compose

## 배포 방법

### 1. 전체 애플리케이션 배포 (권장)

```bash
# 프로젝트 루트 디렉토리에서 실행
docker-compose up -d
```

이 명령어는 다음 서비스들을 시작합니다:
- **MySQL 데이터베이스** (포트 3306)
- **Go 백엔드** (포트 6727)
- **React 프론트엔드** (포트 80)

### 2. 개별 서비스 배포

#### 백엔드만 배포
```bash
cd backend
docker build -t kept-backend .
docker run -d -p 6727:6727 --name kept-backend kept-backend
```

#### 프론트엔드만 배포
```bash
docker build -t kept-frontend .
docker run -d -p 80:80 --name kept-frontend kept-frontend
```

## 환경 변수 설정

### 프론트엔드 환경 변수

`.env` 파일을 생성하여 API URL을 설정할 수 있습니다:

```env
VITE_API_URL=http://your-backend-url:6727
```

### 백엔드 환경 변수

Docker Compose에서 다음 환경 변수들을 설정할 수 있습니다:

```yaml
environment:
  - DB_HOST=mysql
  - DB_PORT=3306
  - DB_USER=root
  - DB_PASSWORD=1234
  - DB_NAME=kept
```

## 포트 설정

기본 포트 설정:
- **프론트엔드**: 80
- **백엔드**: 6727
- **MySQL**: 3306

포트를 변경하려면 `docker-compose.yml` 파일을 수정하세요.

## 데이터베이스

MySQL 데이터베이스는 Docker 볼륨을 사용하여 데이터를 영구 저장합니다. 데이터는 `mysql_data` 볼륨에 저장됩니다.

## 로그 확인

```bash
# 모든 서비스의 로그 확인
docker-compose logs

# 특정 서비스의 로그 확인
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## 서비스 중지

```bash
# 모든 서비스 중지
docker-compose down

# 볼륨까지 삭제 (데이터 손실 주의)
docker-compose down -v
```

## 문제 해결

### 1. 포트 충돌
포트가 이미 사용 중인 경우 `docker-compose.yml`에서 포트 매핑을 변경하세요.

### 2. 데이터베이스 연결 실패
백엔드가 MySQL에 연결할 수 없는 경우:
- MySQL 컨테이너가 완전히 시작될 때까지 기다리세요
- 환경 변수가 올바르게 설정되었는지 확인하세요

### 3. 프론트엔드에서 API 호출 실패
- 브라우저 개발자 도구에서 네트워크 탭을 확인하세요
- API URL이 올바르게 설정되었는지 확인하세요

## 프로덕션 배포

프로덕션 환경에서는 다음 사항들을 고려하세요:

1. **보안**: 기본 비밀번호를 변경하세요
2. **SSL**: HTTPS를 설정하세요
3. **백업**: 데이터베이스 백업을 설정하세요
4. **모니터링**: 로그 모니터링을 설정하세요

## 개발 환경

개발 중에는 다음 명령어를 사용하세요:

```bash
# 개발 모드로 실행 (볼륨 마운트)
docker-compose -f docker-compose.dev.yml up -d
```

이렇게 하면 소스 코드 변경사항이 즉시 반영됩니다. 