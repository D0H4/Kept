package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var (
	db   *sql.DB
	once sync.Once
	mu   sync.RWMutex
)

// 환경 변수 가져오기 함수
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func dbConnect() (*sql.DB, error) {
	// 환경 변수에서 데이터베이스 설정 가져오기
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "3306")
	dbUser := getEnv("DB_USER", "root")
	dbPassword := getEnv("DB_PASSWORD", "1234")
	dbName := getEnv("DB_NAME", "kept")

	// Database connection string
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("database connection failed: %v", err)
	}

	// Connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test connection
	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, fmt.Errorf("database ping failed: %v", err)
	}

	log.Println("Database connection successful")
	return db, nil
}

func getDB() (*sql.DB, error) {
	mu.RLock()
	if db != nil {
		// Check if connection is valid
		err := db.Ping()
		if err == nil {
			mu.RUnlock()
			return db, nil
		}
		// Close if connection is invalid
		db.Close()
		db = nil
	}
	mu.RUnlock()

	// Create new connection
	mu.Lock()
	defer mu.Unlock()

	// Check again (prevent race condition)
	if db != nil {
		return db, nil
	}

	var err error
	db, err = dbConnect()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func initDB() error {
	database, err := getDB()
	if err != nil {
		return fmt.Errorf("database connection failed: %v", err)
	}

	// Check if memo table exists and create if not
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS memo (
		id BIGINT PRIMARY KEY AUTO_INCREMENT,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		is_pinned BOOLEAN DEFAULT FALSE,
		is_archived BOOLEAN DEFAULT FALSE,
		is_deleted BOOLEAN DEFAULT FALSE,
		deleted_at DATETIME,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)`

	_, err = database.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("table creation failed: %v", err)
	}

	log.Println("memo table check/creation completed")
	return nil
}

// Note struct

type Note struct {
	ID         int64      `json:"id"`
	Title      string     `json:"title"`
	Content    string     `json:"content"`
	IsPinned   bool       `json:"isPinned"`
	IsArchived bool       `json:"isArchived"`
	IsDeleted  bool       `json:"isDeleted"`
	DeletedAt  *time.Time `json:"deletedAt"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

// Function to return all memos as JSON
func GetAllMemos() ([]Note, error) {
	err := initDB()
	if err != nil {
		return nil, err
	}
	database, err := getDB()
	if err != nil {
		return nil, fmt.Errorf("database connection failed: %v", err)
	}

	rows, err := database.Query("SELECT id, title, content, is_pinned, is_archived, is_deleted, deleted_at, created_at, updated_at FROM memo WHERE is_deleted = FALSE ORDER BY created_at DESC")
	if err != nil {
		return nil, fmt.Errorf("data query failed: %v", err)
	}
	defer rows.Close()

	var notes []Note
	for rows.Next() {
		var n Note
		err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.IsPinned, &n.IsArchived, &n.IsDeleted, &n.DeletedAt, &n.CreatedAt, &n.UpdatedAt)
		if err != nil {
			log.Printf("row scan error: %v", err)
			continue
		}
		notes = append(notes, n)
	}

	return notes, nil
}

// Create memo
func CreateMemo(title, content string, isPinned, isArchived bool) (int64, error) {
	database, err := getDB()
	if err != nil {
		return 0, err
	}
	res, err := database.Exec(`INSERT INTO memo (title, content, is_pinned, is_archived) VALUES (?, ?, ?, ?)`, title, content, isPinned, isArchived)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// Update memo
func UpdateMemo(id int64, title, content string, isPinned, isArchived bool) error {
	database, err := getDB()
	if err != nil {
		return err
	}
	_, err = database.Exec(`UPDATE memo SET title=?, content=?, is_pinned=?, is_archived=?, updated_at=NOW() WHERE id=?`, title, content, isPinned, isArchived, id)
	return err
}

// Soft delete memo (move to trash)
func SoftDeleteMemo(id int64) error {
	database, err := getDB()
	if err != nil {
		return err
	}
	_, err = database.Exec(`UPDATE memo SET is_deleted=TRUE, deleted_at=NOW() WHERE id=?`, id)
	return err
}

// Restore memo (from trash)
func RestoreMemo(id int64) error {
	database, err := getDB()
	if err != nil {
		return err
	}
	_, err = database.Exec(`UPDATE memo SET is_deleted=FALSE, deleted_at=NULL WHERE id=?`, id)
	return err
}

// Permanently delete memos older than 7 days
func PermanentlyDeleteOldMemos() error {
	database, err := getDB()
	if err != nil {
		return err
	}
	_, err = database.Exec(`DELETE FROM memo WHERE is_deleted=TRUE AND deleted_at < (NOW() - INTERVAL 7 DAY)`)
	return err
}

// Get deleted (trash) memo list
func GetDeletedMemos() ([]Note, error) {
	database, err := getDB()
	if err != nil {
		return nil, err
	}
	rows, err := database.Query("SELECT id, title, content, is_pinned, is_archived, is_deleted, deleted_at, created_at, updated_at FROM memo WHERE is_deleted = TRUE ORDER BY deleted_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var notes []Note
	for rows.Next() {
		var n Note
		err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.IsPinned, &n.IsArchived, &n.IsDeleted, &n.DeletedAt, &n.CreatedAt, &n.UpdatedAt)
		if err != nil {
			continue
		}
		notes = append(notes, n)
	}
	return notes, nil
}

func CloseDB() {
	mu.Lock()
	defer mu.Unlock()

	if db != nil {
		db.Close()
		db = nil
		log.Println("Database connection closed")
	}
}
