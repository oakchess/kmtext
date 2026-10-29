
// Preset users
const users = [
  { username: "admin", password: "12345", firstName: "John", lastName: "Doe" },
  { username: "sarah", password: "98765", firstName: "Sarah", lastName: "Brown" },
  { username: "MT207", password: "BMs@2!89", firstName: "Maria", lastName: "Torres" },
  { username: "AE207", password: "BMs@2!89", firstName: "Ashleigh", lastName: "Earhart" }
];

// Users allowed to access the platform
const allowedUsernames = new Set([
  "admin",
  "sarah",
  "MT207",
   "AE207"
]);

// Phone access configuration:
// true  = allow phone access
// false = block phone access
// Unlisted users are blocked by default.
const phoneAccess = {
  admin: true,
  sarah: true,
  MT207: true,
  AE207: false
};

// Increment to invalidate existing local sessions
const CURRENT_AUTH_VERSION = "20";

function isAllowedUser(user) {
  return !!user && allowedUsernames.has(user.username);
}

function isPhoneDevice() {
  // Basic browser-based phone detection; not a security guarantee.
  return /iPhone|Android.*Mobile|Windows Phone|webOS|BlackBerry|Opera Mini/i
    .test(navigator.userAgent);
}

function clearSession() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  localStorage.removeItem("auth_version");
}

function login() {
  const userField = document.getElementById("username").value.trim();
  const passField = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  const found = users.find(
    u => u.username === userField && u.password === passField
  );

  if (!found) {
    errorMsg.textContent = "Invalid username or password.";
    return;
  }

  if (!isAllowedUser(found)) {
    errorMsg.textContent =
      "This account no longer has access to the platform.";
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", JSON.stringify(found));
  localStorage.setItem("auth_version", CURRENT_AUTH_VERSION);

  window.location.href = "dashboard.html";
}

function requireAuth() {
  const sessionVersion = localStorage.getItem("auth_version");
  const loggedIn = localStorage.getItem("isLoggedIn");
  const userJson = localStorage.getItem("user");

  if (
    sessionVersion !== CURRENT_AUTH_VERSION ||
    loggedIn !== "true" ||
    !userJson
  ) {
    clearSession();
    window.location.href = "login.html";
    return false;
  }

  let user;

  try {
    user = JSON.parse(userJson);
  } catch (error) {
    clearSession();
    window.location.href = "login.html";
    return false;
  }

  if (!isAllowedUser(user)) {
    clearSession();
    window.location.href = "login.html";
    return false;
  }

  // Restrict phone access according to the configured username.
  if (isPhoneDevice() && phoneAccess[user.username] !== true) {
    window.location.href = "device-restricted.html";
    return false;
  }

  return true;
}

function logout() {
  clearSession();
  window.location.href = "login.html";
}
