// Preset users (you can edit/add as many as you want)
const users = [
  { username: "admin", password: "12345", firstName: "John", lastName: "Doe" },
  { username: "sarah", password: "98765", firstName: "Sarah", lastName: "Brown" },
  { username: "tyra.jennings@km-textiles.com", password: "LWTsn@70", firstName: "Tyra", lastName: "Jennings" }
];

// ✅ Explicit allowlist of usernames that are allowed to use the platform
const allowedUsernames = new Set([
  "admin",
  "sarah",
  "tyra.jennings@km-textiles.com"
]);

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
  window.location.href = "dashboard.html";
}

// 🧭 Access control for restricted pages
function requireAuth() {
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

  // 👇 This is the key part: also enforce allowlist on existing sessions
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
