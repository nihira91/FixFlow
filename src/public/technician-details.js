/* =========================================
   Technician Details 
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const token = new URLSearchParams(window.location.search).get("token");

  /* DUMMY BACKEND DATABASE (API later) */
  const TECHNICIAN_DB = {
    TECH201: {
      token: "TECH201",
      name: "Rohit Sharma",
      issues: [
        {
          title: "Network Cable Fault",
          desc: "LAN cable damaged on floor 2",
          category: "Network",
          status: "Pending",
          assigned: "12 Dec 2025",
          resolved: "—",
          employeeContact: {
            name: "Aisha Khan",
            phone: "9876543210",
            email: "aisha@company.com"
          }
        },
        {
          title: "System Not Booting",
          desc: "PC stuck on boot screen",
          category: "Hardware",
          status: "Resolved",
          assigned: "11 Dec 2025",
          resolved: "11 Dec 2025",
          employeeContact: {
            name: "Rahul Verma",
            phone: "9123456789",
            email: "rahul@company.com"
          }
        },
        {
          title: "VPN Issue",
          desc: "VPN disconnects frequently",
          category: "Security",
          status: "Pending",
          assigned: "10 Dec 2025",
          resolved: "—",
          employeeContact: {
            name: "Neha Sharma",
            phone: "9988776655",
            email: "neha@company.com"
          }
        }
      ]
    },

    TECH202: {
      token: "TECH202",
      name: "Ankit Verma",
      issues: [
        {
          title: "Printer Error",
          desc: "Printer driver missing",
          category: "Hardware",
          status: "Resolved",
          assigned: "09 Dec 2025",
          resolved: "09 Dec 2025",
          employeeContact: {
            name: "Aman Gupta",
            phone: "9012345678",
            email: "aman@company.com"
          }
        }
      ]
    }
  };

  const technician = TECHNICIAN_DB[token];
  if (!technician) {
    alert("Technician not found");
    return;
  }

  /* COUNTS */
  const total = technician.issues.length;
  const resolved = technician.issues.filter(i => i.status === "Resolved").length;
  const pending = total - resolved;

  /* UI SUMMARY */
  techName.textContent = technician.name;
  techToken.textContent = technician.token;
  techTotal.textContent = total;
  techResolved.textContent = resolved;
  techPending.textContent = pending;

  /* PIE CHART */
  const canvas = document.getElementById("technicianChart");
  canvas.style.maxWidth = "220px";
  canvas.style.maxHeight = "220px";

  new Chart(canvas, {
    type: "pie",
    data: {
      labels: ["Resolved", "Pending"],
      datasets: [{
        data: [resolved, pending],
        backgroundColor: ["#22c55e", "#facc15"]
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { position: "bottom" } }
    }
  });

  /* ISSUE TABLE RENDER */
  const tbody = document.getElementById("techIssueTableBody");
  tbody.innerHTML = "";

  technician.issues.forEach((issue, i) => {
    tbody.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3">${i + 1}</td>
        <td class="px-4 py-3 font-medium">${issue.title}</td>
        <td class="px-4 py-3 text-gray-600">${issue.desc}</td>
        <td class="px-4 py-3">${issue.category}</td>
        <td class="px-4 py-3">
          <span class="px-3 py-1 rounded-full text-xs ${
            issue.status === "Resolved"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }">${issue.status}</span>
        </td>
        <td class="px-4 py-3">${issue.assigned}</td>
        <td class="px-4 py-3">${issue.resolved}</td>
        <td class="px-4 py-3 text-sm">
          👤 ${issue.employeeContact.name}<br>
          📞 ${issue.employeeContact.phone}<br>
          ✉️ ${issue.employeeContact.email}
        </td>
      </tr>
    `;
  });

});