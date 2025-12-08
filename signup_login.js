document.addEventListener("DOMContentLoaded", () => {

  /* ---------- PAGE SWITCH ---------- */
  window.showSignup = function () {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("signupBox").classList.remove("hidden");
  };
  window.showLogin = function () {
    document.getElementById("signupBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
  };

  /* ---------- POPUP ---------- */
  function showPopup(msg, success = false) {
    const popup = document.getElementById("errorPopup");
    popup.textContent = (success ? "✔ " : "❌ ") + msg;
    popup.classList.remove("hidden");
    popup.classList.add("fadePopup");
    popup.style.backgroundColor = success ? "#059669" : "#dc2626";
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 1400);
  }

  /* ---------- TOKEN VALIDATION ---------- */
  function validateToken(role, token) {
    return role === "Employee" ? /^EMP\d{3}$/.test(token) : /^TECH\d{3}$/.test(token);
  }

  /* ---------- TOKEN LABEL UPDATES ---------- */
  window.updateLoginTokenField = function () {
    const role = document.querySelector("input[name='roleLogin']:checked").value;
    const label = document.getElementById("loginTokenLabel");
    const input = document.getElementById("loginToken");
    if (role === "Employee") { label.textContent = "Employee Token Number"; input.placeholder = "EMP123"; }
    else { label.textContent = "Technician Token Number"; input.placeholder = "TECH123"; }
  };
  window.updateSignupTokenField = function () {
    const role = document.querySelector("input[name='roleSignup']:checked").value;
    const label = document.getElementById("signupTokenLabel");
    const input = document.getElementById("signupToken");
    if (role === "Employee") { label.textContent = "Employee Token Number"; input.placeholder = "EMP123"; }
    else { label.textContent = "Technician Token Number"; input.placeholder = "TECH123"; }
  };

  /* ---------- PASSWORD RULES / CHECKLIST HELPERS ---------- */
  function ruleCheck(password) {
    return {
      upper: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      len: password.length >= 8
    };
  }

  function updateRuleUI(ruleEl, ok) {
    if (!ruleEl) return;
    ruleEl.classList.toggle("ok", ok);
  }

  function strengthFromRules(rules) {
    const passed = Object.values(rules).filter(Boolean).length;
    if (passed <= 1) return { text: "Weak", color: "#dc2626" };
    if (passed === 2 || passed === 3) return { text: "Medium", color: "#d97706" };
    return { text: "Strong", color: "#059669" };
  }

  /* ---------- LOGIN: live password checklist & validation ---------- */
  const loginPassword = document.getElementById("password");
  const ruleLoginUpper = document.getElementById("ruleLoginUpper");
  const ruleLoginDigit = document.getElementById("ruleLoginDigit");
  const ruleLoginSpecial = document.getElementById("ruleLoginSpecial");
  const ruleLoginLen = document.getElementById("ruleLoginLen");
  const strengthLoginLabel = document.getElementById("strengthLogin");
  const loginPwError = document.getElementById("pwError");

  if (loginPassword) {
    loginPassword.addEventListener("input", () => {
      const p = loginPassword.value;
      const rules = ruleCheck(p);
      updateRuleUI(ruleLoginUpper, rules.upper);
      updateRuleUI(ruleLoginDigit, rules.digit);
      updateRuleUI(ruleLoginSpecial, rules.special);
      updateRuleUI(ruleLoginLen, rules.len);
      const strength = strengthFromRules(rules);
      if (strengthLoginLabel) {
        strengthLoginLabel.textContent = `Strength: ${strength.text}`;
        strengthLoginLabel.style.color = strength.color;
      }

      // inline error visibility
      if (Object.values(rules).some(v => !v)) {
        loginPwError.classList.remove("invisible");
      } else {
        loginPwError.classList.add("invisible");
      }
    });
  }

  /* ---------- SIGNUP: live password checklist & validation ---------- */
  const signupPassword = document.getElementById("password2");
  const ruleSignupUpper = document.getElementById("ruleSignupUpper");
  const ruleSignupDigit = document.getElementById("ruleSignupDigit");
  const ruleSignupSpecial = document.getElementById("ruleSignupSpecial");
  const ruleSignupLen = document.getElementById("ruleSignupLen");
  const strengthSignupLabel = document.getElementById("strengthSignup");
  const signupPwError = document.getElementById("pwError2");

  if (signupPassword) {
    signupPassword.addEventListener("input", () => {
      const p = signupPassword.value;
      const rules = ruleCheck(p);
      updateRuleUI(ruleSignupUpper, rules.upper);
      updateRuleUI(ruleSignupDigit, rules.digit);
      updateRuleUI(ruleSignupSpecial, rules.special);
      updateRuleUI(ruleSignupLen, rules.len);
      const strength = strengthFromRules(rules);
      if (strengthSignupLabel) {
        strengthSignupLabel.textContent = `Strength: ${strength.text}`;
        strengthSignupLabel.style.color = strength.color;
      }

      if (Object.values(rules).some(v => !v)) {
        signupPwError.classList.remove("invisible");
      } else {
        signupPwError.classList.add("invisible");
      }
    });
  }

  /* ---------- LIVE email/token checks ---------- */
  const loginEmail = document.getElementById("loginEmail");
  const loginEmailError = document.getElementById("loginEmailError");
  const loginToken = document.getElementById("loginToken");
  const loginTokenError = document.getElementById("loginTokenError");
  const loginRoleInputs = document.getElementsByName("roleLogin");

  if (loginEmail) {
    loginEmail.addEventListener("input", () => {
      const ok = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(loginEmail.value.trim());
      loginEmailError.classList.toggle("invisible", ok);
    });
  }
  if (loginToken) {
    loginToken.addEventListener("input", () => {
      const role = [...loginRoleInputs].find(r => r.checked).value;
      const ok = validateToken(role, loginToken.value.trim());
      loginTokenError.classList.toggle("invisible", ok);
      loginToken.classList.toggle("border-red-500", !ok);
    });
  }

  const signupEmail = document.getElementById("signupEmail");
  const signupEmailError = document.getElementById("signupEmailError");
  const signupToken = document.getElementById("signupToken");
  const signupTokenError = document.getElementById("signupTokenError");
  const signupRoleInputs = document.getElementsByName("roleSignup");

  if (signupEmail) {
    signupEmail.addEventListener("input", () => {
      const ok = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(signupEmail.value.trim());
      signupEmailError.classList.toggle("invisible", ok);
    });
  }
  if (signupToken) {
    signupToken.addEventListener("input", () => {
      const role = [...signupRoleInputs].find(r => r.checked).value;
      const ok = validateToken(role, signupToken.value.trim());
      signupTokenError.classList.toggle("invisible", ok);
      signupToken.classList.toggle("border-red-500", !ok);
    });
  }

  /* ---------- SUBMIT handlers (final checks) ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); // we'll only submit if all OK
      let ok = true;
      const role = [...loginRoleInputs].find(r => r.checked).value;
      const email = loginEmail.value.trim();
      const pw = loginPassword.value;
      const tok = loginToken.value.trim();

      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        ok = false; showPopup("Enter a valid Gmail address!");
      }
      const rules = ruleCheck(pw);
      if (Object.values(rules).some(v => !v)) {
        ok = false; showPopup("Invalid Password! Follow the rules below.");
      }
      if (!validateToken(role, tok)) {
        ok = false; showPopup(role === "Employee" ? "Employee token must be like EMP123" : "Technician token must be like TECH123");
      }

      if (ok) {
        showPopup("Login successful!", true);
        // real submission: remove preventDefault then submit
        setTimeout(() => loginForm.submit(), 420);
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const role = [...signupRoleInputs].find(r => r.checked).value;
      const email = signupEmail.value.trim();
      const pw = signupPassword.value;
      const tok = signupToken.value.trim();

      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        ok = false; showPopup("Enter a valid Gmail address!");
      }
      if (fullName2.value.trim() === "") {
        ok = false; showPopup("Full name required!");
      }
      const rules = ruleCheck(pw);
      if (Object.values(rules).some(v => !v)) {
        ok = false; showPopup("Invalid Password! Follow the rules below.");
      }
      if (!validateToken(role, tok)) {
        ok = false; showPopup(role === "Employee" ? "Employee token must be like EMP123" : "Technician token must be like TECH123");
      }

      if (ok) {
        showPopup("Account created!", true);
        setTimeout(() => signupForm.submit(), 420);
      }
    });
  }

  /* ---------- initialize token labels on load ---------- */
  updateLoginTokenField();
  updateSignupTokenField();
});

