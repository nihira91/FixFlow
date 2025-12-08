document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- LOGIN FORM VALIDATION ---------------- */
    const loginForm = document.getElementById("loginForm");
    const loginPassword = document.getElementById("password");
    const loginError = document.getElementById("pwError");
    const loginEmail = document.getElementById("loginEmail"); // ADD EMAIL FIELD ID IN HTML

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            let isValid = true;

            /* --- EMAIL VALIDATION --- */
            const emailValue = loginEmail.value.trim();
            const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

            if (!gmailPattern.test(emailValue)) {
                isValid = false;
                loginEmail.classList.add("border-red-500");
                alert("Please enter a valid Gmail address (must end with @gmail.com)");
            } else {
                loginEmail.classList.remove("border-red-500");
            }

            /* --- PASSWORD VALIDATION --- */
            const pw = loginPassword.value;

            const hasUpper = /[A-Z]/.test(pw);
            const hasDigit = /[0-9]/.test(pw);
            const hasSpecial = /[^A-Za-z0-9]/.test(pw);
            const minLength = pw.length >= 8;

            if (!hasUpper || !hasDigit || !hasSpecial || !minLength) {
                isValid = false;

                loginError.classList.remove("hidden");
                loginPassword.classList.add("border-red-500");
            } else {
                loginError.classList.add("hidden");
                loginPassword.classList.remove("border-red-500");
            }

            if (!isValid) {
                e.preventDefault();
                return;
            }

            alert("Login Successful!");
        });
    }



    /* ---------------- SIGNUP FORM VALIDATION ---------------- */
    const signupForm = document.getElementById("signupForm");
    const signupPassword = document.getElementById("password2");
    const signupError = document.getElementById("pwError2");
    const signupEmail = document.getElementById("signupEmail");

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            let isValid = true;

            /* --- EMAIL VALIDATION --- */
            const emailValue = signupEmail.value.trim();
            const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

            if (!gmailPattern.test(emailValue)) {
                isValid = false;
                signupEmail.classList.add("border-red-500");
                alert("Please enter a valid Gmail address (must end with @gmail.com)");
            } else {
                signupEmail.classList.remove("border-red-500");
            }

            /* --- PASSWORD VALIDATION --- */
            const pw2 = signupPassword.value;

            const hasUpper2 = /[A-Z]/.test(pw2);
            const hasDigit2 = /[0-9]/.test(pw2);
            const hasSpecial2 = /[^A-Za-z0-9]/.test(pw2);
            const minLength2 = pw2.length >= 8;

            if (!hasUpper2 || !hasDigit2 || !hasSpecial2 || !minLength2) {
                isValid = false;

                signupError.classList.remove("hidden");
                signupPassword.classList.add("border-red-500");
            } else {
                signupError.classList.add("hidden");
                signupPassword.classList.remove("border-red-500");
            }

            if (!isValid) {
                e.preventDefault();
                return;
            }

            alert("Signup Successful!");
        });
    }

});
