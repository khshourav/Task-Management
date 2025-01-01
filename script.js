// Ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Form Toggle Logic
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(loginForm, registerForm);
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(registerForm, loginForm);
  });

  function toggleForms(hideForm, showForm) {
    hideForm.classList.add("slide-out");
    hideForm.addEventListener(
      "animationend",
      () => {
        hideForm.classList.add("hidden");
        hideForm.classList.remove("slide-out");

        showForm.classList.remove("hidden");
        showForm.classList.add("slide-in");
      },
      { once: true }
    );
  }

  // Form API Call
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission

      // Register API Call
      if (form.id === "register-form") {
        // Ensure elements exist before accessing them
        const nameInput = document.getElementById("register-name");
        const emailInput = document.getElementById("register-email");
        const passwordInput = document.getElementById("register-password");

        if (!nameInput || !emailInput || !passwordInput) {
          console.error("Form elements not found");
          alert("Form elements are missing!");
          return; // Exit if elements don't exist
        }

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
          const response = await fetch("http://localhost/TASK/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          // Wait for the JSON response
          const result = await response.json();
          console.log(result);

          if (result.status) {
            alert("Registration successful!");
            showLogin.click(); // Switch to login form
          } else {
            alert(result.message || "Registration failed");
          }
        } catch (error) {
          alert("An error occurred during registration");
          console.log(error);
        }
      }

      // Login API Call
      if (form.id === "login-form") {
        // Ensure elements exist before accessing them
        const emailInput = document.getElementById("login-email");
        const passwordInput = document.getElementById("login-password");

        if (!emailInput || !passwordInput) {
          console.error("Form elements not found");
          alert("Form elements are missing!");
          return; // Exit if elements don't exist
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
          const response = await fetch("http://localhost/TASK/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          // Wait for the JSON response
          const result = await response.json();
          
          if (result.status) {
            localStorage.setItem('token', result.token);
            alert("Login successful!");
            window.location.href = "profile.html";
        } else {
            alert(result.message || "Login failed");
        }
        } catch (error) {
          alert("An error occurred during Login");
          console.log(error);
        }
      }
    });
  });
});