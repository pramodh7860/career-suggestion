// Simple debug script to monitor authentication state without interfering with fetch
class SimpleAuthDebugger {
  constructor() {
    this.init()
  }

  init() {
    console.log('🔍 Simple Auth Debugger initialized')
    
    // Monitor auth state changes
    this.monitorAuthState()
    
    // Log current state
    this.logCurrentState()
    
    // Set up periodic state checking
    setInterval(() => {
      this.logCurrentState()
    }, 5000) // Check every 5 seconds
  }

  monitorAuthState() {
    if (window.auth) {
      const originalLogin = window.auth.login
      const originalLogout = window.auth.logout
      
      window.auth.login = function(...args) {
        console.log('🔐 Auth login called:', args)
        const result = originalLogin.apply(window.auth, args)
        console.log('🔐 Login completed, new state:', {
          isLoggedIn: window.auth.isLoggedIn(),
          user: window.auth.getCurrentUser()
        })
        return result
      }
      
      window.auth.logout = function(...args) {
        console.log('🚪 Auth logout called:', args)
        const result = originalLogout.apply(window.auth, args)
        console.log('🚪 Logout completed')
        return result
      }
    }
  }

  logCurrentState() {
    console.log('📊 Current Auth State:')
    console.log('  Token:', localStorage.getItem('token') ? 'Present' : 'Missing')
    console.log('  User:', localStorage.getItem('user') ? 'Present' : 'Missing')
    console.log('  Auth object:', window.auth ? 'Available' : 'Missing')
    if (window.auth) {
      console.log('  Auth.isLoggedIn():', window.auth.isLoggedIn())
      console.log('  Auth.user:', window.auth.getCurrentUser())
    }
  }
}

// Initialize debugger when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new SimpleAuthDebugger()
  }, 1000) // Wait for auth to initialize
})

// Also log state on page load
console.log('🔄 Page loaded, checking auth state...')
