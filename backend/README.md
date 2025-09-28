# Interactive Classroom Q&A Backend API

A comprehensive Node.js backend application that enables **interactive classroom Q&A sessions** where **students can post questions** and **teachers can manage classroom environments**.

This* **PATCH /question/:id/status**
  Update a question's status.
  
  **Request Body:**
  ```json
  {
    "status": "answered"
  }
  ```
  *Valid status values: `unanswered`, `answered`, `important`*

* **DELETE /question/:id**
  Delete a specific question.orts **multi-classroom management**, where teachers can create multiple classrooms, students can join using classroom codes, and questions are organized by classroom with enhanced features like categorization, color coding, and advanced status management.

---

## Features

* **Students**:
  * Join classrooms using unique 6-character classroom codes
  * Post new questions with customizable properties:
    * Question text and author name
    * Color coding (default: yellow)
    * Category classification (default: general)
    * Automatic timestamp and status assignment
  * View questions in their joined classroom

* **Teachers**:
  * **Account Management**:
    * Create teacher accounts with secure password hashing (bcryptjs)
    * Session-based authentication with Passport.js
    * Automatic first classroom creation upon signup
  
  * **Classroom Management**:
    * Create multiple classrooms with unique 6-character codes
    * View all managed classrooms with student counts
    * Delete classrooms when no longer needed
    * Track student enrollment per classroom
  
  * **Question Management**:
    * View all questions within specific classrooms
    * Advanced filtering capabilities:
      * Filter by status (`unanswered`, `answered`, `important`)
      * Filter by author name
      * Filter by date range (from/to timestamps)
    * Update question status with three-tier system:
      * `unanswered` - Default state for new questions
      * `answered` - Marked as resolved
      * `important` - Flagged for special attention
    * Delete questions when necessary
    * Support for future TA answer functionality with attachments

* **Authentication & Security**:
  * Secure password hashing using bcryptjs with salt rounds
  * Session-based authentication using Passport.js Local Strategy
  * Protected routes with authentication middleware
  * CORS configuration for frontend integration
  * Automatic session serialization/deserialization

* **Database Architecture**:
  * MongoDB with Mongoose ODM
  * Three main collections:
    * **Teachers** - User accounts with classroom references
    * **Classrooms** - Classroom management with student enrollment
    * **Questions** - Enhanced question model with metadata
  * Proper schema relationships and data validation

## Tech Stack

* **Runtime**: Node.js with ES6 modules
* **Framework**: Express.js 5.x
* **Database**: MongoDB with Mongoose ODM 8.x
* **Authentication**: 
  * Passport.js (Local Strategy)
  * bcryptjs for password hashing
  * express-session for session management
* **Utilities**:
  * UUID for unique classroom code generation
  * CORS for cross-origin requests
  * dotenv for environment configuration
  * multer for future file upload functionality

---

## Project Structure

```
backend/
├── app.js                    # Main application entry point
├── package.json             # Dependencies and scripts
├── config/
│   ├── db.js               # MongoDB connection configuration
│   └── passport.js         # Passport.js local authentication strategy
├── controllers/            # Business logic handlers
│   ├── questionController.js  # Question CRUD operations
│   └── teacherController.js   # Teacher and classroom management
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/                # Mongoose schemas and models
│   ├── Classroom.js       # Classroom schema with student enrollment
│   ├── Question.js        # Enhanced question schema with metadata
│   └── Teacher.js         # Teacher schema with password hashing
├── routes/                # API route definitions
│   ├── questionRoutes.js  # Question-related endpoints
│   └── teacherRoutes.js   # Teacher and classroom endpoints
└── scripts/              # Utility scripts
    └── debugLogin.js     # Development debugging utilities
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

### Public Endpoints (Students)

#### Questions
* **POST /question**
  Create a new question in a classroom.
  
  **Request Body:**
  ```json
  {
    "classroom_id": "60f1b2b3c4d5e6f7g8h9i0j1",
    "question": "What is the time complexity of binary search?",
    "author": "Alice Smith",
    "color": "blue",
    "category": "algorithms"
  }
  ```

* **GET /question/:classroomId**
  Retrieve questions for a specific classroom with optional filters.
  
  **Query Parameters:**
  - `status` - Filter by status (unanswered/answered/important)
  - `author` - Filter by author name
  - `from` - Start date filter (ISO string)
  - `to` - End date filter (ISO string)

#### Classroom Access
* **GET /teacher/classroom/code/:code**
  Get classroom information by code (for students to join).

* **POST /teacher/classroom/code/:code**
  Join a classroom using the classroom code.
  
  **Request Body:**
  ```json
  {
    "studentName": "John Doe"
  }
  ```

---

### Protected Endpoints (Teachers - Authentication Required)

#### Authentication

* **POST /teacher/signup**
  Create a new teacher account with automatic first classroom.
  
  **Request Body:**
  ```json
  {
    "username": "professor_smith",
    "password": "securePassword123"
  }
  ```

* **POST /teacher/login**
  Authenticate teacher and create session.
  
  **Request Body:**
  ```json
  {
    "username": "professor_smith",
    "password": "securePassword123"
  }
  ```

* **POST /teacher/logout**
  End teacher session.

* **GET /teacher/me**
  Get current authenticated teacher information.

#### Classroom Management
* **POST /teacher/classroom**
  Create a new classroom.
  
  **Request Body:**
  ```json
  {
    "name": "Advanced Algorithms"
  }
  ```

* **GET /teacher/classrooms**
  Get all classrooms managed by the authenticated teacher.

* **DELETE /teacher/classroom/:code**
  Delete a classroom by its code.

#### Question Management

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

## Implementation Details

### Authentication Flow
1. Teachers register with username/password → automatic bcrypt hashing
2. Login creates session with Passport.js Local Strategy
3. Session serialization stores teacher ID
4. Authentication middleware protects teacher-only routes
5. Logout destroys session and clears cookies

### Classroom System
1. Teacher signup automatically creates first classroom with random 6-char code
2. Teachers can create additional classrooms with custom names
3. Students join using classroom codes (case-insensitive)
4. Student enrollment is tracked with join timestamps
5. Classroom deletion removes all associated references

### Question Management
1. Questions are tied to specific classrooms via ObjectId references
2. Support for enhanced metadata (color, category, status)
3. Advanced filtering on status, author, and date ranges
4. Three-tier status system for better organization
5. Future-ready TA answer system with attachment support

### Data Models
- **Teacher**: Secure authentication with classroom ownership
- **Classroom**: Unique codes with student enrollment tracking  
- **Question**: Rich metadata with relationship references



## License

MIT
