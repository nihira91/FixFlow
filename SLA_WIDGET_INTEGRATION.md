# SLA Widget Integration Guide

The SLA Widget displays real-time SLA tracking information for issues. This guide shows you how to integrate it into your pages.

## Files Created

- **sla-widget.html** - HTML structure for the widget
- **sla-widget.js** - JavaScript logic and API calls
- **sla-widget.css** - Styling and responsive design
- **sla-widget-helper.js** - Helper functions for easy integration

## Quick Start (3 Steps)

### Step 1: Add the Helper Script to Your HTML

Add this to the `<head>` section of any page that displays issues:

```html
<script src="/sla-widget-helper.js"></script>
<link rel="stylesheet" href="/sla-widget.css">
```

### Step 2: Load the Widget When Showing an Issue

When displaying an issue detail, call:

```javascript
loadSLAWidget();
showIssueSLA('ISSUE_ID_HERE');
```

### Step 3: Example Integration in Issue Detail Page

```html
<!DOCTYPE html>
<html>
<head>
  <script src="/sla-widget-helper.js"></script>
  <link rel="stylesheet" href="/sla-widget.css">
</head>
<body>
  <!-- Your issue details here -->
  <div id="issue-details">
    <h1 id="issue-title"></h1>
    <p id="issue-description"></p>
  </div>

  <!-- SLA Widget will be inserted here -->
  <div id="sla-widget-container"></div>

  <script>
    // When issue data is loaded
    async function loadIssueDetails(issueId) {
      const response = await fetch(`/api/employee/issues/${issueId}`);
      const data = await response.json();
      
      // Display issue details
      document.getElementById('issue-title').textContent = data.issue.title;
      document.getElementById('issue-description').textContent = data.issue.description;
      
      // Show SLA widget
      loadSLAWidget();
      showIssueSLA(issueId);
    }
  </script>
</body>
</html>
```

## What the Widget Shows

### Response SLA
- **Target**: Time allowed to start work (e.g., 30 min for Critical)
- **Status**: PENDING → MET → BREACHED
- **Progress Bar**: Visual indicator of time remaining
- **Remaining**: Minutes left before breach

### Resolution SLA
- **Target**: Time allowed to complete (e.g., 2 hours for Critical)
- **Status**: PENDING → MET → BREACHED
- **Progress Bar**: Visual indicator of time remaining
- **Remaining**: Minutes left before breach

### Info Section
- **Created**: When issue was created
- **First Response**: When technician started work
- **Resolved**: When issue was closed

## Status Indicators

- 🟢 **SAFE** (Green): >75% time remaining
- 🟡 **AT RISK** (Yellow): <25% time remaining
- 🔴 **BREACHED** (Red): Time exceeded

## Auto-Refresh

The widget auto-refreshes every 30 seconds to show updated SLA information.

## API Requirements

The widget uses these API endpoints (already implemented):

```
GET /api/sla/issue/:issueId
```

Requires authentication token in localStorage under key: `token`

## Advanced Usage

### Manual Display Control

```javascript
// Load widget
loadSLAWidget();

// Show SLA for an issue
showIssueSLA('issueId123');

// Hide widget
hideSLAWidget();
```

### Direct Widget Access

Once loaded, you can access the widget instance directly:

```javascript
// Display SLA
slaWidget.displaySLAWidget('issueId123');

// Stop auto-refresh
slaWidget.stopAutoRefresh();

// Hide widget
slaWidget.hide();
```

## Integration Points

### Employee Issue Pages
- **my-issues.html** - Show SLA when viewing own issues
- **issue-detail.html** (if exists) - Full SLA tracking

### Technician Pages
- **assigned-tasks.html** - Show SLA for assigned work
- **Technician.html** - Dashboard view

### Manager/Admin Pages
- Dashboard pages - Can be extended for SLA metrics

## Styling Customization

The widget uses CSS custom properties. Override them in your styles:

```css
.sla-widget {
  /* Modify as needed */
  padding: 20px;
  border-radius: 12px;
}

.sla-status-pending {
  background-color: #f39c12;
}

.sla-status-met {
  background-color: #27ae60;
}

.sla-status-breached {
  background-color: #e74c3c;
}
```

## Troubleshooting

### Widget Not Showing
- Check browser console for errors
- Verify token exists in localStorage
- Ensure issue ID is correct

### API Errors
- Check that SLA tracking is enabled in backend
- Verify token is valid
- Check network tab for 401/403 errors

### Styling Issues
- Ensure sla-widget.css is loaded
- Check for CSS conflicts with existing styles
- Inspect element to verify classes applied

## Next Phase: SLA Dashboard

A comprehensive dashboard for managers showing:
- Overall SLA compliance metrics
- Breached SLAs by category
- SLA reports and trends
- Performance by technician/category

## Support

For issues or questions, check the SLA implementation in:
- Backend: `src/services/sla.service.js`
- API Routes: `src/routes/sla.routes.js`
- Controller: `src/controllers/sla.controller.js`
