/* =====================================================
   FixFlow IMS — Admin Technicians (CLICK → DETAILS)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const technicians = [
    { sn: 1, token: "TECH201", name: "Rohit Sharma", join: "05 Feb 2024", resign: "—" },
    { sn: 2, token: "TECH202", name: "Ankit Verma", join: "12 Mar 2024", resign: "—" },
    { sn: 3, token: "TECH203", name: "Neha Patel", join: "20 Apr 2024", resign: "—" },
    { sn: 4, token: "TECH204", name: "Aman Singh", join: "01 Jun 2024", resign: "—" },
    { sn: 5, token: "TECH205", name: "Pooja Mehta", join: "15 Jul 2024", resign: "—" }
  ];

  const tableBody = document.getElementById("technicianTable");
  tableBody.innerHTML = "";

  technicians.forEach(tech => {
    tableBody.innerHTML += `
      <tr class="hover:bg-gray-50 border-b">
        <td class="p-4 text-center">${tech.sn}</td>
        <td class="font-mono">${tech.token}</td>
        <td class="font-medium">${tech.name}</td>
        <td>${tech.join}</td>
        <td>${tech.resign}</td>
        <td class="text-primary cursor-pointer font-medium" data-token="${tech.token}">
          Click here
        </td>
      </tr>
    `;
  });

  /*  SINGLE EVENT HANDLER */
  tableBody.addEventListener("click", (e) => {
    const token = e.target.dataset.token;
    if (token) {
      window.location.href = `technician-details.html?token=${token}`;
    }
  });

});
