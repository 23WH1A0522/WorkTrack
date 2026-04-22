<<<<<<< HEAD
# WorkTrack

WorkTrack is now wired as a working local MERN project:
- `frontend` is a Vite React app using Redux and the Express API
- `backend` is an Express + MongoDB API with JWT auth
- a demo workspace, project, tasks, and demo users are seeded automatically on first backend start
=======
# 🚀 WorkTrack - MERN Project Management Platform

WorkTrack is a powerful full-stack **Project Management Web Application** inspired by tools like Jira and Asana. It is designed to help teams collaborate efficiently, manage projects, track tasks, and organize workflows in one centralized platform.

Built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**, WorkTrack provides secure authentication, workspace management, Kanban task tracking, team collaboration, and automated email notifications. :contentReference[oaicite:0]{index=0}
>>>>>>> e151629300c371c88ad47c69c8f287c72d31726c

## Local setup

<<<<<<< HEAD
1. Start MongoDB locally on `mongodb://127.0.0.1:27017`
2. Start the backend from the project root:

```bash
npm run dev:backend
```
=======
## 📌 Features

### 🔐 Authentication
- Secure Login / Signup using Clerk
- Google Sign-In
- Email & Password Authentication

### 🏢 Workspace Management
- Create multiple organizations/workspaces
- Easy workspace switching
- Invite members via email

### 👥 Team Collaboration
- Role-Based Access Control (RBAC)
- Roles:
  - Admin
  - Member

### 📁 Project Management
- Create and manage multiple projects
- Track project progress
- Set priorities
- Manage deadlines and start dates

### ✅ Task Management (Kanban Board)
- To Do
- In Progress
- Done

Supports:
- Task Priority
- Task Types:
  - Bug
  - Feature
  - Improvement

### 💬 Comments & Discussion
- Task-wise comment threads
- Team communication under each task

### 📧 Notifications
- Task Assignment Emails
- Due Date Reminders
- Status Update Alerts
>>>>>>> e151629300c371c88ad47c69c8f287c72d31726c

3. Start the frontend from the project root in another terminal:

<<<<<<< HEAD
```bash
npm run dev:frontend
```

4. Open `http://localhost:5173`

## Demo login
=======
## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Redux Toolkit
- Axios
- Lucide React

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- Clerk

### Background Jobs
- Inngest

### Email Service
- Nodemailer (Brevo SMTP)
>>>>>>> e151629300c371c88ad47c69c8f287c72d31726c

- Email: `alex@worktrack.demo`
- Password: `demo12345`

<<<<<<< HEAD
## Environment

Backend env lives in [backend/.env](/c:/Users/rajag/OneDrive/Desktop/sirisha/test_worktrack/WorkTrack/backend/.env).

Frontend env lives in [frontend/.env](/c:/Users/rajag/OneDrive/Desktop/sirisha/test_worktrack/WorkTrack/frontend/.env).
=======
## 🏗️ System Architecture

Frontend (React + Redux)  
⬇  
Backend API (Node.js + Express.js)  
⬇  
MongoDB Database
>>>>>>> e151629300c371c88ad47c69c8f287c72d31726c

## Verified

<<<<<<< HEAD
- Frontend lint passes
- Frontend production build passes

## Notes

- The backend needs a running MongoDB instance to start successfully.
- The seeded data is only created when the users collection is empty.
=======
## 📂 Project Structure

### Backend

backend/

├── src/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ ├── services/

│ ├── utils/

│ ├── inngest/

│ └── app.js

├── .env

└── package.json


### Frontend

src/

├── components/

├── pages/

├── redux/

├── services/

├── utils/

├── layouts/

└── App.jsx


---

## 🗄️ Database Collections

- User
- Workspace
- WorkspaceMember
- Project
- ProjectMember
- Task
- Comment

---

## 🔗 API Endpoints

### Auth APIs
- POST /auth/sync
- GET /auth/me

### Workspace APIs
- POST /workspaces
- GET /workspaces
- GET /workspaces/:id
- PUT /workspaces/:id
- POST /workspaces/:id/invite
- GET /workspaces/:id/members

### Project APIs
- POST /projects
- GET /projects/workspace/:workspaceId
- GET /projects/:id
- PUT /projects/:id
- DELETE /projects/:id

### Task APIs
- POST /tasks
- GET /tasks/project/:projectId
- PUT /tasks/:id
- PUT /tasks/:id/status
- DELETE /tasks/:id

### Comment APIs
- POST /comments
- GET /comments/task/:taskId

---

## 🔒 Security Features

- Clerk Authentication
- Token Verification
- Role-Based Authorization
- Protected Routes
- Input Validation
- Multi-Tenant Workspace Isolation
- Secure SMTP Mailing

---

## 🌟 Future Enhancements

- Real-Time Updates using Socket.IO
- Analytics Dashboard
- Task Activity Logs
- File Upload Support
- Calendar Integration
- Notification Preferences

---

## 📌 Conclusion

WorkTrack is a real-world MERN Stack project management platform built for modern teams. It enables secure collaboration, workspace management, task tracking, and workflow automation in a scalable environment.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.
>>>>>>> e151629300c371c88ad47c69c8f287c72d31726c
