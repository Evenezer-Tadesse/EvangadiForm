# 📘 Evangadi Forum API Documentation

## ✅ Overview

This document outlines the REST API endpoints for the Evangadi Forum backend system, built using **Node.js** and **MySQL**. It includes authentication, user management, and Q\&A functionality.

---

## 1. 🔐 Authentication Middleware

### 🔧 Middleware

* **Purpose**: Validates the JWT token for protected routes.
* **Header**:

  ```
  Authorization: Bearer <token>
  ```

### ✅ Expected Behavior

| Status Code      | Description              |
| ---------------- | ------------------------ |
| 200 OK           | Authenticated request    |
| 401 Unauthorized | Missing or invalid token |

---

## 2. 📝 User Sign-Up

### 🔧 Endpoint

```
POST /api/users/signup
```

### 📅 Request Body

```json
{
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### ✅ Expected Behavior

| Status Code     | Description                  |
| --------------- | ---------------------------- |
| 201 Created     | User successfully registered |
| 400 Bad Request | Missing or invalid fields    |
| 409 Conflict    | Email already exists         |

---

## 3. 🔓 User Login

### 🔧 Endpoint

```
POST /api/users/login
```

### 📅 Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### 📄 Response

```json
{
  "token": "jwt_token_here"
}
```

### ✅ Expected Behavior

| Status Code      | Description                  |
| ---------------- | ---------------------------- |
| 200 OK           | Login successful, token sent |
| 401 Unauthorized | Invalid credentials          |

---

## 4. ❓ Get Answers for a Question

### 🔧 Endpoint

```
GET /api/answers/:questionId
```

### 📅 Path Parameter

* `questionId`: ID of the question

### 📄 Response

```json
[
  {
    "answer_id": 1,
    "user_id": 3,
    "answer": "This is an answer",
    "created_at": "2025-06-03T12:00:00Z"
  }
]
```

### ✅ Expected Behavior

| Status Code   | Description             |
| ------------- | ----------------------- |
| 200 OK        | Answers retrieved       |
| 404 Not Found | No answers for question |

---

## 5. ✍️ Post Answer to a Question

### 🔧 Endpoint

```
POST /api/answers
```

### 📅 Request Body

```json
{
  "question_id": 2,
  "answer": "Here’s a detailed answer"
}
```

* **Auth Required**: Yes (JWT Token in header)

### 📄 Response

```json
{
  "message": "Answer submitted successfully"
}
```

### ✅ Expected Behavior

| Status Code      | Description                |
| ---------------- | -------------------------- |
| 201 Created      | Answer posted successfully |
| 400 Bad Request  | Invalid data               |
| 401 Unauthorized | Missing/invalid token      |

---

## 6. 📄 Get All Questions

### 🔧 Endpoint

```
GET /api/questions
```

### 📄 Response

```json
[
  {
    "question_id": 1,
    "title": "How do I start Node.js?",
    "description": "Beginner here, looking for help...",
    "user_id": 2,
    "created_at": "2025-06-03T10:30:00Z"
  }
]
```

### ✅ Expected Behavior

| Status Code   | Description         |
| ------------- | ------------------- |
| 200 OK        | Questions retrieved |
| 404 Not Found | No questions found  |

---

## 7. 🔍 Get Single Question

### 🔧 Endpoint

```
GET /api/questions/:questionId
```

### 📅 Path Parameter

* `questionId`: ID of the question

### 📄 Response

```json
{
  "question_id": 2,
  "title": "How does Express routing work?",
  "description": "Please explain with examples...",
  "user_id": 1,
  "created_at": "2025-06-01T11:00:00Z"
}
```

### ✅ Expected Behavior

| Status Code   | Description        |
| ------------- | ------------------ |
| 200 OK        | Question retrieved |
| 404 Not Found | Question not found |

---

## 8. ➕ Post Question

### 🔧 Endpoint

```
POST /api/questions
```

### 📅 Request Body

```json
{
  "title": "How to use Node.js with MySQL?",
  "description": "I need help connecting to MySQL and running queries."
}
```

* **Auth Required**: Yes (JWT Token in header)

### 📄 Response

```json
{
  "message": "Question posted successfully",
  "question_id": 10
}
```

### ✅ Expected Behavior

| Status Code      | Description                  |
| ---------------- | ---------------------------- |
| 201 Created      | Question posted successfully |
| 400 Bad Request  | Missing or invalid fields    |
| 401 Unauthorized | Missing/invalid token        |

---

## 📌 Notes

* All request/response formats are in JSON.
* Protected endpoints require JWT tokens via `Authorization` header.
* Ensure MySQL tables exist: `users`, `questions`, `answers`.

           ****HAPPY HACKING!!****