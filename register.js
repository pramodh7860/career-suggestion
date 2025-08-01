document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm")
  
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault()
  
        let isValid = true
        const usernameInput = document.getElementById("username")
        const emailInput = document.getElementById("email")
        const passwordInput = document.getElementById("password")
        const confirmPasswordInput = document.getElementById("confirmPassword")
        const firstNameInput = document.getElementById("firstName")
        const lastNameInput = document.getElementById("lastName")
        const submitBtn = registerForm.querySelector('button[type="submit"]')
        const originalBtnText = submitBtn.textContent

        // Reset error states
        const inputs = [usernameInput, emailInput, passwordInput, confirmPasswordInput, firstNameInput, lastNameInput]
        inputs.forEach(input => input.classList.remove("error"))

        // Username validation
        if (!usernameInput.value.trim() || usernameInput.value.trim().length < 3) {
          isValid = false
          usernameInput.classList.add("error")
          showFieldError(usernameInput, "Username must be at least 3 characters")
        }

        // Email validation
        if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
          isValid = false
          emailInput.classList.add("error")
          showFieldError(emailInput, "Please enter a valid email address")
        }

        // Password validation
        if (!passwordInput.value.trim() || passwordInput.value.length < 6) {
          isValid = false
          passwordInput.classList.add("error")
          showFieldError(passwordInput, "Password must be at least 6 characters")
        }

        // Confirm password validation
        if (passwordInput.value !== confirmPasswordInput.value) {
          isValid = false
          confirmPasswordInput.classList.add("error")
          showFieldError(confirmPasswordInput, "Passwords do not match")
        }

        // Name validation
        if (!firstNameInput.value.trim()) {
          isValid = false
          firstNameInput.classList.add("error")
          showFieldError(firstNameInput, "First name is required")
        }

        if (!lastNameInput.value.trim()) {
          isValid = false
          lastNameInput.classList.add("error")
          showFieldError(lastNameInput, "Last name is required")
        }
  
        if (isValid) {
          // Show loading state
          submitBtn.textContent = "Creating Account..."
          submitBtn.disabled = true
          
          try {
            // Connect to backend API
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim()
              })
            })

            const data = await response.json()

            if (response.ok) {
              // Use auth manager to login
              auth.login(data.token, data.user)
              
              // Show success message
              showNotification('Account created successfully! Redirecting...', 'success')
              
              // Redirect to dashboard after successful registration
              setTimeout(() => {
                document.body.style.opacity = "0"
                setTimeout(() => {
                  window.location.href = "dashboard.html"
                }, 500)
              }, 1000)
            } else {
              // Show error message
              showNotification(data.message || 'Registration failed. Please try again.', 'error')
              submitBtn.textContent = originalBtnText
              submitBtn.disabled = false
            }
          } catch (error) {
            console.error('Registration error:', error)
            showNotification('Network error. Please try again.', 'error')
            submitBtn.textContent = originalBtnText
            submitBtn.disabled = false
          }
        }
      })
  
      // Remove error class on input change
      const inputs = registerForm.querySelectorAll("input")
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          if (input.classList.contains("error")) {
            input.classList.remove("error")
            // Remove error message
            const errorMsg = input.parentNode.querySelector('.field-error')
            if (errorMsg) {
              errorMsg.remove()
            }
          }
        })
      })
    }
  })

  // Function to show field-specific error messages
  function showFieldError(input, message) {
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.field-error')
    if (existingError) {
      existingError.remove()
    }
    
    // Create error message element
    const errorMsg = document.createElement('div')
    errorMsg.className = 'field-error'
    errorMsg.textContent = message
    errorMsg.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 4px;
      animation: fadeIn 0.3s ease-out;
    `
    
    input.parentNode.appendChild(errorMsg)
  }

  // Notification function
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification')
    existingNotifications.forEach(notification => notification.remove())
    
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `
    
    // Set background color based on type
    if (type === 'success') {
      notification.style.backgroundColor = '#10b981'
    } else if (type === 'error') {
      notification.style.backgroundColor = '#ef4444'
    } else {
      notification.style.backgroundColor = '#3b82f6'
    }
    
    document.body.appendChild(notification)
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }

  // Add CSS animations for notifications and field errors
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  document.head.appendChild(style) 