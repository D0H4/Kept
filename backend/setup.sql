-- MySQL 데이터베이스 설정 스크립트
-- MySQL 서버에 접속한 후 이 스크립트를 실행하세요

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS kept CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 부여 (필요한 경우)
-- CREATE USER IF NOT EXISTS 'kept_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON kept.* TO 'kept_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 데이터베이스 선택
USE kept;

-- memo 테이블 생성 (애플리케이션에서 자동으로 생성되지만, 미리 생성할 수도 있음)
CREATE TABLE IF NOT EXISTS memo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO memo (title, content, is_pinned, is_archived, created_at, updated_at) VALUES 
('첫 번째 메모', '안녕하세요! 이것은 첫 번째 메모입니다.', FALSE, FALSE, '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('중요한 할 일', '프로젝트 마감일: 2024년 12월 31일\n- 프론트엔드 완성\n- 백엔드 API 구현\n- 테스트 완료', TRUE, FALSE, '2024-01-10 09:15:00', '2024-01-20 14:45:00'),
('아이디어', '새로운 기능 아이디어들을 여기에 기록하세요.\n- 다크모드 지원\n- 메모 검색 기능\n- 태그 시스템', FALSE, FALSE, '2024-01-18 16:20:00', '2024-01-18 16:20:00'),
('보관된 메모', '이 메모는 보관되었습니다. 나중에 참고할 내용들을 여기에 저장합니다.', FALSE, TRUE, '2024-01-05 11:00:00', '2024-01-12 13:30:00'),
('회의 노트', '오늘 회의 내용:\n- 프로젝트 진행상황 점검\n- 다음 주 계획 수립\n- 팀원 역할 분담', FALSE, FALSE, '2024-01-22 15:00:00', '2024-01-22 15:00:00'),
('개발 팁', 'React 성능 최적화:\n- React.memo 사용\n- useCallback 활용\n- 불필요한 리렌더링 방지', TRUE, FALSE, '2024-01-08 08:30:00', '2024-01-25 10:15:00');

-- 테이블 확인
SELECT * FROM memo; 