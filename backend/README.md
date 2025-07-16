# Kept 백엔드 서버

## 설정 방법

### 1. MySQL 설치 및 실행
- MySQL 8.0 이상 설치
- MySQL 서버 실행 확인

### 2. 데이터베이스 설정
```bash
# MySQL에 접속
mysql -u root -p

# setup.sql 스크립트 실행
source setup.sql
```

또는 직접 실행:
```sql
CREATE DATABASE IF NOT EXISTS kept CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kept;
```

### 3. 의존성 설치
```bash
cd backend
go mod tidy
```

### 4. 서버 실행
```bash
go run .
```

서버가 `http://localhost:6727`에서 실행됩니다.

## API 엔드포인트

- `GET /` - 메모 데이터 조회
- `GET /health` - 서버 상태 확인

## 개선된 기능

1. **안정적인 데이터베이스 연결**
   - 연결 풀 설정
   - 자동 재연결
   - 정상적인 종료 처리

2. **향상된 에러 처리**
   - 상세한 에러 메시지
   - 프로그램 크래시 방지
   - 로깅 개선

3. **자동 테이블 생성**
   - 애플리케이션 시작 시 테이블 자동 생성
   - 데이터베이스 스키마 관리

4. **서버 관리**
   - 헬스체크 엔드포인트
   - 정상적인 종료 처리
   - 시그널 핸들링

## 문제 해결

### 데이터베이스 연결 오류
1. MySQL 서버가 실행 중인지 확인
2. 포트 3306이 사용 가능한지 확인
3. 사용자명/비밀번호 확인
4. 데이터베이스 'kept'가 존재하는지 확인

### 포트 충돌
- 다른 프로세스가 6727 포트를 사용 중인 경우 다른 포트로 변경 