const form = document.getElementById("loginForm");
const password = document.getElementById("password");
const pwError = document.getElementById("pwError");

form.addEventListener("submit", function (event) {
    const pwValue = password.value;

    // Password must contain:
    // 1 uppercase letter, 1 digit, 1 special character
    const pwRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!pwRegex.test(pwValue)) {
        pwError.classList.remove("hidden");
        event.preventDefault();
    } else {
        pwError.classList.add("hidden");
    }
});
