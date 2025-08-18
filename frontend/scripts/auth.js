// Authentication utility functions
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    // More robust JSON parsing with error handling
    try {
      this.user = userData ? JSON.parse(userData) : null
      
      // Validate user data structure
      if (this.user && (!this.user._id || !this.user.email)) {
        console.log('Invalid user data structure, clearing')
        localStorage.removeItem('user')
        this.user = null
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
      // Clear invalid data
      localStorage.removeItem('user')
      this.user = null
    }
    
    // Clear token if no user data
    if (this.token && !this.user) {
      console.log('Token exists but no user data, clearing token')
      localStorage.removeItem('token')
      this.token = null
    }
    
    // Use relative URLs instead of absolute to avoid baseURL issues
    this.baseURL = ''
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token && !!this.user && !!this.user._id
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
    console.log('Login called with token:', token ? 'present' : 'missing', 'user:', user)
    this.token = token
    this.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    console.log('Login completed, isLoggedIn:', this.isLoggedIn())
  }

  // Logout user
  logout() {
    console.log('Logout called')
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
      const response = await fetch(`http://localhost:3001/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data._id) {
          this.user = data.data
          localStorage.setItem('user', JSON.stringify(data.data))
          console.log('User data restored from token validation')
          return true
        } else {
          console.log('Token valid but no user data received')
          this.logout()
          return false
        }
      } else {
        console.log('Token validation failed:', response.status)
        this.logout()
        return false
      }
    } catch (error) {
      console.error('Token validation error:', error)
      // Don't logout on network errors, just return false
      return false
    }
  }

  // Make authenticated API requests
  async apiRequest(endpoint, options = {}) {
    const url = `http://localhost:3001${endpoint}`
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
    console.log('Updating navigation, isLoggedIn:', this.isLoggedIn())
    
    // Try multiple selectors to find the login button
    let loginBtn = document.querySelector('a[href="login.html"]')
    if (!loginBtn) {
      loginBtn = document.querySelector('a[href*="login"]')
    }
    if (!loginBtn) {
      loginBtn = document.querySelector('.btn-primary')
    }
    
    const registerBtn = document.querySelector('a[href="register.html"]')
    const dashboardBtn = document.querySelector('a[href="dashboard.html"]')
    const profileBtn = document.querySelector('a[href="profile.html"]')
    const logoutBtn = document.querySelector('.logout-btn')

    console.log('Found elements:', { loginBtn, registerBtn, dashboardBtn, profileBtn, logoutBtn })

    if (this.isLoggedIn()) {
      console.log('User is logged in, updating navigation...')
      // User is logged in
      if (loginBtn) {
        console.log('Updating login button to logout...')
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
          const profileLink = document.createElement('a')
          profileLink.href = 'profile.html'
          profileLink.textContent = 'Profile'
          profileLink.classList.add('nav-link')
          profileLi.appendChild(profileLink)
          navLinks.appendChild(profileLi)
        }
      }
    } else {
      console.log('User is not logged in, updating navigation...')
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
    console.log('Auth init called, token:', this.token, 'user:', this.user)
    
    // Only validate token if we have both token and user data
    if (this.token && this.user) {
      try {
        const isValid = await this.validateToken()
        if (!isValid) {
          console.log('Token invalid, clearing auth data')
          this.logout()
          return
        } else {
          console.log('Token valid, user authenticated')
        }
      } catch (error) {
        console.error('Error during token validation:', error)
        // Don't logout on network errors, just continue
      }
    }

    // Update navigation immediately
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
let auth

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  auth = new AuthManager()
  auth.init()
  window.auth = auth
})

// Export for use in other scripts
window.auth = auth 