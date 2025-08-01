// Authentication utility functions
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('token')
    this.user = JSON.parse(localStorage.getItem('user') || 'null')
    this.baseURL = window.location.origin
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token && !!this.user
  }

  // Get current user
  getCurrentUser() {
    return this.user
  }

  // Get auth token
  getToken() {
    return this.token
  }

  // Login user
  login(token, user) {
    this.token = token
    this.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  // Logout user
  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/index.html'
  }

  // Validate token with backend
  async validateToken() {
    if (!this.token) return false

    try {
      const response = await fetch(`${this.baseURL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        this.user = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
        return true
      } else {
        this.logout()
        return false
      }
    } catch (error) {
      console.error('Token validation error:', error)
      this.logout()
      return false
    }
  }

  // Make authenticated API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401) {
      this.logout()
      return null
    }

    return response
  }

  // Update navigation based on auth state
  updateNavigation() {
    const loginBtn = document.querySelector('a[href="login.html"]')
    const registerBtn = document.querySelector('a[href="register.html"]')
    const dashboardBtn = document.querySelector('a[href="dashboard.html"]')
    const profileBtn = document.querySelector('a[href="profile.html"]')
    const logoutBtn = document.querySelector('.logout-btn')

    if (this.isLoggedIn()) {
      // User is logged in
      if (loginBtn) {
        // Replace login button with logout button
        loginBtn.href = '#'
        loginBtn.textContent = 'Logout'
        loginBtn.classList.remove('btn-primary')
        loginBtn.classList.add('logout-btn')
        
        // Remove any existing event listeners by cloning
        const newLoginBtn = loginBtn.cloneNode(true)
        loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn)
        
        // Add logout event listener to the new button
        newLoginBtn.addEventListener('click', (e) => {
          e.preventDefault()
          this.logout()
        })
      }
      if (registerBtn) registerBtn.style.display = 'none'
      
      // Add profile link if it doesn't exist
      if (!profileBtn) {
        const navLinks = document.querySelector('.nav-links')
        if (navLinks) {
          const profileLi = document.createElement('li')
          profileLi.innerHTML = '<a href="profile.html">Profile</a>'
          navLinks.appendChild(profileLi)
        }
      }
    } else {
      // User is not logged in
      if (loginBtn) {
        // Restore login button
        loginBtn.href = 'login.html'
        loginBtn.textContent = 'Login'
        loginBtn.classList.remove('logout-btn')
        loginBtn.classList.add('btn-primary')
      }
      if (registerBtn) registerBtn.style.display = 'inline'
      if (profileBtn) profileBtn.parentElement.remove()
      
      // Redirect from protected pages
      const protectedPages = ['dashboard.html', 'profile.html', 'quiz.html', 'result.html']
      const currentPage = window.location.pathname.split('/').pop()
      
      if (protectedPages.includes(currentPage)) {
        window.location.href = '/login.html'
      }
    }
  }

  // Initialize auth state
  async init() {
    // Validate token on page load
    if (this.token) {
      const isValid = await this.validateToken()
      if (!isValid) {
        console.log('Token invalid, redirecting to login')
      }
    }

    // Update navigation
    this.updateNavigation()

    // Add logout functionality
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('logout-btn')) {
        e.preventDefault()
        this.logout()
      }
    })
  }

  // Force update navigation (useful after login/logout)
  forceUpdateNavigation() {
    this.updateNavigation()
  }
}

// Create global auth instance
const auth = new AuthManager()

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  auth.init()
})

// Export for use in other scripts
window.auth = auth 