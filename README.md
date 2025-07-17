# 🧲 Job Importer System

A scalable Node.js-based backend system with a frontend interface that imports job listings from external APIs, queues them using Redis, saves them into MongoDB, and provides a visual history of all imports.

---

## 🚀 Tech Stack

### Backend:
- **Node.js + Express**
- **MongoDB + Mongoose**
- **Redis (BullMQ for queueing)**
- **Axios** for external API calls
- **node-cron** for scheduled imports
- **CORS + Dotenv** for config

### Frontend:
- **React.js + Tailwind CSS**
- Displays import job logs fetched from the backend API

---

## 📁 Project Structure

```
job-importer/
│
├── client/                 # Next.js frontend
│   ├── public/
│   └── src/
│       └── components/
│       └── pages/
│       └── App.jsx
│
├── server/                 # Node backend
│   ├── controllers/
│   ├── jobs/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│   └── server.js
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🔁 How It Works

1. **Fetch Jobs**: Data is fetched from multiple external job APIs.
2. **Queue Jobs**: Jobs are pushed into Redis queue using BullMQ.
3. **Worker Process**: A worker pulls jobs from the queue and saves them to MongoDB.
4. **Cron Scheduler**: Runs every X minutes to auto-import jobs.
5. **Frontend**: React app displays job import logs in a table via `/api/import-logs`.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/shubhamch95/job-importer.git
cd job-importer
```

### 2. Environment Variables

**For backend (/server/.env)**
```env
PORT=6000
MONGO_URI=mongodb://localhost:27017/job-importer
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
API_1_URL=https://example.com/api1
API_2_URL=https://example.com/api2
```

**For frontend (/client/.env)**
```env
VITE_BACKEND_URL=http://localhost:6000
```

### 3. Install Dependencies

**Backend**
```bash
cd server
npm install
```

**Frontend**
```bash
cd ../client
npm install
```

---

## 🧪 Run the App

### Start Redis server (if not already running)
```bash
redis-server
```

### Start Backend
```bash
cd server
npm run dev
```

### Start Frontend
```bash
cd ../client
npm run dev
```

---

## 🔍 Screens

- **Job Import Logs View**: Table displaying past import history
- **Live Console Logs**: Shows job fetching and worker status

---

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1da29374-1b9c-42d7-af13-97a102c985e2" />


<img width="1920" height="580" alt="image" src="https://github.com/user-attachments/assets/b25b5f31-fbc7-4544-a96b-1bd99fc3d28f" />


## ✅ Features

- ✅ Auto-import jobs from multiple APIs
- ✅ Queue management with Redis
- ✅ Background processing via Worker
- ✅ MongoDB storage
- ✅ Import logs view on React frontend
- ✅ Cron jobs for automation

---

## 📦 Future Improvements

- Pagination and filtering in frontend logs
- Admin panel with manual trigger button
- API integration for more job sources
- Email/reporting system on failure

---

## 👨‍💻 Author

Made with ❤️ by **Shubham Choudhery**
