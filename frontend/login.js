const API_BASE = "http://localhost:5000/api";

function showValidation(message) {
  document.getElementById("validationMessage").innerText = message;
  document.getElementById("validationModal").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {

  // Validation modal OK button
  const okBtn = document.getElementById("validationOkBtn");
  if (okBtn) {
    okBtn.addEventListener("click", () => {
      document.getElementById("validationModal").classList.add("hidden");
    });
  }

  // Go to Signup
  const signupBtn = document.getElementById("goToSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }

  // Password toggle
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    });
  }

});


const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ===== EMPTY FIELD CHECK =====
    if (!email || !password) {
    showValidation("Please fill in all the fields.");
    return;
    }

    // Email validation
   if (!emailRegex.test(email)) {
    showValidation("Please enter a valid email address.");
    return;
    }

    // Password validation
    if (password.length < 6) {
    showValidation("Password must be at least 6 characters.");
    return;
    }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showValidation(data.message || "Login failed.");
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);

    // Redirect
    window.location.href = "index.html";

  } catch (error) {
   showValidation("Server error. Please try again.");
  }
});


