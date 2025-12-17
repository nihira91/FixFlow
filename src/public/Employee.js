document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("login.html");
    return;
  }

  let issues = [];

  /* ================= PROFILE ================= */
  try {
    const res = await fetch("http://localhost:5000/api/employee/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const user = await res.json();

    document.getElementById("welcomeName").textContent = user.name;
    document.getElementById("empName").textContent = user.name;
    document.getElementById("empEmail").textContent = user.email;
    document.getElementById("empRole").textContent = user.role.toUpperCase();

  } catch (err) {
    console.error("Auth failed:", err);
    localStorage.removeItem("token");
    window.location.replace("login.html");
    return;
  }

  /* ================= LOAD ISSUES ================= */
  async function loadIssues() {
    const res = await fetch("http://localhost:5000/api/employee/issues", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    issues = data.issues || [];

    updateStats();
    renderRecentIssues();
  }

  /* ================= DASHBOARD STATS ================= */
  function updateStats() {
    const total = issues.length;

    const inProgress = issues.filter(i =>
      ["assigned", "in-progress", "on-hold"].includes(i.status)
    ).length;

    const resolved = issues.filter(i => i.status === "resolved").length;

    document.getElementById("totalIssues").textContent = total;
    document.getElementById("inProgressIssues").textContent = inProgress;
    document.getElementById("resolvedIssues").textContent = resolved;
  }

  /* ================= RECENT ISSUES TABLE ================= */
  function renderRecentIssues() {
    const table = document.getElementById("recentIssuesTable");
    if (!table) return;

    table.innerHTML = "";

    issues.slice(0, 5).forEach(issue => {
      table.innerHTML += `
        <tr class="border-b hover:bg-gray-100">
          <td>#${issue._id.slice(-4)}</td>
          <td>${issue.title}</td>
          <td class="capitalize">${issue.status}</td>
          <td>${new Date(issue.updatedAt).toLocaleDateString()}</td>
          <td>→</td>
        </tr>
      `;
    });
  }

  /* ================= LOGOUT ================= */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("login.html");
  });

  /* ================= INIT ================= */
  loadIssues();
});
