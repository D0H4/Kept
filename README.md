<div align="center">

# Kept

Keep, Kept, Kept

---

A simple note-taking app with Go backend and React frontend.

</div>

---

## 🚀 How to Install & Run (Windows + Docker)

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- (Optional) [Git](https://git-scm.com/) for cloning the repository

### 2. Clone the Project
```bash
git clone https://github.com/your-username/kept.git
cd kept
```

### 3. Start with Docker Compose
```bash
docker-compose up -d
```

- This will start MySQL, Go backend, and React frontend containers.
- The app will be available at: [http://localhost](http://localhost)

### 4. Stop All Containers
```bash
docker-compose down
```

### 5. Reset All Data (Remove DB data)
```bash
docker-compose down -v
```

---

## 📦 Project Structure
- `backend/` : Go (Echo) REST API & DB logic
- `src/`     : React (Vite) frontend
- `docker-compose.yml` : Multi-container orchestration

---

## 📝 Sample Data
Sample notes are automatically loaded from `backend/setup.sql` when the database is first created.

---

## 💡 Features
- Fast note CRUD
- Trash & restore
- Pin & archive
- Color labels
- Responsive UI

---

## 🛠️ Tech Stack
- Go, Echo, MySQL
- React, Vite, Tailwind CSS
- Docker, Nginx
