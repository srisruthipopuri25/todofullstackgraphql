"use client";

import { useEffect, useState } from "react";

const GRAPHQL_URL = "http://localhost:5000/graphql";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState("");
  const [editingUserEmail, setEditingUserEmail] = useState("");

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [loading, setLoading] = useState(true);

  // ===============================
  // GraphQL Helper
  // ===============================
  async function graphqlRequest(query, variables = {}) {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    return res.json();
  }

  // ===============================
  // Fetch Users
  // ===============================
  async function fetchUsers() {
    setLoading(true);

    const result = await graphqlRequest(`
      query {
        users {
          id
          name
          email
          tasks(page: 1, limit: 10) {
            tasks {
              id
              title
              priority
              completed
            }
            totalCount
          }
        }
      }
    `);

    const fetchedUsers = result?.data?.users || [];
    setUsers(fetchedUsers);

    if (fetchedUsers.length > 0 && !selectedUserId) {
      setSelectedUserId(fetchedUsers[0].id);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===============================
  // USER CRUD
  // ===============================
  async function addUser() {
    if (!newUserName || !newUserEmail) return;

    await graphqlRequest(
      `
      mutation($name: String!, $email: String!) {
        registerUser(name: $name, email: $email) { id }
      }
    `,
      { name: newUserName, email: newUserEmail }
    );

    setNewUserName("");
    setNewUserEmail("");
    fetchUsers();
  }

  async function updateUser() {
    if (!editingUserId) return;

    await graphqlRequest(
      `
      mutation($id: ID!, $name: String, $email: String) {
        updateUser(id: $id, name: $name, email: $email) { id }
      }
    `,
      {
        id: editingUserId,
        name: editingUserName,
        email: editingUserEmail,
      }
    );

    setEditingUserId(null);
    fetchUsers();
  }

  async function deleteUser() {
    if (!selectedUserId) return;
    if (!confirm("Delete this user and all tasks?")) return;

    await graphqlRequest(
      `
      mutation($id: ID!) {
        deleteUser(id: $id)
      }
    `,
      { id: selectedUserId }
    );

    setSelectedUserId("");
    fetchUsers();
  }

  // ===============================
  // TASK CRUD
  // ===============================
  async function addTask() {
    if (!newTaskTitle || !selectedUserId) return;

    await graphqlRequest(
      `
      mutation($title: String!, $userId: ID!) {
        addTask(title: $title, userId: $userId) { id }
      }
    `,
      { title: newTaskTitle, userId: selectedUserId }
    );

    setNewTaskTitle("");
    fetchUsers();
  }

  async function deleteTask(taskId) {
    await graphqlRequest(
      `
      mutation($id: ID!) {
        deleteTask(id: $id)
      }
    `,
      { id: taskId }
    );

    fetchUsers();
  }

  async function toggleTask(taskId, completed) {
    await graphqlRequest(
      `
      mutation($id: ID!, $completed: Boolean) {
        updateTask(id: $id, completed: $completed) { id }
      }
    `,
      { id: taskId, completed: !completed }
    );

    fetchUsers();
  }

  async function updateTaskName() {
    if (!editingTaskId) return;

    await graphqlRequest(
      `
      mutation($id: ID!, $title: String) {
        updateTask(id: $id, title: $title) { id }
      }
    `,
      { id: editingTaskId, title: editingTitle }
    );

    setEditingTaskId(null);
    fetchUsers();
  }

  const selectedUser = users.find(
    (u) => u.id === selectedUserId
  );

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Multi User Todo App</h1>

      {/* ================= USER SELECT ================= */}
      <h3>Select User</h3>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <button
        onClick={deleteUser}
        style={{ marginLeft: "10px", color: "red" }}
      >
        Delete User
      </button>

      <hr />

      {/* ================= USER DETAILS ================= */}
      {selectedUser && (
        <>
          <h3>User Details</h3>

          {editingUserId === selectedUser.id ? (
            <>
              <input
                type="text"
                value={editingUserName}
                onChange={(e) =>
                  setEditingUserName(e.target.value)
                }
              />
              <input
                type="email"
                value={editingUserEmail}
                onChange={(e) =>
                  setEditingUserEmail(e.target.value)
                }
              />
              <button onClick={updateUser}>Save</button>
              <button
                onClick={() => setEditingUserId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <button
                onClick={() => {
                  setEditingUserId(selectedUser.id);
                  setEditingUserName(selectedUser.name);
                  setEditingUserEmail(selectedUser.email);
                }}
              >
                Edit User
              </button>
            </>
          )}
        </>
      )}

      <hr />

      {/* ================= ADD USER ================= */}
      <h3>Add User</h3>
      <input
        type="text"
        placeholder="Name"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>

      <hr />

      {/* ================= TASKS ================= */}
      {selectedUser && (
        <>
          <h2>{selectedUser.name}'s Tasks</h2>

          <input
            type="text"
            placeholder="New task"
            value={newTaskTitle}
            onChange={(e) =>
              setNewTaskTitle(e.target.value)
            }
          />
          <button onClick={addTask}>Add Task</button>

          <ul>
            {selectedUser.tasks.tasks.map((task) => (
              <li key={task.id}>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(e.target.value)
                      }
                    />
                    <button onClick={updateTaskName}>
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditingTaskId(null)
                      }
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {task.completed ? "✅" : "⬜"}{" "}
                    {task.title}
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditingTitle(task.title);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        toggleTask(
                          task.id,
                          task.completed
                        )
                      }
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          <p>Total tasks: {selectedUser.tasks.totalCount}</p>
        </>
      )}
    </div>
  );
}
