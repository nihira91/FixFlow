console.log("🔥 technician-profile-completion.js LOADED 🔥");

const form = document.getElementById("profileForm");
const categoryField = document.getElementById("category");
const maxCapacityField = document.getElementById("maxCapacity");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const category = categoryField.value.trim();
  const maxCapacity = parseInt(maxCapacityField.value);

  if (!category) {
    showError("Please select a category");
    return;
  }

  if (maxCapacity < 1 || maxCapacity > 50) {
    showError("Max capacity must be between 1 and 50");
    return;
  }

  // Get token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    showError("Session expired. Please signup again.");
    setTimeout(() => {
      window.location.href = "signup.html";
    }, 2000);
    return;
  }

  try {
    loadingDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");

    const response = await fetch("http://localhost:5000/api/technician/auth/complete-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        category,
        maxCapacity
      })
    });

    const data = await response.json();
    loadingDiv.classList.add("hidden");

    if (response.ok) {
      // Update user data in localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      user.category = category;
      user.profileCompleted = true;
      localStorage.setItem("user", JSON.stringify(user));

      alert("Profile completed successfully!");
      window.location.href = "Technician.html";
    } else {
      showError(data.message || "Failed to complete profile");
    }
  } catch (err) {
    console.error(err);
    loadingDiv.classList.add("hidden");
    showError("Server not responding. Please try again.");
  }
});

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}
