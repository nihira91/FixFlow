console.log("🔥 CORRECT signup.js LOADED 🔥");

const form = document.getElementById("signupForm");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const contactField = document.getElementById("contactNo");
const contactDiv = document.getElementById("contactDiv");
const passwordField = document.getElementById("password");
const confirmField = document.getElementById("confirmPassword");
const pwError = document.getElementById("pwError");

// Toggle contact field visibility based on role
function toggleContactField() {
  const role = document.querySelector('input[name="role"]:checked').value;
  if (role === "technician") {
    contactDiv.classList.remove("hidden");
    contactField.required = true;
  } else {
    contactDiv.classList.add("hidden");
    contactField.required = false;
  }
}

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

  // Build request body
  const requestBody = {
    name: nameField.value.trim(),
    email: emailField.value.trim(),
    password
  };

  // Add contact number for technicians
  if (role === "technician") {
    requestBody.contactNo = contactField.value.trim();
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and redirect based on role
      if (role === "technician") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Account created! Please complete your profile.");
        window.location.href = "technician-profile-completion.html";
      } else {
        alert("Account created successfully!");
        window.location.href = "login.html";
      }
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server not responding");
  }
});
