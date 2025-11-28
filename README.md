# HEALTHTECH

Full Hospital Management System built with the MERN stack

## Live Links

Frontend: [https://health-tech-pj6f.vercel.app/](https://health-tech-pj6f.vercel.app/)
Backend: [https://health-techp-git-main-samwel-mburus-projects.vercel.app/](https://health-techp-git-main-samwel-mburus-projects.vercel.app/)

## Overview

HEALTHTECH helps hospitals manage users, patients, doctors, appointments, records, and administration tasks. The system supports Admin, Doctor, and Patient roles. The system includes authentication, secure APIs, dashboards, and a modern frontend.

## Tech Stack

**Frontend**
React
Vite
React Router
Axios
Tailwind CSS

**Backend**
Node.js
Express
MongoDB
Mongoose
JWT Authentication
Bcrypt

## Features

### Admin

Signup
Login
Manage doctors
Manage patients
View reports

### Doctor

Login
View appointments
Update patient records
View patient details

### Patient

Signup
Login
Book appointments
View health records
Edit profile

## Project Structure

```
health-tech
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── context
    │   ├── services
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Installation

### 1. Clone the repo

```
git clone https://github.com/Mburu-Sam/health-tech.git
```

### 2. Install dependencies

Backend

```
cd backend
npm install
```

Frontend

```
cd frontend
npm install
```

### 3. Environment variables

Create a `.env` file inside the backend folder.
Required keys:

```
MONGO_URI=your_mongodb_string
JWT_SECRET=your_secret_key
```

## Running the Project

Backend

```
npm run dev
```

Frontend

```
npm run dev
```

## API Endpoints

### Auth

POST /api/auth/register
POST /api/auth/login

### Admin

GET /api/admin/doctors
POST /api/admin/add-doctor

### Doctor

GET /api/doctor/appointments
POST /api/doctor/update-record

### Patient

POST /api/patient/book
GET /api/patient/records

## Deployment

Frontend hosts on Vercel.
Backend hosts on Vercel with Serverless Functions.
MongoDB runs on MongoDB Atlas.

## Contribution

Fork the project.
Create a feature branch.
Submit a pull request.

## License

MIT License.
