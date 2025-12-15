document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("login.html");
        return;
    }

    try {
        
        const res = await fetch("http://localhost:5000/api/employee/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Unauthorized");
        }

        const user = await res.json();

        document.getElementById("welcomeName").textContent = user.name;
        document.getElementById("empName").textContent = user.name;
        document.getElementById("empEmail").textContent = user.email;
        document.getElementById("empRole").textContent = user.role.toUpperCase();

    } catch (err) {
        console.error("Auth failed:", err);
        localStorage.removeItem("token");
        window.location.replace("login.html");
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.replace("login.html");
    });
});
