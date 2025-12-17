document.addEventListener("DOMContentLoaded", () => {

  console.log("🔥 empv1.js LOADED");

  /* ================= SOCKET SETUP ================= */

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("userName").textContent =
      user.name?.charAt(0).toUpperCase() + user.name?.slice(1) || "Employee";

    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userRole").textContent = user.role;
  }

  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    reconnection: false
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      socket.emit("joinEmployeeRoom", user._id);
      console.log("👤 Joined employee room:", user._id);
    } else {
      console.error("❌ User not found in localStorage");
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  /* ================= DOM ELEMENTS ================= */
  const issueForm = document.getElementById("issueForm");

  const issueTitle = document.getElementById("issueTitle");
  const issueDesc = document.getElementById("issueDesc");
  const issueCategory = document.getElementById("issueCategory");
  const issuePriority = document.getElementById("issuePriority");
  const technicianTeam = document.getElementById("technicianTeam");

  const myIssuesTable = document.getElementById("myIssuesTable");
  const emptyState = document.getElementById("emptyState");

  const totalCount = document.getElementById("totalCount");
  const pendingCount = document.getElementById("pendingCount");
  const resolvedCount = document.getElementById("resolvedCount");

  const issueChart = document.getElementById("issueChart");

  /* ================= PRIORITY BUTTONS ================= */
  const priorityButtons = document.querySelectorAll(".priority-btn");

  priorityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      priorityButtons.forEach(b =>
        b.classList.remove("ring-2", "ring-offset-2", "ring-primary")
      );
      btn.classList.add("ring-2", "ring-offset-2", "ring-primary");
      issuePriority.value = btn.dataset.priority;
    });
  });

  /* ================= GLOBAL STATE ================= */
  let issues = [];




  /* ================= SOCKET LISTENERS ================= */
  socket.on("issueCreated", (issue) => {
    console.log("🆕 Issue received via socket:", issue);
    issues.unshift(issue);
    renderDashboard();
    renderMyIssues();
    renderChart();
  });

  socket.on("issueUpdated", ({ issueId, status }) => {
    const i = issues.find(x => x._id === issueId);
    if (i) i.status = status;

    renderDashboard();
    renderMyIssues();
    renderChart();
  });

  /* ================= LOAD ISSUES ================= */
  async function loadIssuesFromBackend() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return window.location.replace("login.html");

      const res = await fetch(
        "http://localhost:5000/api/employee/issues",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        console.error(txt);
        throw new Error("Failed to load issues");
      }

      const data = await res.json();
      issues = data.issues || [];

      renderDashboard();
      renderMyIssues();
      renderChart();

    } catch (err) {
      console.error("❌ Load issues error:", err);
      notify("Failed to load issues ❌");
    }
  }

  /* ================= REPORT ISSUE ================= */
  issueForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return window.location.replace("login.html");

    const priorityMap = {
      Routine: "Routine",
      Risky: "Risky",
      Urgent: "Urgent",
      Critical: "Critical"
    };

    const payload = {
      title: issueTitle.value.trim(),
      description: issueDesc.value.trim(),
      category: issueCategory.value,
      priority: priorityMap[issuePriority.value] || "Routine",
      location: technicianTeam?.value || "Auto assign"
    };

    if (!payload.title || !payload.description || !payload.category || !payload.location) {
      notify("Please fill all required fields ❗");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/employee/issues/issue/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error("Create failed");
      }

      notify("✅ Issue reported successfully");
      issueForm.reset();
      // ❌ DO NOT refetch here – socket will update UI

    } catch (err) {
      console.error("❌ Create issue error:", err);
      notify("Server not responding ❌");
    }
  });

  /* ================= TABLE ================= */
  function renderMyIssues() {
    if (!myIssuesTable) return;

    myIssuesTable.innerHTML = "";

    if (!issues.length) {
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");

    issues.forEach(issue => {
      const status = issue.status || issue.timeline?.at(-1)?.status || "open";

      myIssuesTable.innerHTML += `
        <tr class="hover:bg-teal-50">
          <td class="p-4">${issue.title}</td>
          <td class="p-4">${issue.category}</td>
          <td class="p-4">${issue.priority}</td>
          <td class="p-4">${status}</td>
          <td class="p-4">${new Date(issue.createdAt).toLocaleDateString()}</td>
        </tr>
      `;
    });
  }

  /* ================= DASHBOARD ================= */
  // function renderDashboard() {
  //   if (!totalCount || !pendingCount || !resolvedCount) return;

  //   totalCount.textContent = issues.length;
  //   pendingCount.textContent = issues.filter(i => i.status === "open").length;
  //   resolvedCount.textContent = issues.filter(i => i.status === "resolved").length;
  // }

  function renderDashboard() {
    if (!totalCount || !pendingCount || !resolvedCount) return;

    totalCount.textContent = issues.length;

    // Pending = everything NOT resolved or closed
    pendingCount.textContent = issues.filter(i =>
      ["open", "assigned", "in-progress", "on-hold"].includes(i.status)
    ).length;

    resolvedCount.textContent = issues.filter(i =>
      ["resolved", "closed"].includes(i.status)
    ).length;

    // Urgent = priority based
    const urgentCountEl = document.getElementById("urgentCount");
    if (urgentCountEl) {
      urgentCountEl.textContent = issues.filter(i => i.priority === "Urgent").length;
    }
  }


  /* ================= CHART ================= */
  let chart;
  function renderChart() {
    if (!issueChart || typeof Chart === "undefined") return;

    const open = issues.filter(i => i.status === "open").length;
    const resolved = issues.filter(i => i.status === "resolved").length;

    chart?.destroy();
    chart = new Chart(issueChart, {
      type: "pie",
      data: {
        labels: ["Open", "Resolved"],
        datasets: [{
          data: [open, resolved],
          backgroundColor: ["#facc15", "#22c55e"]
        }]
      }
    });
  }

  function updateProfileStats() {
    const pending = issues.filter(i => i.status === "open").length;
    const resolved = issues.filter(i => i.status === "resolved").length;

    const pendingEl = document.getElementById("pendingCount");
    const resolvedEl = document.getElementById("resolvedCount");

    if (pendingEl) pendingEl.textContent = pending;
    if (resolvedEl) resolvedEl.textContent = resolved;
  }

  function updateDashboardCounts() {
    const total = issues.length;
    const inProgress = issues.filter(i =>
      ["assigned", "in-progress", "on-hold"].includes(i.status)
    ).length;
    const resolved = issues.filter(i => i.status === "resolved").length;

    document.getElementById("totalIssues").textContent = total;
    document.getElementById("inProgressIssues").textContent = inProgress;
    document.getElementById("resolvedIssues").textContent = resolved;
  }



  /* ================= TOAST ================= */
  function notify(msg) {
    const t = document.createElement("div");
    t.className =
      "fixed top-6 right-6 bg-primary text-white px-5 py-3 rounded-xl shadow-lg z-50";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  /* ================= INIT ================= */
  loadIssuesFromBackend();

});
