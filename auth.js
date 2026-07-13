// Preset users (you can edit/add as many as you want)
const users = [
  { username: "admin", password: "12345", firstName: "John", lastName: "Doe" },
  { username: "sarah", password: "98765", firstName: "Sarah", lastName: "Brown" },
  { username: "MT207", password: "BMs@2!89", firstName: "Maria", lastName: "Torres" }
];

// ✅ Explicit allowlist of usernames that are allowed to use the platform
const allowedUsernames = new Set([
  "admin",
  "sarah",
  "MT207"
]);

// 🚀 CURRENT APP VERSION
// Increment this string (e.g., "16", "17") in the future to instantly force-logout everyone again.
const CURRENT_AUTH_VERSION = "17"; 

function isAllowedUser(user) {
  if (!user || !user.username) return false;
  return allowedUsernames.has(user.username);
}

// 🔐 Login function
function login() {
  const userField = document.getElementById("username").value.trim();
  const passField = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  const found = users.find(
    (u) => u.username === userField && u.password === passField
  );

  if (!found) {
    errorMsg.textContent = "Invalid username or password.";
    return;
  }

  if (!isAllowedUser(found)) {
    errorMsg.textContent = "This account no longer has access to the platform.";
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", JSON.stringify(found));
  // 👇 Track that this user logged in under the current version
  localStorage.setItem("auth_version", CURRENT_AUTH_VERSION); 
  window.location.href = "dashboard.html";
}

// 🧭 Access control for restricted pages
function requireAuth() {
  // 👇 1. Check if the user's browser session matches the current required version
  const userSessionVersion = localStorage.getItem("auth_version");
  
  if (userSessionVersion !== CURRENT_AUTH_VERSION) {
    // Session is outdated. Clear everything out.
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    // Update their local tracking to the new version so they aren't stuck in an infinite logout loop when trying to log back in
    localStorage.setItem("auth_version", CURRENT_AUTH_VERSION); 
    window.location.href = "login.html";
    return;
  }

  // 2. Continue with standard authentication checks
  const loggedIn = localStorage.getItem("isLoggedIn");
  const userJson = localStorage.getItem("user");

  if (loggedIn !== "true" || !userJson) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    window.location.href = "login.html";
    return;
  }

  let user;
  try {
    user = JSON.parse(userJson);
  } catch (e) {
    // Corrupt data → force logout
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    window.location.href = "login.html";
    return;
  }

  // Enforce allowlist on existing sessions
  if (!isAllowedUser(user)) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}