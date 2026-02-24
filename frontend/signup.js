const API_BASE = "http://localhost:5000/api";

function showValidation(message) {
  document.getElementById("validationMessage").innerText = message;
  document.getElementById("validationModal").classList.remove("hidden");
}


const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // ===== EMPTY FIELD CHECK =====
    if (!name || !email || !password || !confirmPassword) {
    showValidation("Please fill in all the fields.");
    return;
    }

    // ===== NAME VALIDATION =====
    if (!/^[a-zA-Z\s]+$/.test(name)) {
    showValidation("Name must contain only letters.");
    return;
    }

    // ===== EMAIL VALIDATION =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
    showValidation("Please enter a valid email address.");
    return;
    }

    // ===== PASSWORD VALIDATION =====
    const strongPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password);

    if (!strongPassword) {
    showValidation(
        "Password must be 8+ characters with uppercase, lowercase, number & special character."
    );
    return;
    }

    // ===== CONFIRM PASSWORD =====
    if (password !== confirmPassword) {
    showValidation("Passwords do not match.");
    return;
    }


  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showValidation(data.message || "Signup failed.");
      return;
    }
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";

  } catch (error) {
    showValidation("Server error. Please try again.");
  }
});


document.addEventListener("DOMContentLoaded", () => {

  const okBtn = document.getElementById("validationOkBtn");
  if (okBtn) {
    okBtn.addEventListener("click", () => {
      document.getElementById("validationModal").classList.add("hidden");
    });
  }

  const loginSwitch = document.getElementById("goToLogin");
  if (loginSwitch) {
    loginSwitch.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    });
  }

  const toggleConfirm = document.getElementById("toggleConfirmPassword");
  if (toggleConfirm) {
    toggleConfirm.addEventListener("click", () => {
      const confirmInput = document.getElementById("confirmPassword");
      confirmInput.type =
        confirmInput.type === "password" ? "text" : "password";
    });
  }

});