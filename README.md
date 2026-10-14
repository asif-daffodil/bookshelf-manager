# BookShelf Manager (MERN Application)

A modern full-stack **BookShelf Manager** application built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS. It allows users to track their personal reading list with instant UI updates, client-side and server-side validations, and persistent data storage.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
  - [Local MongoDB vs MongoDB Atlas](#local-mongodb-vs-mongodb-atlas)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
  - [Book Data Shape](#book-data-shape)
  - [Endpoints & Examples](#endpoints--examples)
  - [Error Handling Contract](#error-handling-contract)
- [Postman Collection](#postman-collection)
- [Automated Testing & Verification](#automated-testing--verification)

---

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS (Plain JavaScript)
- **Backend**: Node.js + Express.js (Plain JavaScript)
- **Database**: MongoDB + Mongoose (Local MongoDB by default, MongoDB Atlas supported)
- **Architecture**: REST API with centralized validation, unified error responses, and React `useReducer` state management.

---

## Folder Structure

```text
bookshelf-manager/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── books.js              # Fetch client for all backend endpoints
│   │   ├── components/
│   │   │   ├── BookForm.jsx          # Book creation form with inline validation
│   │   │   ├── BookItem.jsx          # Book card (strikethrough, badge, check icon, actions)
│   │   │   └── BookList.jsx          # Book list with loading skeletons and empty states
│   │   ├── App.jsx                   # Central state management via useReducer
│   │   ├── index.css                 # Tailwind CSS styles and directives
│   │   └── main.jsx                  # React application entry point
│   ├── .env                          # Client environment variables (VITE_API_URL)
│   ├── .env.example                  # Template for client environment variables
│   ├── index.html                    # Root HTML file
│   ├── package.json                  # Client dependencies & scripts
│   ├── postcss.config.js             # PostCSS configuration for Tailwind
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   └── vite.config.js                # Vite build and dev server configuration
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js                 # Mongoose connection configuration
    │   ├── controllers/
    │   │   └── bookController.js     # Controller handlers (GET, POST, PUT, DELETE)
    │   ├── middleware/
    │   │   ├── errorHandler.js       # Centralized 404 and JSON error handler
    │   │   └── validate.js           # Request input and ObjectId validation
    │   ├── models/
    │   │   └── Book.js               # Mongoose schema with custom toJSON transform
    │   ├── routes/
    │   │   └── bookRoutes.js         # Express router for /books
    │   └── index.js                  # Express app entry point & server bootstrap
    ├── .env                          # Server environment variables (PORT, MONGODB_URI)
    ├── .env.example                  # Template for server environment variables
    ├── BookShelf.postman_collection.json # Exported Postman collection for all 4 endpoints
    ├── package.json                  # Server dependencies & scripts
    ├── test-endpoints.js             # Automated API endpoint verification suite
    └── test-browser.js               # End-to-end browser verification suite (Puppeteer)
```

---

## Prerequisites

- **Node.js**: v18.x or newer (Tested on Node.js v26)
- **npm**: v9.x or newer
- **MongoDB**: Either a local MongoDB instance running on port 27017 or a MongoDB Atlas connection string.

---

## Environment Configuration

### Server Environment (`server/.env`)

Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bookshelf
CLIENT_ORIGIN=http://localhost:5173
```

#### Local MongoDB vs MongoDB Atlas

- **Local MongoDB (Default)**:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/bookshelf
  ```
  Ensure your local MongoDB service is running (e.g. `mongod` or Windows service `MongoDB Server`).

- **MongoDB Atlas**:
  Provide your cloud cluster URI with database name:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/bookshelf?retryWrites=true&w=majority
  ```

### Client Environment (`client/.env`)

Create `client/.env` based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

---

## Installation & Setup

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Install Client Dependencies

```bash
cd ../client
npm install
```

---

## Running the Application

### Running Backend (Server)

From the `server` directory:

```bash
# Start development server with nodemon auto-reload:
npm run dev

# Or start in production mode:
npm start
```
The server will start on port `5000` (or `PORT` from `.env`).

### Running Frontend (Client)

From the `client` directory:

```bash
# Start Vite development server:
npm run dev

# Or build for production:
npm run build
npm run preview
```
The client will start at `http://localhost:5173`.

---

## API Reference

### Book Data Shape

Every book returned by the API strictly adheres to the required contract:

```json
{
  "id": "6acdeb54ac1d3c622044c89e",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "status": "unread",
  "createdAt": "2026-10-13T08:27:00.362Z"
}
```

- Returns `id` (string) instead of `_id`.
- Strips internal Mongoose `__v` field.
- Default `status` is `"unread"`.

---

### Endpoints & Examples

#### 1. Create a Book
- **Endpoint**: `POST /books`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt & David Thomas"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "6acdec098197779f4cb7ca79",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt & David Thomas",
    "status": "unread",
    "createdAt": "2026-10-13T08:30:01.123Z"
  }
  ```

#### 2. Get All Books
- **Endpoint**: `GET /books`
- **Description**: Returns all books ordered newest first.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "6acdec098197779f4cb7ca79",
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt & David Thomas",
      "status": "unread",
      "createdAt": "2026-10-13T08:30:01.123Z"
    },
    {
      "id": "6acdeb54ac1d3c622044c89e",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "status": "read",
      "createdAt": "2026-10-13T08:27:00.362Z"
    }
  ]
  ```

#### 3. Mark Book as Read
- **Endpoint**: `PUT /books/:id`
- **Description**: Sets status of the book to `"read"`.
- **Response**: `200 OK`
  ```json
  {
    "id": "6acdec098197779f4cb7ca79",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt & David Thomas",
    "status": "read",
    "createdAt": "2026-10-13T08:30:01.123Z"
  }
  ```

#### 4. Delete a Book
- **Endpoint**: `DELETE /books/:id`
- **Description**: Permanently removes a book from the reading list.
- **Response**: `200 OK`
  ```json
  {
    "message": "Book deleted successfully",
    "id": "6acdec098197779f4cb7ca79"
  }
  ```

---

### Error Handling Contract

All error responses from the API consistently return JSON formatted as `{ "error": "message" }`:

| Scenario | HTTP Status | Example Response |
|---|---|---|
| Missing / empty title | `400 Bad Request` | `{"error": "Title is required"}` |
| Missing / empty author | `400 Bad Request` | `{"error": "Author is required"}` |
| Malformed ObjectId | `400 Bad Request` | `{"error": "Invalid book id"}` |
| Book not found | `404 Not Found` | `{"error": "Book not found"}` |
| Undefined API route | `404 Not Found` | `{"error": "Route not found"}` |
| Malformed JSON body | `400 Bad Request` | `{"error": "Invalid JSON payload"}` |

---

## Postman Collection

A complete Postman Collection is located at:
`server/BookShelf.postman_collection.json`

### Importing into Postman
1. Open Postman.
2. Click **Import** in the upper left.
3. Select `server/BookShelf.postman_collection.json`.
4. The collection is configured with variables:
   - `baseUrl`: defaults to `http://localhost:5000`
   - `bookId`: automatically captured when running the "Create a Book" request.

---

## Automated Testing & Verification

Both automated backend testing and browser end-to-end verification scripts are included:

### Run Backend API Test Suite
Tests all 4 endpoints, parameter validation, ObjectId sanitization, response shapes, and sorting:
```bash
cd server
node test-endpoints.js
```

### Run End-to-End Browser Test Suite
Performs automated browser tests using headless Chrome/Edge verifying client-side validation, book creation, mark as read (strikethrough + badge + check icon), deletion, and responsive desktop/mobile viewports:
```bash
cd server
node test-browser.js
```

