/* =========================================
   Employee Details 
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* TOKEN FROM URL */
  const token = new URLSearchParams(window.location.search).get("token");

  /* DUMMY BACKEND DATABASE (API later) */
  const EMPLOYEE_DB = {
    EMP101: {
      token: "EMP101",
      name: "Aisha Khan",
      issues: [
        {
          title: "Network Issue",
          desc: "Internet not working",
          category: "IT / Network",
          status: "Pending",
          assigned: "12 Dec 2025",
          resolved: "—",
          assignedTo: {
            id: "TECH201",
            name: "Rohit Sharma",
            phone: "9123456789",
            email: "rohit@company.com"
          }
        },
        {
          title: "Printer Error",
          desc: "Driver problem",
          category: "Hardware",
          status: "Resolved",
          assigned: "10 Dec 2025",
          resolved: "10 Dec 2025",
          assignedTo: {
            id: "TECH202",
            name: "Ankit Verma",
            phone: "9988776655",
            email: "ankit@company.com"
          }
        },
        {
          title: "Email Login Failed",
          desc: "Unable to login",
          category: "Software",
          status: "Pending",
          assigned: "11 Dec 2025",
          resolved: "—",
          assignedTo: {
            id: "TECH201",
            name: "Rohit Sharma",
            phone: "9123456789",
            email: "rohit@company.com"
          }
        },
        {
          title: "System Slow",
          desc: "PC hanging",
          category: "Performance",
          status: "Resolved",
          assigned: "09 Dec 2025",
          resolved: "09 Dec 2025",
          assignedTo: {
            id: "TECH203",
            name: "Neha Patel",
            phone: "9001122334",
            email: "neha@company.com"
          }
        },
        {
          title: "VPN Not Connecting",
          desc: "VPN drops frequently",
          category: "Security",
          status: "Resolved",
          assigned: "08 Dec 2025",
          resolved: "08 Dec 2025",
          assignedTo: {
            id: "TECH202",
            name: "Ankit Verma",
            phone: "9988776655",
            email: "ankit@company.com"
          }
        }
      ]
    },

    EMP102: {
      token: "EMP102",
      name: "Rahul Verma",
      issues: [
        {
          title: "System Restart Loop",
          desc: "PC restarting again and again",
          category: "Hardware",
          status: "Pending",
          assigned: "12 Dec 2025",
          resolved: "—",
          assignedTo: {
            id: "TECH204",
            name: "Aman Singh",
            phone: "9011223344",
            email: "aman@company.com"
          }
        }
      ]
    }
  };

  /* GET EMPLOYEE */
  const employee = EMPLOYEE_DB[token];
  if (!employee) {
    alert("Employee not found");
    return;
  }

  /* COUNTS */
  const total = employee.issues.length;
  const resolved = employee.issues.filter(i => i.status === "Resolved").length;
  const pending = total - resolved;

  /* SUMMARY UI */
  empName.textContent = employee.name;
  empToken.textContent = employee.token;
  empTotal.textContent = total;
  empResolved.textContent = resolved;
  empPending.textContent = pending;

  /* PIE CHART (SMALL & FIXED) */
  const canvas = document.getElementById("employeeChart");
  canvas.style.maxWidth = "220px";
  canvas.style.maxHeight = "220px";

  new Chart(canvas, {
    type: "pie",
    data: {
      labels: ["Resolved", "Pending"],
      datasets: [{
        data: [resolved, pending],
        backgroundColor: ["#22c55e", "#facc15"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  /* ISSUE HISTORY TABLE */
  const tbody = document.getElementById("issueTableBody");
  tbody.innerHTML = "";

  employee.issues.forEach((issue, index) => {
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
          }">${issue.status}</span>
        </td>
        <td class="px-4 py-3">${issue.assigned}</td>
        <td class="px-4 py-3">${issue.resolved}</td>
        <td class="px-4 py-3">
          👨‍🔧 ${issue.assignedTo.name}<br>
          📞 ${issue.assignedTo.phone}<br>
          ✉️ ${issue.assignedTo.email}
        </td>
      </tr>
    `;
  });

});
