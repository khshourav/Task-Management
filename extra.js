// Form Validation and API Integration
document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll("input[required]");
      let valid = true;
  
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          valid = false;
          alert(`${input.name} cannot be empty`);
        }
      });
  
      if (!valid) return;
  
      if (form.id === "register-form") {
        // Register API Call
        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
  
        try {
          const response = await fetch("http://localhost/TASK/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
  
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
          console.error(error);
        }
      } else if (form.id === "login-form") {
        // Login API Call
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
  
        try {
          const response = await fetch("http://localhost/TASK/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
  
          const result = await response.json();
  
          if (result.status) {
            alert("Login successful!");
            // Redirect or update UI for logged-in state
          } else {
            alert(result.message || "Login failed");
          }
        } catch (error) {
          alert("An error occurred during login");
          console.error(error);
        }
      }
    });
  });