// Preset users (you can edit/add as many as you want)
const users = [
  { username: "admin", password: "12345", firstName: "John", lastName: "Doe" },
  { username: "sarah", password: "98765", firstName: "Sarah", lastName: "Brown" },
  { username: "brenda.seumalo@kmtextiles.com", password: "LWTsn@70", firstName: "Brenda", lastName: "Seumalo" },
  { username: "jessica.valencia@kmtextiles.com", password: "LWTsn@70", firstName: "Jessica", lastName: "Valencia" }
];

// 🔐 Login function
function login() {
  const userField = document.getElementById("username").value.trim();
  const passField = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  const found = users.find(
    (u) => u.username === userField && u.password === passField
  );

  if (found) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(found));
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "Invalid username or password.";
  }
}

// 🧭 Access control for restricted pages
function requireAuth() {
  const loggedIn = localStorage.getItem("isLoggedIn");
  if (loggedIn !== "true") {
    window.location.href = "login.html";
  }
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
