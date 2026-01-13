document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("login.html");
    return;
  }

  let issues = [];
  let currentUser = null;

  /* ================= PROFILE ================= */
  async function loadProfile() {
    try {
      const res = await fetch("http://localhost:5000/api/employee/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Unauthorized");

      currentUser = await res.json();
      document.getElementById("welcomeName").textContent = currentUser.name;

    } catch (err) {
      console.error("Auth failed:", err);
      localStorage.removeItem("token");
      window.location.replace("login.html");
    }
  }

  /* ================= LOAD ISSUES ================= */
  async function loadIssues() {
    try {
      const res = await fetch("http://localhost:5000/api/employee/issues", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error(`API Error: ${res.status} ${res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("📊 Issues fetched:", data);
      
      issues = data.issues || data || [];
      console.log("✅ Issues count:", issues.length);

      updateStats();
      renderRecentActivity();
    } catch (err) {
      console.error("Load issues error:", err);
    }
  }

  /* ================= DASHBOARD STATS ================= */
  function updateStats() {
    const total = issues.length;
    const open = issues.filter(i => i.status === "open" || i.status === "assigned").length;
    const inProgress = issues.filter(i => i.status === "in-progress").length;
    const resolved = issues.filter(i => i.status === "resolved").length;

    console.log("📈 Stats:", { total, open, inProgress, resolved });

    const totalEl = document.getElementById("totalIssuesCount");
    const openEl = document.getElementById("openIssuesCount");
    const inProgressEl = document.getElementById("inProgressCount");
    const resolvedEl = document.getElementById("resolvedCount");

    if (totalEl) totalEl.textContent = total;
    if (openEl) openEl.textContent = open;
    if (inProgressEl) inProgressEl.textContent = inProgress;
    if (resolvedEl) resolvedEl.textContent = resolved;
  }

  /* ================= RECENT ACTIVITY (REAL-TIME WITH TECHNICIAN) ================= */
  function renderRecentActivity() {
    const container = document.getElementById("recentActivityContainer");
    if (!container) return;

    if (issues.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-12">No issues yet. Create one to get started!</p>';
      return;
    }

    container.innerHTML = issues.slice(0, 8).map(issue => {
      const statusColors = {
        'open': 'bg-yellow-100 text-yellow-800',
        'assigned': 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-purple-100 text-purple-800',
        'resolved': 'bg-green-100 text-green-800',
        'closed': 'bg-gray-100 text-gray-800'
      };
      
      const statusClass = statusColors[issue.status] || 'bg-gray-100 text-gray-800';
      const date = new Date(issue.updatedAt).toLocaleDateString();
      const time = new Date(issue.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const technicianName = issue.assignedTechnician?.name || 'Unassigned';
      const technicianInitial = technicianName.charAt(0).toUpperCase();
      
      return `
        <div class="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-lg hover:from-primary/5 hover:to-secondary/5 transition border-l-4 border-primary cursor-pointer" onclick="showIssueDetails('${issue._id}')">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <h4 class="font-bold text-gray-900 text-lg">${issue.title}</h4>
              <p class="text-sm text-gray-600 mt-1">ID: #${issue._id.slice(-6)} | ${date} at ${time}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass} capitalize ml-4 whitespace-nowrap">${issue.status}</span>
          </div>
          
          <!-- Technician & Progress Row -->
          <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full ${issue.assignedTechnician ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'} flex items-center justify-center text-xs font-bold">
                ${technicianInitial}
              </div>
              <div>
                <p class="text-xs text-gray-600">Assigned To</p>
                <p class="font-semibold text-gray-900">${technicianName}</p>
              </div>
            </div>
            <button onclick="showIssueDetails('${issue._id}')" class="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:bg-secondary transition">
              View Details →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ================= SHOW ISSUE DETAILS IN MODAL ================= */
  window.showIssueDetails = async (issueId) => {
    const issue = issues.find(i => i._id === issueId);
    if (!issue) return;

    const modal = document.getElementById('issueModal');
    
    // Fill issue details
    document.getElementById('modalTitle').textContent = issue.title;
    document.getElementById('modalCategory').textContent = issue.category || '-';
    document.getElementById('modalPriority').textContent = issue.priority || '-';
    document.getElementById('modalDescription').textContent = issue.description || '-';
    document.getElementById('modalCreated').textContent = new Date(issue.createdAt).toLocaleDateString();
    document.getElementById('modalUpdated').textContent = new Date(issue.updatedAt).toLocaleDateString();
    
    // Status badge
    const statusColors = {
      'open': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.textContent = issue.status.toUpperCase();
    statusBadge.className = `px-4 py-2 rounded-full font-bold text-sm capitalize ${statusColors[issue.status] || 'bg-gray-100 text-gray-800'}`;
    
    // Technician details
    const techSection = document.getElementById('technicianSection');
    if (issue.assignedTechnician) {
      const tech = issue.assignedTechnician;
      techSection.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
            ${tech.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="text-sm text-gray-600">Technician</p>
            <p class="text-xl font-bold text-gray-900">${tech.name}</p>
            <p class="text-sm text-gray-600 mt-1">📧 ${tech.email}</p>
            ${tech.phoneNumber ? `<p class="text-sm text-gray-600">📱 ${tech.phoneNumber}</p>` : ''}
          </div>
        </div>
      `;
    } else {
      techSection.innerHTML = '<p class="text-center text-gray-600 py-4">⏳ Waiting for technician assignment...</p>';
    }
    
    // Timeline
    const timelineContainer = document.getElementById('timelineContainer');
    if (issue.timeline && issue.timeline.length > 0) {
      timelineContainer.innerHTML = issue.timeline.map((entry, idx) => {
        const isLast = idx === issue.timeline.length - 1;
        const statusIcons = {
          'open': '📋',
          'assigned': '👤',
          'in-progress': '⚙️',
          'resolved': '✅',
          'closed': '🔒',
          'on-hold': '⏸️'
        };
        return `
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                ${statusIcons[entry.status] || '📋'}
              </div>
              ${!isLast ? '<div class="w-1 h-8 bg-primary/20"></div>' : ''}
            </div>
            <div class="pb-4">
              <p class="font-bold text-gray-900 capitalize">${entry.status}</p>
              <p class="text-sm text-gray-600">${new Date(entry.timestamp).toLocaleString()}</p>
              ${entry.note ? `<p class="text-sm text-gray-700 mt-1 italic">"${entry.note}"</p>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  /* ================= CLOSE MODAL ================= */
  const closeBtn = document.getElementById('closeModalBtn');
  const issueModal = document.getElementById('issueModal');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (issueModal) {
        issueModal.classList.add('hidden');
        issueModal.classList.remove('flex');
      }
    });
  }

  if (issueModal) {
    issueModal.addEventListener('click', (e) => {
      if (e.target.id === 'issueModal') {
        e.target.classList.add('hidden');
        e.target.classList.remove('flex');
      }
    });
  }

  /* ================= AUTO-REFRESH EVERY 5 SECONDS ================= */
  function startAutoRefresh() {
    setInterval(() => {
      loadIssues();
    }, 5000);
  }

  /* ================= LOGOUT ================= */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("login.html");
  });

  /* ================= INIT ================= */
  await loadProfile();
  await loadIssues();
  startAutoRefresh();

});
