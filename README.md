# Todo Management Application

A full-stack Todo Management Application that allows users to create projects, manage todos, and export project summaries as GitHub gists.

## 📝 Table of Contents
- [Features](#features)
- [Technologies & Dependencies](#technologies--dependencies)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [License](#license)

## 🚀 Features

### Core Functionality
- Project management (Create, Read, Update)
- Todo management within projects (Add, Edit, Update, Mark as complete)
- Export project summaries as GitHub gists
- Basic authentication system
- Local gist export in development mode

### Data Schema
#### Project
- Unique Id
- Title
- Created Date
- List of Todos

#### Todo
- Unique Id
- Description
- Status
- Created Date
- Updated Date

### Gist Export Format
```markdown
# Project Title
Summary: 2 / 5 completed

## Pending Todos:
- [ ] Task 1
- [ ] Task 2

## Completed Todos:
- [x] Task 3
```

## 🛠️ Technologies & Dependencies

### Frontend Dependencies
```json
{
  "axios": "^1.7.7",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-icons": "^5.3.0",
  "react-router-dom": "^6.28.0",
  "react-sweetalert2": "^0.6.0",
  "sweetalert2": "^11.14.5"
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "axios": "^1.7.7",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "express-validator": "^7.2.0",
    "mongodb": "^6.10.0",
    "mongoose": "^8.8.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "mongodb-memory-server": "^10.1.2",
    "nodemon": "^3.1.7",
    "supertest": "^7.0.0"
  }
}
```

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm 
- MongoDB account
- GitHub account (for gist functionality)

### Backend Setup
1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]/backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
GITHUB_TOKEN=your_github_token
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the server
```bash
npm start
```

> **Important Note**: Set `NODE_ENV=development` for local gist export functionality. In production mode, only gist links will be created due to Vercel deployment constraints.

### Frontend Setup
1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server
```bash
npm run dev
```

## 🔑 Environment Variables

### Backend
| Variable | Description | Default | Notes |
|----------|-------------|---------|--------|
| PORT | Server port | 3000 | |
| MONGO_URI | MongoDB connection string | - | Required |
| GITHUB_TOKEN | GitHub personal access token | - | Required for gist functionality |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 | Or your running frontend host |
| NODE_ENV | Environment mode | development | Affects gist export behavior |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:3000/api |

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string (min 6 characters)"
}
```

#### Login
```http
POST /api/auth/login
Authorization: Basic <Base64(username:password)>
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "title": "string"
}
```

#### Get All Projects
```http
GET /api/projects
```

#### Get Project by ID
```http
GET /api/projects/:id
```

#### Update Project
```http
PUT /api/projects/:id
Content-Type: application/json

{
  "title": "string"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
```

### Todo Endpoints

#### Add Todo
```http
POST /api/todos/:projectId
Content-Type: application/json

{
  "description": "string"
}
```

#### Update Todo
```http
PUT /api/todos/:todoId
Content-Type: application/json

{
  "description": "string (optional)",
  "status": "Pending | Completed"
}
```

#### Delete Todo
```http
DELETE /api/todos/:todoId
```

## 🧪 Testing
To run the test suite:
```bash
cd backend
npm test
```

The project uses Jest and Supertest for backend testing, with MongoDB Memory Server for test database isolation.

## 📁 Project Structure
```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── .env
└── README.md
```
