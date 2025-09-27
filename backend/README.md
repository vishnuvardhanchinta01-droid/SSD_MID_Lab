# Note App API

A simple Node.js application where **students can post question** and **teachers can manage them**.
Questions have a status (`answered` / `unanswered`), an author, and a timestamp.
Teachers can sign up, log in (using Passport.js with sessions), and update the status of questions.

---

## Features

* **Students**:

  * Post new questions (default status = `unanswered`).

* **Teachers**:

  * Create teacher accounts.
  * Log in and maintain session with Passport.js.
  * Fetch questions with filters (`status`, `author`, `timestamp`).
  * Update a question’s status (`answered` / `unanswered`).
  * Delete questions.

* **Authentication**:

  * Local authentication using Passport.js.
  * Session-based login persistence.

* **Database**:

  * MongoDB with Mongoose ORM.

## Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* Passport.js (Local Strategy)
* express-session
* dotenv

---

## Project Structure

```
note-app/
├── app.js
├── config/
│   ├── db.js          # Database connection
│   └── passport.js    # Passport local strategy
├── controllers/       # Route handlers
├── middleware/        # Authentication middleware
├── models/
│   ├── Question.js    # Question schema
│   └── Teacher.js     # Teacher schema
├── routes/
│   ├── questionRoutes.js
│   └── teacherRoutes.js
└── README.md
```

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```
   MONGO_URI=mongodb://127.0.0.1:27017/noteApp
   PORT=5000
   SESSION_SECRET=your_secret_key
   REACT_URL=http://localhost:3000
   ```

4. Start the server:

   ```bash
   npm start
   ```

   Server will run at `http://localhost:5000`.

---

## API Endpoints

### Public (Students)

* **POST /question**
  Create a new question.
  Body:

  ```json
  {
    "classroom_id":"SSD_Class_1",
    "question": "What is binary search?",
    "author": "Alice"
  }
  ```

### Protected (Teachers - requires login)

* **POST /teacher/signup**
  Create a teacher account.
  Body:

  ```json
  {
    "username": "teacher1",
    "password": "123456"
  }
  ```

* **POST /teacher/login**
  Log in with username and password.
  Body:

  ```json
  {
    "username": "teacher1",
    "password": "123456"
  }
  ```

* **POST /teacher/logout**
  Log out the teacher.

* **GET /question**
  Fetch all questions (with optional filters: `status`, `author`, `from`, `to`).

* **PATCH /question/:id/status**
  Update a question’s status.
  Body:

  ```json
  {
    "status": "answered"
  }
  ```

* **DELETE /question/:id**
  Delete a question.

---

## Notes

* The server **only starts if MongoDB is connected**.
* `.env` should never be committed to Git; add it to `.gitignore`.
* Teachers must be logged in to access teacher routes (`GET`, `PATCH`, `DELETE`).

---

## License

MIT
