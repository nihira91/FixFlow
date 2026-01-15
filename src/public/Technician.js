console.log("🔧 Technician Dashboard Loaded");

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");
let allIssues = [];

// Check authentication
if (!token || !user.id) {
  alert("Please login first");
  window.location.href = "login.html";
}

// ==========================================
// REAL-TIME DATA LOADING
// ==========================================
async function loadDashboardData() {
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

    // Calculate statistics
    const tasksAssigned = allIssues.length;
    const tasksInProgress = allIssues.filter(i => i.status === 'in-progress').length;
    const completedTasks = allIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length;

    // Update dashboard numbers
    updateDashboard(tasksAssigned, tasksInProgress, completedTasks);
    
    // Display assigned issues
    displayAssignedIssues();

  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

function updateDashboard(assigned, inProgress, completed) {
  // Update by element ID
  const assignedEl = document.getElementById('tasksAssigned');
  const inProgressEl = document.getElementById('tasksInProgress');
  const completedEl = document.getElementById('tasksCompleted');
  
  if (assignedEl) assignedEl.textContent = assigned;
  if (inProgressEl) inProgressEl.textContent = inProgress;
  if (completedEl) completedEl.textContent = completed;

  console.log(`✅ Dashboard updated: ${assigned} assigned, ${inProgress} in progress, ${completed} completed`);
}

// ==========================================
// DISPLAY ASSIGNED ISSUES
// ==========================================
function displayAssignedIssues() {
  const container = document.getElementById('assignedIssuesContainer');
  if (!container) return;

  if (allIssues.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-12 col-span-full">No assigned issues at the moment</p>';
    return;
  }

  container.innerHTML = allIssues.map(issue => {
    const statusColors = {
      'open': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    
    const priorityColors = {
      'Critical': 'bg-red-50 text-red-700 border-l-4 border-red-500',
      'Urgent': 'bg-orange-50 text-orange-700 border-l-4 border-orange-500',
      'Routine': 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500',
      'Risky': 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
    };

    const statusClass = statusColors[issue.status] || 'bg-gray-100 text-gray-800';
    const priorityClass = priorityColors[issue.priority] || 'bg-gray-50 text-gray-700 border-l-4 border-gray-500';
    const date = new Date(issue.createdAt).toLocaleDateString();
    
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
      <div class="p-6 rounded-xl shadow-lg ${priorityClass} hover:shadow-xl transition cursor-pointer">
        <div class="flex justify-between items-start mb-3">
          <h4 class="font-bold text-lg">${issue.title}</h4>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass} capitalize">${issue.status}</span>
        </div>
        
        <p class="text-sm mb-3 opacity-90">📍 ${issue.location}</p>
        
        <div class="flex gap-2 mb-4">
          <span class="px-2 py-1 bg-white/50 rounded text-xs font-medium">🏷️ ${issue.category}</span>
          <span class="px-2 py-1 bg-white/50 rounded text-xs font-medium">⚡ ${issue.priority}</span>
        </div>
        
        <!-- 🎯 SLA Badge -->
        <div class="mb-4 px-3 py-2 rounded-lg text-xs font-bold ${slaColor}">
          ${slaText}
        </div>
        
        <p class="text-xs opacity-75 mb-4">📅 ${date}</p>
        
        <button onclick="viewIssueDetails('${issue._id}')" class="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium text-sm">
          View Details →
        </button>
      </div>
    `;
  }).join('');
}

// ==========================================
// VIEW ISSUE DETAILS (MODAL)
// ==========================================
function viewIssueDetails(issueId) {
  const issue = allIssues.find(i => i._id === issueId);
  if (!issue) return;

  const modal = document.getElementById('issueModal');
  
  // Fill issue details
  document.getElementById('modalTitle').textContent = issue.title;
  document.getElementById('modalCategory').textContent = issue.category || '-';
  document.getElementById('modalPriority').textContent = issue.priority || '-';
  document.getElementById('modalLocation').textContent = issue.location || '-';
  document.getElementById('modalDescription').textContent = issue.description || '-';
  document.getElementById('modalCreated').textContent = new Date(issue.createdAt).toLocaleDateString();
  
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
  
  // 📊 LOAD PROGRESS WIDGET
  document.getElementById('progressWidget').style.display = 'block';
  setupProgressWidget('technician');
  loadProgressUpdates(issueId);
  
  // ✅ SHOW COMPLETION SECTION FOR IN-PROGRESS ISSUES
  if (issue.status === 'in-progress' || issue.status === 'assigned') {
    document.getElementById('completionSection').style.display = 'block';
  } else {
    document.getElementById('completionSection').style.display = 'none';
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
          // Already on dashboard, reload data
          loadDashboardData();
          break;
        case 'Assigned Tasks':
          window.location.href = 'assigned-tasks.html';
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
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔧 Initializing Technician Dashboard...");
  
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
  
  // Load data every 5 seconds for real-time updates
  loadDashboardData();
  setInterval(loadDashboardData, 5000);
  
  // Setup navigation
  setupNavigation();
  
  // Display technician name
  const header = document.querySelector('h2');
  if (header && user.name) {
    header.textContent = `Welcome, ${user.name} 👨‍🔧`;
  }
});
