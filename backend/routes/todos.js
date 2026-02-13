const express = require("express");
const router = express.Router();

const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todocontroller");

// GET all todos
// GET /api/todos
router.get("/", getTodos);

// CREATE new todo
// POST /api/todos
router.post("/", createTodo);

// UPDATE todo
// PATCH /api/todos/:id
router.patch("/:id", updateTodo);

// DELETE todo
// DELETE /api/todos/:id
router.delete("/:id", deleteTodo);

module.exports = router;
