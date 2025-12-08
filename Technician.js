document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("verifyTechBtn");
    const input = document.getElementById("techIdInput");
    const msg = document.getElementById("techVerifyMsg");

    const validTechIDs = ["TECH001", "TECH007", "TECH123", "T2025"];

    btn.addEventListener("click", () => {
        const id = input.value.trim();

        if (validTechIDs.includes(id)) {
            msg.textContent = "✔ Technician Verified — Access Granted";
            msg.className = "mt-3 text-green-600 font-semibold";
        } else {
            msg.textContent = "✖ Invalid Technician ID — Access Denied";
            msg.className = "mt-3 text-red-600 font-semibold";
        }
    });
});
