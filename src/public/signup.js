console.log("🔥 CORRECT signup.js LOADED 🔥");

const form = document.getElementById("signupForm");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const confirmField = document.getElementById("confirmPassword");
const pwError = document.getElementById("pwError");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

const password = passwordField.value.trim();
const confirm = confirmField.value.trim();


  const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  if (password !== confirm || !pwRegex.test(password)) {
    pwError.classList.remove("hidden");
    return;
  }
  pwError.classList.add("hidden");

  const role = document.querySelector('input[name="role"]:checked').value;

  const API_URL =
    role === "technician"
      ? "http://localhost:5000/api/technician/auth/signup"
      : "http://localhost:5000/api/employee/auth/signup";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        password,
        role
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server not responding");
  }
});
