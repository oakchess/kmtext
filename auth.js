// Preset users (you can edit/add as many as you want)
const users = [
  { username: "admin", password: "12345", firstName: "John", lastName: "Doe" },
  { username: "sarah", password: "98765", firstName: "Sarah", lastName: "Brown" },
  { username: "jessica.valencia@kmtextiles.com", password: "LWTsn@70", firstName: "Jessica", lastName: "Valencia" }
];

// 🚫 ALLOWED USERS (Brenda removed)
const ALLOWED_USERNAMES = [
  "admin",
  "sarah",
  "jessica.valencia@kmtextiles.com"
];

// 🔐 Login function
function login() {
  const userField = document.getElementById("username").value.trim();
  const passField = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  const found = users.find(
    (u) => u.username === userField && u.password === passField
  );

  if (found && ALLOWED_USERNAMES.includes(found.username)) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(found));
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "Invalid username, password, or access revoked.";
  }
}

// 🧭 Access control for restricted pages
function requireAuth() {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");

  // user must be logged in AND still allowed
  const stillAllowed = userObj.username
    ? ALLOWED_USERNAMES.includes(userObj.username)
    : false;

  if (!loggedIn || !stillAllowed) {
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
