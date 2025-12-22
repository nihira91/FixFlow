/* =====================================================
   FixFlow IMS — Admin Dashboard Logic
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
     TECHNICIANS 
  ----------------------------- */
  const technicians = [
    { token: "TECH201", name: "Rohit Sharma" },
    { token: "TECH202", name: "Ankit Verma" }
  ];

  /* -----------------------------
     TECHNICIAN ISSUES (DUMMY)
  ----------------------------- */
  const techIssues = [
    {
      techToken: "TECH201",
      title: "Network Cable Fault",
      desc: "LAN cable damaged on floor 3",
      category: "Network",
      status: "Pending",
      assigned: "15 Dec 2025, 11:20 AM",
      resolved: "",
      phone: "9123456789",
      email: "employee@company.com"
    },
    {
      techToken: "TECH201",
      title: "System Not Booting",
      desc: "OS crash after update",
      category: "Hardware",
      status: "Resolved",
      assigned: "14 Dec 2025, 09:10 AM",
      resolved: "14 Dec 2025, 01:30 PM",
      phone: "9988776655",
      email: "employee@company.com"
    }
  ];

  /* =====================================================
     TECHNICIAN DETAILS PAGE LOGIC
  ===================================================== */
  const techToken = new URLSearchParams(window.location.search).get("tech");
  const tech = technicians.find(t => t.token === techToken);

  // ❗ very important guard
  if (!tech) return;
  if (!document.getElementById("technicianChart")) return;

  const assignedIssues = techIssues.filter(i => i.techToken === tech.token);
  const resolved = assignedIssues.filter(i => i.status === "Resolved").length;
  const pending = assignedIssues.filter(i => i.status === "Pending").length;

  /* -------- SUMMARY -------- */
  document.getElementById("techName").textContent = tech.name;
  document.getElementById("techToken").textContent = tech.token;
  document.getElementById("techTotal").textContent = assignedIssues.length;
  document.getElementById("techResolved").textContent = resolved;
  document.getElementById("techPending").textContent = pending;

  /* -------- PIE CHART -------- */
  new Chart(document.getElementById("technicianChart"), {
    type: "pie",
    data: {
      labels: ["Resolved", "Pending"],
      datasets: [{
        data: [resolved, pending],
        backgroundColor: ["#22c55e", "#facc15"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });

  /* -------- ISSUE TABLE -------- */
  const tbody = document.getElementById("techIssueTableBody");
  tbody.innerHTML = "";

  assignedIssues.forEach((issue, index) => {
    tbody.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3">${index + 1}</td>
        <td class="px-4 py-3 font-medium">${issue.title}</td>
        <td class="px-4 py-3">${issue.desc}</td>
        <td class="px-4 py-3">${issue.category}</td>
        <td class="px-4 py-3">
          <span class="px-3 py-1 rounded-full text-xs ${
            issue.status === "Resolved"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }">
            ${issue.status}
          </span>
        </td>
        <td class="px-4 py-3">${issue.assigned}</td>
        <td class="px-4 py-3">${issue.resolved || "—"}</td>
        <td class="px-4 py-3">
          📞 ${issue.phone}<br>
          ✉️ ${issue.email}
        </td>
      </tr>
    `;
  });

});
