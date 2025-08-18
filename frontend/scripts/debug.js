// Debug script to monitor authentication state
class AuthDebugger {
  constructor() {
    this.init()
  }

  init() {
    console.log('🔍 Auth Debugger initialized')
    
    // Monitor localStorage changes
    this.monitorLocalStorage()
    
    // Monitor network requests
    this.monitorNetworkRequests()
    
    // Monitor auth state changes
    this.monitorAuthState()
    
    // Log current state
    this.logCurrentState()
  }

  monitorLocalStorage() {
    const originalSetItem = localStorage.setItem
    const originalRemoveItem = localStorage.removeItem
    
    localStorage.setItem = function(key, value) {
      console.log('📝 localStorage.setItem:', key, value)
      originalSetItem.call(localStorage, key, value)
    }
    
    localStorage.removeItem = function(key) {
      console.log('🗑️ localStorage.removeItem:', key)
      originalRemoveItem.call(localStorage, key)
    }
  }

  monitorNetworkRequests() {
    const originalFetch = window.fetch
    
    window.fetch = function(...args) {
      const url = args[0]
      const options = args[1] || {}
      
      console.log('🌐 Fetch request:', url, options)
      
      return originalFetch.apply(window, args).then(response => {
        console.log('✅ Fetch response:', url, response.status)
        return response
      }).catch(error => {
        console.error('❌ Fetch error:', url, error)
        throw error
      })
    }
  }

  monitorAuthState() {
    if (window.auth) {
      const originalLogin = window.auth.login
      const originalLogout = window.auth.logout
      
      window.auth.login = function(...args) {
        console.log('🔐 Auth login called:', args)
        return originalLogin.apply(window.auth, args)
      }
      
      window.auth.logout = function(...args) {
        console.log('🚪 Auth logout called:', args)
        return originalLogout.apply(window.auth, args)
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
  new AuthDebugger()
})

// Also log state on page load
console.log('🔄 Page loaded, checking auth state...')
