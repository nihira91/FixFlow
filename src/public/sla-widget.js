/**
 * SLA Widget JavaScript
 * Fetches and displays SLA tracking information for issues
 * Usage: Call displaySLAWidget(issueId) to show SLA data for an issue
 */

class SLAWidget {
  constructor() {
    this.apiBaseUrl = '/api/sla';
    this.widget = document.getElementById('sla-widget');
    this.updateInterval = null;
  }

  /**
   * Display SLA widget for a specific issue
   */
  async displaySLAWidget(issueId) {
    try {
      if (!this.widget) {
        console.error('SLA widget container not found');
        return;
      }

      // Fetch SLA data
      const response = await fetch(`${this.apiBaseUrl}/issue/${issueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch SLA data:', response.status);
        this.widget.style.display = 'none';
        return;
      }

      const data = await response.json();
      this.renderSLAWidget(data);

      // Auto-refresh every 30 seconds
      this.startAutoRefresh(issueId);

    } catch (error) {
      console.error('Error displaying SLA widget:', error);
      this.widget.style.display = 'none';
    }
  }

  /**
   * Render SLA data in the widget
   */
  renderSLAWidget(data) {
    const sla = data.sla;

    // Response SLA
    this.updateSLAItem(
      'response',
      sla.responseStatus,
      sla.responseTimeTarget,
      sla.responseTimeRemaining,
      sla.responseTimeBreached
    );

    // Resolution SLA
    this.updateSLAItem(
      'resolution',
      sla.resolutionStatus,
      sla.resolutionTimeTarget,
      sla.resolutionTimeRemaining,
      sla.resolutionTimeBreached
    );

    // Update info
    document.getElementById('created-time').textContent = this.formatTime(data.createdAt);
    document.getElementById('first-response-time').textContent = sla.firstResponseTime 
      ? this.formatTime(sla.firstResponseTime) 
      : 'Not yet';
    document.getElementById('resolved-time').textContent = sla.resolvedTime 
      ? this.formatTime(sla.resolvedTime) 
      : 'Not yet';

    this.widget.style.display = 'block';
  }

  /**
   * Update individual SLA item (response or resolution)
   */
  updateSLAItem(type, status, target, remaining, breached) {
    const statusBadge = document.getElementById(`${type}-status`);
    const targetSpan = document.getElementById(`${type}-target`);
    const progressBar = document.getElementById(`${type}-progress`);
    const progressFill = document.getElementById(`${type}-fill`);
    const remainingSpan = document.getElementById(`${type}-remaining`);

    // Update status badge with color
    statusBadge.textContent = status.toUpperCase();
    statusBadge.className = `sla-status-badge sla-status-${status}`;
    if (breached) {
      statusBadge.classList.add('breached');
    }

    // Update target
    targetSpan.textContent = target || '--';

    // Calculate progress percentage
    const elapsed = target - remaining;
    const percentage = target > 0 ? Math.min((elapsed / target) * 100, 100) : 0;

    // Update progress bar
    progressFill.style.width = percentage + '%';
    progressFill.className = this.getProgressColor(status, percentage, breached);

    // Update remaining time
    if (remaining <= 0) {
      remainingSpan.textContent = '⏰ TIME EXCEEDED';
      remainingSpan.className = 'sla-remaining breached';
    } else if (remaining < target * 0.25) {
      remainingSpan.textContent = `⚠️ ${Math.round(remaining)} min remaining (AT RISK)`;
      remainingSpan.className = 'sla-remaining at-risk';
    } else {
      remainingSpan.textContent = `✅ ${Math.round(remaining)} min remaining`;
      remainingSpan.className = 'sla-remaining safe';
    }
  }

  /**
   * Get CSS class for progress bar based on status
   */
  getProgressColor(status, percentage, breached) {
    let baseClass = 'sla-progress-fill';

    if (breached) {
      return `${baseClass} breached`;
    }

    if (percentage >= 75) {
      return `${baseClass} at-risk`;
    }

    return `${baseClass} safe`;
  }

  /**
   * Format timestamp to readable format
   */
  formatTime(timestamp) {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  /**
   * Start auto-refresh every 30 seconds
   */
  startAutoRefresh(issueId) {
    // Clear existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Refresh every 30 seconds
    this.updateInterval = setInterval(() => {
      this.displaySLAWidget(issueId);
    }, 30000);
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Hide the widget
   */
  hide() {
    this.widget.style.display = 'none';
    this.stopAutoRefresh();
  }
}

// Initialize global SLA widget instance
const slaWidget = new SLAWidget();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SLAWidget;
}
