console.log("signup.js loaded!");

const form = document.getElementById("signupForm");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const confirmField = document.getElementById("confirmPassword");
const pwError = document.getElementById("pwError");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const password = passwordField.value;
    const confirm = confirmField.value;

    // PASSWORD RULE: 1 capital, 1 number, 1 special, min 6 chars
    const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (password !== confirm || !pwRegex.test(password)) {
        pwError.classList.remove("hidden");
        return;
    } else {
        pwError.classList.add("hidden");
    }

    const role = document.querySelector('input[name="role"]:checked').value;

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameField.value.trim(),
                email: emailField.value.trim(),
                password: password,
                role: role
            }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert("Account created successfully!");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup failed");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server not responding");
    }
});
