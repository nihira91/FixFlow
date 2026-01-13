console.log("📝 report-issue.js LOADED");

// Check authentication
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token || !user.id) {
  alert("Please login first");
  window.location.href = "login.html";
}

// DOM Elements
const issueForm = document.getElementById("issueForm");
const issueTitle = document.getElementById("issueTitle");
const issueDesc = document.getElementById("issueDesc");
const issueLocation = document.getElementById("issueLocation");
const issueCategory = document.getElementById("issueCategory");
const issuePriority = document.getElementById("issuePriority");
const priorityButtons = document.querySelectorAll(".priority-btn");

// Priority Button Handler
priorityButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Remove active state from all buttons
    priorityButtons.forEach(b => {
      b.classList.remove("ring-2", "ring-offset-2", "ring-primary");
      b.style.opacity = "0.7";
    });
    
    // Add active state to clicked button
    btn.classList.add("ring-2", "ring-offset-2", "ring-primary");
    btn.style.opacity = "1";
    
    // Set hidden input value
    issuePriority.value = btn.dataset.priority;
    console.log("✅ Priority selected:", btn.dataset.priority);
  });
});

// Form Submit Handler
issueForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = issueTitle.value.trim();
  const description = issueDesc.value.trim();
  const location = issueLocation.value.trim();
  const category = issueCategory.value.trim();
  const priority = issuePriority.value.trim();

  // Validation
  if (!title) {
    alert("Please enter issue title");
    return;
  }

  if (!description) {
    alert("Please enter issue description");
    return;
  }

  if (!location) {
    alert("Please enter issue location");
    return;
  }

  if (!category) {
    alert("Please select a category");
    return;
  }

  if (!priority) {
    alert("Please select a priority level");
    return;
  }

  console.log("📤 Creating issue with data:", {
    title,
    description,
    location,
    category,
    priority
  });

  try {
    // Submit issue to backend
    const response = await fetch("http://localhost:5000/api/employee/issues/issue/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        location,
        category,
        priority,
        images: []
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Issue created successfully:", data);
      
      // Show success message
      alert("✅ Issue reported successfully!\n\nThe issue has been assigned to a technician in the " + category + " category.");
      
      // Reset form
      issueForm.reset();
      issuePriority.value = "";
      priorityButtons.forEach(b => {
        b.classList.remove("ring-2", "ring-offset-2", "ring-primary");
        b.style.opacity = "0.7";
      });
      
      // Redirect to my-issues page after 2 seconds
      setTimeout(() => {
        window.location.href = "my-issues.html";
      }, 2000);
    } else {
      console.error("❌ Error creating issue:", data);
      alert("Error: " + (data.message || "Failed to create issue"));
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    alert("Server error: " + error.message);
  }
});

console.log("✅ report-issue.js initialized successfully");
