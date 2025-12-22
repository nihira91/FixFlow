/* =========================================
   Admin | All Issues Analytics
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* DUMMY BACKEND DATA */
  const data = {
    total: 248,
    resolved: 190,
    pending: 58,
    critical: 12,

    categories: [
      { name: "Network", total: 80, resolved: 60 },
      { name: "Hardware", total: 65, resolved: 55 },
      { name: "Software", total: 55, resolved: 45 },
      { name: "Security", total: 30, resolved: 20 },
      { name: "Other", total: 18, resolved: 10 }
    ]
  };

  /* SUMMARY */
  totalIssues.textContent = data.total;
  resolvedIssues.textContent = data.resolved;
  pendingIssues.textContent = data.pending;
  criticalIssues.textContent = data.critical;

  const labels = data.categories.map(c => c.name);
  const totalData = data.categories.map(c => c.total);
  const resolvedData = data.categories.map(c => c.resolved);

  /* TOTAL ISSUES PIE */
  new Chart(document.getElementById("totalChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: totalData,
        backgroundColor: [
          "#5eead4",
          "#7dd3fc",
          "#fde047",
          "#fca5a5",
          "#c4b5fd"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: ctx => `Total: ${ctx.raw}`
          }
        }
      }
    }
  });

  /* RESOLVED ISSUES PIE */
  new Chart(document.getElementById("resolvedChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: resolvedData,
        backgroundColor: [
          "#0d9488",
          "#0284c7",
          "#fde047",
          "#dc2626",
          "#7c3aed"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: ctx => `Resolved: ${ctx.raw}`
          }
        }
      }
    }
  });

});
