"use client";
import { useEffect, useState } from "react";
import TodoList from "./components/todolist";

export default function Home() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const API_URL = "http://localhost:5000/todos";

  // Fetch todos
  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!task.trim()) return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task }),
    });

    setTask("");
    fetchTodos();
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  };

  // Edit todo
  const editTodo = async (id, newText) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    });

    fetchTodos();
  };

  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Fullstack Todo App 🚀</h2>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task..."
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <TodoList
        todos={todos}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </main>
  );
}
