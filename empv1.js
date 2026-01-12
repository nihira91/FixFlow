
/* =========================================================
   empv1.js
   Employee Module – FixFlow IMS
   Frontend Logic (Backend-ready)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     USER (TEMP MOCK)
     ⚠️ Backend will inject via JWT / session
  ------------------------------------------------------- */
  const currentUser = {
    id: "u101",
    name: "Aisha Khan",
    role: "Employee",
    joined: "Jan 2025"
  };

  /* -------------------------------------------------------
     PRIORITY BUTTON HANDLING (Report Issue Page)
  ------------------------------------------------------- */
  const priorityButtons = document.querySelectorAll(".priority-btn");
  const priorityInput = document.getElementById("issuePriority");

  if (priorityButtons.length && priorityInput) {
    priorityButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        priorityButtons.forEach(b =>
          b.classList.remove("ring-2", "ring-offset-2", "ring-primary")
        );

        btn.classList.add("ring-2", "ring-offset-2", "ring-primary");
        priorityInput.value = btn.dataset.priority;
      });
    });
  }

  /* -------------------------------------------------------
     GLOBAL STATE (TEMP)
     ⚠️ Replace with API data later
  ------------------------------------------------------- */
  let issues = []; // currently empty → UI shows empty state

  /* -------------------------------------------------------
     DOM ELEMENTS (SAFE ACCESS)
  ------------------------------------------------------- */
  const userNameEls = document.querySelectorAll("#userName");
  const profileName = document.getElementById("profileName");

  const issueForm = document.getElementById("issueForm");
  const myIssuesTable = document.getElementById("myIssuesTable");
  const emptyState = document.getElementById("emptyState");

  const totalCount = document.getElementById("totalCount");
  const pendingCount = document.getElementById("pendingCount");
  const resolvedCount = document.getElementById("resolvedCount");

  const chartCanvas = document.getElementById("issueChart");

  /* -------------------------------------------------------
     INIT USER INFO
  ------------------------------------------------------- */
  userNameEls.forEach(el => el.textContent = currentUser.name);
  if (profileName) profileName.textContent = currentUser.name;

  /* -------------------------------------------------------
     REPORT ISSUE (FORM SUBMIT)
  ------------------------------------------------------- */
  if (issueForm) {
    issueForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("issueTitle")?.value.trim();
      const desc = document.getElementById("issueDesc")?.value.trim();
      const category = document.getElementById("issueCategory")?.value;
      const priority = document.getElementById("issuePriority")?.value;
      const team =
        document.getElementById("technicianTeam")?.value || "Auto Assign";

      if (!title || !desc || !category || !priority) {
        notify("Please fill all required fields ❗");
        return;
      }

      const newIssue = {
        id: Date.now(), // backend will generate
        title,
        description: desc,
        category,
        technicianTeam: team,
        priority,
        status: "Pending",
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString()
      };

      issues.push(newIssue);
      issueForm.reset();

      notify("✅ Issue reported successfully");

      renderDashboard();
      renderMyIssues();
      renderChart();
    });
  }

  /* -------------------------------------------------------
     MY ISSUES TABLE (FINAL UI VERSION)
  ------------------------------------------------------- */
  function renderMyIssues() {
    if (!myIssuesTable) return;

    myIssuesTable.innerHTML = "";

    // EMPTY STATE
    if (issues.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    } else {
      if (emptyState) emptyState.classList.add("hidden");
    }

    const priorityColors = {
      Routine: "bg-blue-100 text-blue-700",
      Risky: "bg-yellow-100 text-yellow-700",
      Urgent: "bg-orange-100 text-orange-700 animate-pulse",
      Critical: "bg-red-100 text-red-700 animate-pulse"
    };

    const statusColors = {
      Pending: "bg-yellow-50 text-yellow-600",
      Resolved: "bg-green-50 text-green-600"
    };

    issues.forEach(issue => {
      const row = document.createElement("tr");
      row.className = "hover:bg-teal-50 transition cursor-pointer";

      row.innerHTML = `
        <td class="p-4 font-medium text-gray-800">
          ${issue.title}
        </td>

        <td class="p-4 text-gray-600">
          ${issue.category}
        </td>

        <td class="p-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold
            ${priorityColors[issue.priority]}">
            ${issue.priority}
          </span>
        </td>

        <td class="p-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold
            ${statusColors[issue.status]}">
            ${issue.status}
          </span>
        </td>

        <td class="p-4 text-sm text-gray-500">
          ${issue.updatedAt}
        </td>
      `;

      myIssuesTable.appendChild(row);
    });
  }

  /* -------------------------------------------------------
     DASHBOARD COUNTS
  ------------------------------------------------------- */
  function renderDashboard() {
    if (!totalCount || !pendingCount || !resolvedCount) return;

    const total = issues.length;
    const pending = issues.filter(i => i.status === "Pending").length;
    const resolved = issues.filter(i => i.status === "Resolved").length;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    resolvedCount.textContent = resolved;
  }

  /* -------------------------------------------------------
     PROFILE PIE CHART
  ------------------------------------------------------- */
  let chart;
  function renderChart() {
    if (!chartCanvas || typeof Chart === "undefined") return;

    const pending = issues.filter(i => i.status === "Pending").length;
    const resolved = issues.filter(i => i.status === "Resolved").length;

    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
      type: "pie",
      data: {
        labels: ["Pending", "Resolved"],
        datasets: [{
          data: [pending, resolved],
          backgroundColor: ["#facc15", "#22c55e"]
        }]
      },
      options: {
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }

  /* -------------------------------------------------------
     TOAST NOTIFICATION
  ------------------------------------------------------- */
  function notify(message) {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-6 right-6 bg-primary text-white px-5 py-3 rounded-xl shadow-lg z-50";
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  /* -------------------------------------------------------
     INITIAL RENDER
  ------------------------------------------------------- */
  renderDashboard();
  renderMyIssues();
  renderChart();

});
