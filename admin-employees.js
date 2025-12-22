/* =========================================
   Admin Employees — FINAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const employees = [
    { sn: 1, token: "EMP101", name: "Aisha Khan", join: "01 Jan 2024", resign: "—" },
    { sn: 2, token: "EMP102", name: "Rahul Verma", join: "10 Feb 2024", resign: "—" },
    { sn: 3, token: "EMP103", name: "Neha Sharma", join: "18 Mar 2024", resign: "—" }
  ];

  const tableBody = document.getElementById("employeeTable");
  tableBody.innerHTML = "";

  employees.forEach(emp => {
    tableBody.innerHTML += `
      <tr class="hover:bg-gray-50 border-b">
        <td class="p-4 text-center">${emp.sn}</td>
        <td class="font-mono">${emp.token}</td>
        <td class="font-medium">${emp.name}</td>
        <td>${emp.join}</td>
        <td>${emp.resign}</td>
        <td class="text-primary cursor-pointer font-medium"
            data-token="${emp.token}">
          Click here
        </td>
      </tr>
    `;
  });

  //  TOKEN PASS (MOST IMPORTANT)
  tableBody.addEventListener("click", (e) => {
    if (e.target.dataset.token) {
      window.location.href =
        `employee-details.html?token=${e.target.dataset.token}`;
    }
  });

});
