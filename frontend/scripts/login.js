document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm")
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault() // Prevent default form submission
  
        let isValid = true
        const emailInput = document.getElementById("email")
        const passwordInput = document.getElementById("password")
        const submitBtn = loginForm.querySelector('button[type="submit"]')
        const originalBtnText = submitBtn.textContent

        // Basic email validation
        if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
          isValid = false
          emailInput.classList.add("error")
          emailInput.style.animation = "shake 0.5s"
          emailInput.addEventListener(
            "animationend",
            () => {
              emailInput.style.animation = ""
            },
            { once: true },
          )
        } else {
          emailInput.classList.remove("error")
        }
  
        // Basic password validation
        if (!passwordInput.value.trim()) {
          isValid = false
          passwordInput.classList.add("error")
          passwordInput.style.animation = "shake 0.5s"
          passwordInput.addEventListener(
            "animationend",
            () => {
              passwordInput.style.animation = ""
            },
            { once: true },
          )
        } else {
          passwordInput.classList.remove("error")
        }
  
        if (isValid) {
          // Show loading state
          submitBtn.textContent = "Logging in..."
          submitBtn.disabled = true
          
          try {
            // Connect to backend API
            const response = await fetch('http://localhost:3001/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value
              })
            })

            console.log('Login response status:', response.status)
            const data = await response.json()
            console.log('Login response data:', data)

            if (response.ok) {
              // Extract token and user data from response
              const { token, ...userData } = data.data
              
              // Use auth manager to login (check if auth is available)
              if (window.auth) {
                console.log('Using auth manager for login')
                window.auth.login(token, userData)
                
                // Update navigation immediately
                window.auth.forceUpdateNavigation()
              } else {
                console.log('Auth manager not available, using localStorage fallback')
                // Fallback: store in localStorage directly
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(userData))
              }
              
              console.log('Login successful, user data:', userData)
              
              // Show success message
              showNotification('Login successful! Redirecting...', 'success')
              
              // Redirect to dashboard after successful login
              setTimeout(() => {
                document.body.style.opacity = "0"
                setTimeout(() => {
                  window.location.href = "dashboard.html"
                }, 500)
              }, 1000)
            } else {
              // Show error message
              showNotification(data.message || 'Login failed. Please check your credentials.', 'error')
              submitBtn.textContent = originalBtnText
              submitBtn.disabled = false
            }
          } catch (error) {
            console.error('Login error:', error)
            showNotification('Network error. Please try again.', 'error')
            submitBtn.textContent = originalBtnText
            submitBtn.disabled = false
          }
        } else {
          console.log("Login failed: Please check your credentials.")
        }
      })
  
      // Remove error class on input change
      const inputs = loginForm.querySelectorAll("input")
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          if (input.classList.contains("error")) {
            input.classList.remove("error")
          }
        })
      })
    }
  })

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

  // Add CSS animations for notifications
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
  `
  document.head.appendChild(style)
  