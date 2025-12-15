console.log("login.js loaded");

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/employee/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  console.log("LOGIN RESPONSE:", data);

  if (!response.ok) {
    alert(data.message || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);

  const userRole = data.user.role.toLowerCase();

  if (userRole === "employee") {
    window.location.replace("./Employee.html");
  } else if (userRole === "technician") {
    window.location.replace("./Technician.html");
  } else if (userRole === "admin") {
    window.location.replace("./Admin.html");
  }
});
