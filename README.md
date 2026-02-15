# 📝 Multi-User Todo App (Full Stack GraphQL)

A full-stack multi-user Todo application built using **Next.js, GraphQL, Apollo Server, MongoDB, and Mongoose**.

This project demonstrates:

- GraphQL queries & mutations
- Pagination
- Full CRUD (Users + Tasks)
- Client-side data fetching with `useState` & `useEffect`
- Clean architecture separation (Frontend / Backend)

---

## 🚀 Tech Stack

### 🖥 Frontend
- Next.js 16 (App Router)
- React (useState, useEffect)
- Fetch API
- Client-side rendering
- JavaScript (ES6+)

### ⚙ Backend
- Node.js
- Express.js
- Apollo Server
- GraphQL

### 🗄 Database
- MongoDB
- Mongoose (ODM)

---

## 📂 Project Structure


---

## ✨ Features

### 👤 Users
- Create user
- Read users
- Update user
- Delete user (cascades delete tasks)
- Select user from dropdown

### 📋 Tasks
- Create task
- Edit task name
- Toggle complete
- Delete task
- Pagination support (`page` & `limit`)

---

## 📡 GraphQL API

### Queries

```graphql
query {
  users {
    id
    name
    email
    tasks(page: 1, limit: 10) {
      tasks {
        id
        title
        completed
      }
      totalCount
    }
  }
}
.env file 
MONGO_URI=mongodb://127.0.0.1:27017/todoGraphql
