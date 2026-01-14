console.log("📋 Assigned Tasks Page Loaded");

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

// Check authentication
if (!token || !user.id) {
  alert("Please login first");
  window.location.href = "login.html";
}

let allIssues = [];

// ==========================================
// LOAD ASSIGNED ISSUES
// ==========================================
async function loadAssignedIssues() {
  try {
    const response = await fetch(`${API_BASE}/technician/issues/assigned`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error("Failed to load issues:", response.status);
      return;
    }

    const data = await response.json();
    allIssues = data.issues || [];

    console.log(`Loaded ${allIssues.length} assigned issues`);
    displayIssues(allIssues);

  } catch (error) {
    console.error("Error loading assigned issues:", error);
  }
}

// ==========================================
// DISPLAY ISSUES
// ==========================================
function displayIssues(issues) {
  const container = document.getElementById("tasksContainer");

  if (issues.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-10 bg-white/70 rounded-xl text-center">
        <p class="text-gray-600 text-lg">✨ No assigned tasks yet!</p>
        <p class="text-gray-500 text-sm mt-2">You will receive notifications when new issues are assigned.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = issues.map(issue => {
    const statusColors = {
      'assigned': 'blue',
      'in-progress': 'purple',
      'resolved': 'green',
      'closed': 'gray'
    };

    const statusColor = statusColors[issue.status] || 'blue';
    const borderColor = {
      'blue': 'border-blue-300',
      'purple': 'border-purple-300',
      'green': 'border-green-300',
      'gray': 'border-gray-300'
    }[statusColor];

    const bgColor = {
      'blue': 'bg-blue-50',
      'purple': 'bg-purple-50',
      'green': 'bg-green-50',
      'gray': 'bg-gray-50'
    }[statusColor];

    const textColor = {
      'blue': 'text-blue-700',
      'purple': 'text-purple-700',
      'green': 'text-green-700',
      'gray': 'text-gray-700'
    }[statusColor];

    const createdDate = new Date(issue.createdAt).toLocaleDateString('en-IN');

    // 🎯 SLA STATUS BADGE
    const slaStatus = issue.sla?.responseStatus || 'pending';
    const slaBreached = issue.sla?.responseTimeBreached || false;
    const remainingTime = issue.sla?.responseTimeRemaining || 0;
    
    let slaColor = 'bg-gray-100 text-gray-700';
    let slaText = '⏳ No SLA';
    
    if (slaBreached) {
      slaColor = 'bg-red-100 text-red-700 border border-red-300 animate-pulse';
      slaText = `🚨 SLA BREACHED`;
    } else if (slaStatus === 'met') {
      slaColor = 'bg-green-100 text-green-700 border border-green-300';
      slaText = `✅ SLA MET`;
    } else if (slaStatus === 'pending' && remainingTime > 0) {
      if (remainingTime < (issue.sla?.responseTimeTarget || 60) * 0.25) {
        slaColor = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
        slaText = `⚠️ AT RISK (${Math.round(remainingTime)}m)`;
      } else {
        slaColor = 'bg-blue-100 text-blue-700 border border-blue-300';
        slaText = `⏱️ ${Math.round(remainingTime)}m left`;
      }
    }

    return `
      <div class="task-card bg-white rounded-xl shadow-lg p-6 border-l-4 ${borderColor} hover:shadow-xl">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-lg text-gray-800">${escapeHtml(issue.title)}</h3>
            <p class="text-gray-600 text-sm mt-1">📍 ${escapeHtml(issue.location)}</p>
          </div>
          <span class="px-3 py-1 text-sm font-medium rounded-full ${bgColor} ${textColor}">
            ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
          </span>
        </div>

        <!-- Description -->
        <p class="text-gray-700 text-sm mb-4">${escapeHtml(issue.description.substring(0, 100))}${issue.description.length > 100 ? '...' : ''}</p>

        <!-- Category & Priority -->
        <div class="flex gap-3 mb-4">
          <span class="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-lg font-medium">
            🏷️ ${escapeHtml(issue.category)}
          </span>
          <span class="px-2 py-1 ${
            issue.priority === 'Critical' ? 'bg-red-50 text-red-700' :
            issue.priority === 'Urgent' ? 'bg-orange-50 text-orange-700' :
            issue.priority === 'Routine' ? 'bg-yellow-50 text-yellow-700' :
            'bg-blue-50 text-blue-700'
          } text-xs rounded-lg font-medium">
            ⚡ ${escapeHtml(issue.priority)}
          </span>
        </div>

        <!-- 🎯 SLA Badge -->
        <div class="mb-4 px-3 py-2 rounded-lg text-xs font-bold ${slaColor}">
          ${slaText}
        </div>

        <!-- Date -->
        <p class="text-gray-500 text-xs mb-4">📅 ${createdDate}</p>

        <!-- Action Button -->
        <button onclick="viewIssueDetails('${issue._id}')" class="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition font-medium">
          View Details →
        </button>
      </div>
    `;
  }).join('');
}

// ==========================================
// FILTER & SEARCH
// ==========================================
function setupFilters() {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");

  searchInput.addEventListener("input", filterIssues);
  statusFilter.addEventListener("change", filterIssues);
}

function filterIssues() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const statusValue = document.getElementById("statusFilter").value;

  const filtered = allIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchValue) ||
                         issue.description.toLowerCase().includes(searchValue);
    const matchesStatus = !statusValue || issue.status === statusValue;

    return matchesSearch && matchesStatus;
  });

  displayIssues(filtered);
}

// ==========================================
// VIEW ISSUE DETAILS (MODAL)
// ==========================================
function viewIssueDetails(issueId) {
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
  
  // Reporter details
  const reporterSection = document.getElementById('reporterSection');
  if (issue.createdBy) {
    const reporter = issue.createdBy;
    reporterSection.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
          ${reporter.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p class="text-sm text-gray-600">Reported By</p>
          <p class="text-xl font-bold text-gray-900">${reporter.name}</p>
          <p class="text-sm text-gray-600 mt-1">📧 ${reporter.email}</p>
          ${reporter.phoneNumber ? `<p class="text-sm text-gray-600">📱 ${reporter.phoneNumber}</p>` : ''}
        </div>
      </div>
    `;
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
  
  // 🎯 LOAD SLA WIDGET
  if (typeof slaWidget !== 'undefined') {
    slaWidget.displaySLAWidget(issueId);
  }
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// ==========================================
// NAVIGATION
// ==========================================
function setupNavigation() {
  const navLinks = document.querySelectorAll('aside nav a');

  navLinks.forEach(link => {
    link.style.cursor = 'pointer';

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = link.textContent.trim();

      switch(text) {
        case 'Dashboard':
          window.location.href = 'Technician.html';
          break;
        case 'Assigned Tasks':
          // Already on this page
          break;
        case 'Live Issues':
          window.location.href = 'live_issues.html';
          break;
        case 'My Profile':
          window.location.href = 'profile.html';
          break;
        case 'Logout':
          logout();
          break;
      }
    });
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Logged out successfully");
  window.location.href = "login.html";
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("📋 Initializing Assigned Tasks Page...");

  loadAssignedIssues();
  setupFilters();
  setupNavigation();

  // Modal close button handler
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

  // Reload every 5 seconds for real-time updates
  setInterval(loadAssignedIssues, 5000);
});
