// src/auth/authUtils.js

const USERS_KEY = "rc_users";

// Default admin (only created once)
const DEFAULT_ADMIN = {
  id: "ADMIN001",
  username: "admin",
  password: "admin123", // later hash in backend
  role: "admin",
  name: "Admin",
};

// Run once on app start
export function initAuth() {
  const existing = localStorage.getItem(USERS_KEY);

  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
  }
}

// Fake login (until backend)
export function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error("Invalid username or password");
  }

  return {
    token: "fake-jwt-token",
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    },
  };
}

// Helpers
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}

export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}