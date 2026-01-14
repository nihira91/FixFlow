/**
 * SLA Widget Integration Helper
 * Simple utility to add SLA tracking to issue detail pages
 */

/**
 * Load SLA widget in a page
 * Call this in your issue detail pages
 */
function loadSLAWidget() {
  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/sla-widget.css';
  document.head.appendChild(link);

  // Load HTML
  fetch('/sla-widget.html')
    .then(response => response.text())
    .then(html => {
      const container = document.body;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      container.appendChild(tempDiv.firstElementChild);
    })
    .catch(err => console.error('Error loading SLA widget:', err));

  // Load JavaScript
  const script = document.createElement('script');
  script.src = '/sla-widget.js';
  script.onload = () => {
    console.log('✅ SLA Widget loaded successfully');
  };
  document.head.appendChild(script);
}

/**
 * Show SLA for a specific issue
 * Usage: showIssueSLA('issueId123')
 */
function showIssueSLA(issueId) {
  // Ensure widget is loaded first
  if (typeof slaWidget === 'undefined') {
    loadSLAWidget();
    // Wait a bit for widget to load, then display
    setTimeout(() => {
      if (typeof slaWidget !== 'undefined') {
        slaWidget.displaySLAWidget(issueId);
      }
    }, 1000);
  } else {
    slaWidget.displaySLAWidget(issueId);
  }
}

/**
 * Hide SLA widget
 */
function hideSLAWidget() {
  if (typeof slaWidget !== 'undefined') {
    slaWidget.hide();
  }
}
