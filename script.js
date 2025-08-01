document.addEventListener("DOMContentLoaded", () => {
  // Apply fade-in-up animation to hero section and cards
  const heroSection = document.querySelector(".hero-section")
  if (heroSection) {
    heroSection.style.opacity = 1
    heroSection.style.transform = "translateY(0)"
  }

  const glassCards = document.querySelectorAll(".glass-card")
  glassCards.forEach((card, index) => {
    card.style.opacity = 1
    card.style.transform = "translateY(0)"
  })

  // Ripple effect for buttons
  const buttons = document.querySelectorAll(".ripple-effect")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement("span")
      ripple.classList.add("ripple")
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      this.appendChild(ripple)

      // Remove the ripple element after animation
      ripple.addEventListener("animationend", () => {
        ripple.remove()
      })
    })
  })

  // --- Dark Mode Toggle (Placeholder - will be fully implemented in profile.html) ---
  const themeToggleBtn = document.getElementById("theme-toggle")
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme")
      // Save preference to localStorage
      if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark")
      } else {
        localStorage.setItem("theme", "light")
      }
    })
  }

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.body.classList.add(savedTheme + "-theme")
  }

  // --- Form Validation (General example for login/register) ---
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      let isValid = true
      const inputs = this.querySelectorAll("input[required]")
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.classList.add("error")
          // Add shake animation
          input.style.animation = "shake 0.5s"
          input.addEventListener("animationend", () => {
            input.style.animation = "" // Reset animation
          })
        } else {
          input.classList.remove("error")
        }
      })

      if (!isValid) {
        event.preventDefault() // Prevent form submission
        alert("Please fill in all required fields.") // Simple alert for demonstration
      }
    })

    // Remove error class on input
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.classList.contains("error") && input.value.trim()) {
          input.classList.remove("error")
        }
      })
    })
  })

  // --- Password Show/Hide (General example for login/register) ---
  const passwordToggleButtons = document.querySelectorAll(".password-toggle")
  passwordToggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling // Assumes input is sibling
      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        this.textContent = "Hide" // Or change icon
      } else {
        passwordInput.type = "password"
        this.textContent = "Show" // Or change icon
      }
    })
  })

  // --- Floating Labels (General example for login/register) ---
  const floatingInputs = document.querySelectorAll(".form-group.floating-label input")
  floatingInputs.forEach((input) => {
    // On load, check if input has value to keep label floated
    if (input.value) {
      input.closest(".form-group").classList.add("has-value")
    }

    input.addEventListener("focus", () => {
      input.closest(".form-group").classList.add("focused")
    })
    input.addEventListener("blur", () => {
      input.closest(".form-group").classList.remove("focused")
      if (input.value) {
        input.closest(".form-group").classList.add("has-value")
      } else {
        input.closest(".form-group").classList.remove("has-value")
      }
    })
  })
})

// Global page transition animation (simple fade-in)
window.addEventListener("load", () => {
  document.body.style.opacity = "1"
  document.body.style.transition = "opacity 0.5s ease-in-out"
})

// For navigation, you might want to add a fade-out before redirecting
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if ((href && href.startsWith("/")) || href.endsWith(".html")) {
      // Only internal links
      e.preventDefault()
      document.body.style.opacity = "0"
      setTimeout(() => {
        window.location.href = href
      }, 500) // Match fade-out duration
    }
  })
})
