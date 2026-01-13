console.log("🔐 login.js LOADED");

const form = document.getElementById("loginForm");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  const role = document.querySelector('input[name="role"]:checked').value;

  if (!email || !password) {
    showError("Email and password are required");
    return;
  }

  const API_URL =
    role === "technician"
      ? "http://localhost:5000/api/technician/auth/login"
      : "http://localhost:5000/api/employee/auth/login";

  try {
    errorMsg.classList.add("hidden");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role and profile status
      if (role === "technician") {
        if (data.user.profileCompleted) {
          // Profile complete, go to dashboard
          window.location.href = "Technician.html";
        } else {
          // Profile not complete, go to completion page
          window.location.href = "technician-profile-completion.html";
        }
      } else {
        // Employee dashboard
        window.location.href = "Employee.html";
      }
    } else {
      showError(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    showError("Server not responding. Please try again.");
  }
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}
