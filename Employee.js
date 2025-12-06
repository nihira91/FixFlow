document.addEventListener("DOMContentLoaded", () => {
    const verifyBtn = document.getElementById("verifyBtn");
    const input = document.getElementById("empIdInput");
    const msg = document.getElementById("verifyMsg");

    verifyBtn.addEventListener("click", () => {
        const empID = input.value.trim();

        const validIDs = ["EMP001", "EMP123", "EMPXYZ", "EMP2025"];

        if (validIDs.includes(empID)) {
            msg.textContent = "✔ Employee Verified — Access Granted";
            msg.className = "mt-3 text-green-600 font-semibold";
        } else {
            msg.textContent = "✖ Invalid Employee ID — Access Denied";
            msg.className = "mt-3 text-red-600 font-semibold";
        }
    });
});
