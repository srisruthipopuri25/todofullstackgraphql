"use client";
import { useState } from "react";

export default function TodoList({ todos, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    onEdit(id, editText);
    setEditingId(null);
  };

  return (
    <ul style={{ marginTop: 20 }}>
      {todos && todos.map((todo) => (
        <li key={todo._id} style={{ marginBottom: 10 }}>
          {editingId === todo._id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={() => saveEdit(todo._id)}>
                Save
              </button>
            </>
          ) : (
            <>
              <span>{todo.text}</span>
              <button onClick={() => startEdit(todo)}>
                Edit
              </button>
            </>
          )}

          <button onClick={() => onDelete(todo._id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
