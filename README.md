# 🚀 WorkTrack: MERN Project Management Platform

**WorkTrack** is a robust, full-stack project management application (inspired by tools like Jira and Asana) designed to streamline team collaboration, workspace organization, and task tracking. Built using the **MERN Stack** (MongoDB, Express, React, Node.js), it features secure authentication, real-time updates, and automated email notifications.

---

## 📖 Introduction

This platform serves as a centralized hub for teams to manage their workflows. Users can create distinct **Organizations (Workspaces)**, invite team members via email, create multiple **Projects**, and track progress using Kanban-style **Tasks**. The application ensures data integrity and security through Role-Based Access Control (RBAC) and keeps users informed with automated email alerts.

---

## 🏗 System Architecture

The application follows a monolithic client-server architecture:

1.  **Frontend (Client):** A React application built with Vite, handling the UI and state management (Redux).
2.  **Backend (Server):** A Node.js/Express REST API that handles business logic.
3.  **Database:** **MongoDB** (Atlas or Local) for storing flexible, document-based data.
4.  **ORM:** **Mongoose** for data modeling and validation.
5.  **Authentication:** **Clerk** handles user identity and authentication flows.
6.  **Background Services:** **Inngest** manages background jobs (emails, webhooks).

---

## 🛠 Tech Stack

### **Frontend**
* **Framework:** React 18 (Vite)
* **Language:** JavaScript (ES6+)
* **Styling:** Tailwind CSS
* **State Management:** Redux Toolkit
* **HTTP Client:** Axios
* **Icons:** Lucide React

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** Clerk (Clerk SDK)
* **Email Service:** Nodemailer (SMTP via Brevo)
* **Event Handling:** Inngest

---

## ✨ Key Features

* **🔐 Authentication:** Secure Sign-up/Login via Clerk (Google/Email).
* **🏢 Workspace Management:** Create and switch between multiple organizations (multi-tenancy).
* **👥 Team Collaboration:** Invite members via email; manage Admin/Member roles.
* **📂 Project Tracking:** Track project status, start dates, and deadlines.
* **✅ Task Management:** Kanban-style task tracking (To Do, In Progress, Done) with priorities.
* **💬 Comments:** Real-time discussion threads on tasks.
* **📧 Notifications:** Automated email alerts for task assignments and due dates.

---

## 🗄 Database Schema (MongoDB)

The database consists of **7 Mongoose Collections**.

### 1. **User**
Stores user identity.
- `clerkId`: String (Unique, from Clerk)
- `name`: String
- `email`: String
- `image`: String
- `createdAt`: Date

### 2. **Workspace**
Represents an organization.
- `name`: String
- `slug`: String (Unique)
- `imageUrl`: String
- `ownerId`: ObjectId (Ref: User)

### 3. **WorkspaceMember**
Links users to workspaces.
- `workspaceId`: ObjectId (Ref: Workspace)
- `userId`: ObjectId (Ref: User)
- `role`: String ('Admin' | 'Member')

### 4. **Project**
Container for tasks.
- `workspaceId`: ObjectId (Ref: Workspace)
- `name`: String
- `status`: String ('Planning', 'Active', 'Completed')
- `priority`: String
- `startDate`: Date
- `endDate`: Date
- `teamLeadId`: ObjectId (Ref: User)

### 5. **ProjectMember**
Assigns workspace members to specific projects.
- `projectId`: ObjectId (Ref: Project)
- `userId`: ObjectId (Ref: User)

### 6. **Task**
Individual work items.
- `projectId`: ObjectId (Ref: Project)
- `assigneeId`: ObjectId (Ref: User)
- `title`: String
- `description`: String
- `type`: String ('Task', 'Bug', 'Feature', 'Improvement')
- `status`: String ('To Do', 'In Progress', 'Done')
- `priority`: String
- `dueDate`: Date

### 7. **Comment**
Discussions on tasks.
- `taskId`: ObjectId (Ref: Task)
- `userId`: ObjectId (Ref: User)
- `content`: String
