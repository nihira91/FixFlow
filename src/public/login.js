// const form = document.getElementById("loginForm");
// const password = document.getElementById("password");
// const pwError = document.getElementById("pwError");

// form.addEventListener("submit", function (event) {
//     const pwValue = password.value;

//     // Password must contain:
//     // 1 uppercase letter, 1 digit, 1 special character
//     const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

//     if (!pwRegex.test(pwValue)) {
//         pwError.classList.remove("hidden");
//         event.preventDefault();
//     } else {
//         pwError.classList.add("hidden");
//     }
// });
console.log("login.js loaded!");

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const pwError = document.getElementById("pwError");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const pwValue = password.value;
    const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!pwRegex.test(pwValue)) {
        pwError.classList.remove("hidden");
        return;
    } else {
        pwError.classList.add("hidden");
    }

    console.log("Sending login request...");

    const role = document.querySelector('input[name="role"]:checked').value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                role: role
            }),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            alert("Login Successful!");

            if (data.role === "Employee") {
                window.location.href = "Employee.html";
            } else if (data.role === "Technician") {
                window.location.href = "Technician.html";
            }
        } else {
            alert(data.message || "Login failed");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server not responding");
    }
});
