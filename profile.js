// Profile functionality
class ProfileManager {
  constructor() {
    this.user = null
    this.init()
  }

  async init() {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
      window.location.href = '/login.html'
      return
    }

    this.user = auth.getCurrentUser()
    this.loadUserProfile()
    this.setupEventListeners()
    this.setupTabs()
  }

  async loadUserProfile() {
    try {
      const response = await auth.apiRequest('/api/auth/profile')
      if (response && response.ok) {
        const data = await response.json()
        this.user = data.user
        this.populateProfileData()
        this.updateAvatar()
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      this.showNotification('Error loading profile data', 'error')
    }
  }

  populateProfileData() {
    // Update profile header
    const profileName = document.getElementById('profileName')
    const profileEmail = document.getElementById('profileEmail')
    const avatarInitials = document.getElementById('avatarInitials')

    if (profileName) {
      profileName.textContent = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim() || this.user.username || 'User'
    }

    if (profileEmail) {
      profileEmail.textContent = this.user.email || 'user@example.com'
    }

    if (avatarInitials) {
      const initials = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim()
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
      avatarInitials.textContent = initials || 'U'
    }

    // Update stats
    this.updateProfileStats()

    // Populate form fields
    this.populateFormFields()
  }

  updateProfileStats() {
    const memberSince = document.getElementById('memberSince')
    const quizCount = document.getElementById('quizCount')
    const careerCount = document.getElementById('careerCount')

    if (memberSince) {
      const created = new Date(this.user.createdAt)
      const now = new Date()
      const days = Math.floor((now - created) / (1000 * 60 * 60 * 24))
      memberSince.textContent = days
    }

    if (quizCount) {
      quizCount.textContent = this.user.quizResults?.length || 0
    }

    if (careerCount) {
      careerCount.textContent = this.user.savedCareers?.length || 0
    }
  }

  populateFormFields() {
    // Personal info form
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const username = document.getElementById('username')
    const email = document.getElementById('email')
    const bio = document.getElementById('bio')
    const interests = document.getElementById('interests')

    if (firstName) firstName.value = this.user.firstName || ''
    if (lastName) lastName.value = this.user.lastName || ''
    if (username) username.value = this.user.username || ''
    if (email) email.value = this.user.email || ''
    if (bio) bio.value = this.user.bio || ''
    if (interests) interests.value = this.user.interests?.join(', ') || ''

    // Load preferences
    this.loadPreferences()
  }

  async loadPreferences() {
    try {
      const response = await auth.apiRequest('/api/users/preferences')
      if (response && response.ok) {
        const preferences = await response.json()
        this.populatePreferences(preferences)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  populatePreferences(preferences) {
    // Quiz preferences
    const detailedResults = document.getElementById('detailedResults')
    const emailNotifications = document.getElementById('emailNotifications')
    const progressReminders = document.getElementById('progressReminders')

    if (detailedResults) detailedResults.checked = preferences.detailedResults || false
    if (emailNotifications) emailNotifications.checked = preferences.emailNotifications || false
    if (progressReminders) progressReminders.checked = preferences.progressReminders || false

    // Career preferences
    const preferredCategories = document.getElementById('preferredCategories')
    const experienceLevel = document.getElementById('experienceLevel')

    if (preferredCategories && preferences.preferredCategories) {
      Array.from(preferredCategories.options).forEach(option => {
        option.selected = preferences.preferredCategories.includes(option.value)
      })
    }

    if (experienceLevel) {
      experienceLevel.value = preferences.experienceLevel || 'student'
    }

    // Security preferences
    const twoFactorAuth = document.getElementById('twoFactorAuth')
    const profileVisibility = document.getElementById('profileVisibility')
    const dataAnalytics = document.getElementById('dataAnalytics')

    if (twoFactorAuth) twoFactorAuth.checked = preferences.twoFactorAuth || false
    if (profileVisibility) profileVisibility.checked = preferences.profileVisibility || false
    if (dataAnalytics) dataAnalytics.checked = preferences.dataAnalytics || false
  }

  updateAvatar() {
    const avatarPlaceholder = document.getElementById('avatarPlaceholder')
    if (avatarPlaceholder && this.user.profilePicture) {
      avatarPlaceholder.style.backgroundImage = `url(${this.user.profilePicture})`
      avatarPlaceholder.style.backgroundSize = 'cover'
      avatarPlaceholder.style.backgroundPosition = 'center'
    }
  }

  setupEventListeners() {
    // Personal info form
    const personalForm = document.getElementById('personalForm')
    if (personalForm) {
      personalForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.updatePersonalInfo()
      })
    }

    // Password form
    const passwordForm = document.getElementById('passwordForm')
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.changePassword()
      })
    }

    // Preference changes
    this.setupPreferenceListeners()
  }

  setupPreferenceListeners() {
    const preferenceInputs = document.querySelectorAll('input[type="checkbox"], select')
    preferenceInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.savePreferences()
      })
    })
  }

  async updatePersonalInfo() {
    const form = document.getElementById('personalForm')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    // Parse interests
    if (data.interests) {
      data.interests = data.interests.split(',').map(interest => interest.trim()).filter(Boolean)
    }

    try {
      const response = await auth.apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (response && response.ok) {
        const result = await response.json()
        this.user = result.user
        this.showNotification('Profile updated successfully!', 'success')
        this.populateProfileData()
      } else {
        const error = await response.json()
        this.showNotification(error.message || 'Failed to update profile', 'error')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      this.showNotification('Error updating profile', 'error')
    }
  }

  async changePassword() {
    const form = document.getElementById('passwordForm')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    if (data.newPassword !== data.confirmNewPassword) {
      this.showNotification('New passwords do not match', 'error')
      return
    }

    try {
      const response = await auth.apiRequest('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      })

      if (response && response.ok) {
        this.showNotification('Password changed successfully!', 'success')
        form.reset()
      } else {
        const error = await response.json()
        this.showNotification(error.message || 'Failed to change password', 'error')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      this.showNotification('Error changing password', 'error')
    }
  }

  async savePreferences() {
    const preferences = {
      detailedResults: document.getElementById('detailedResults')?.checked || false,
      emailNotifications: document.getElementById('emailNotifications')?.checked || false,
      progressReminders: document.getElementById('progressReminders')?.checked || false,
      preferredCategories: Array.from(document.getElementById('preferredCategories')?.selectedOptions || [])
        .map(option => option.value),
      experienceLevel: document.getElementById('experienceLevel')?.value || 'student',
      twoFactorAuth: document.getElementById('twoFactorAuth')?.checked || false,
      profileVisibility: document.getElementById('profileVisibility')?.checked || false,
      dataAnalytics: document.getElementById('dataAnalytics')?.checked || false
    }

    try {
      const response = await auth.apiRequest('/api/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
      })

      if (response && response.ok) {
        this.showNotification('Preferences saved!', 'success')
      } else {
        this.showNotification('Failed to save preferences', 'error')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      this.showNotification('Error saving preferences', 'error')
    }
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn')
    const tabContents = document.querySelectorAll('.tab-content')

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'))
        tabContents.forEach(content => content.classList.remove('active'))

        // Add active class to clicked button and corresponding content
        button.classList.add('active')
        document.getElementById(targetTab).classList.add('active')
      })
    })
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer')
    if (!container) return

    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    notification.style.cssText = `
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      margin-bottom: 10px;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `
    
    if (type === 'success') {
      notification.style.backgroundColor = '#10b981'
    } else if (type === 'error') {
      notification.style.backgroundColor = '#ef4444'
    } else {
      notification.style.backgroundColor = '#3b82f6'
    }
    
    container.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }
}

// Global functions
function uploadAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await auth.apiRequest('/api/auth/avatar', {
          method: 'POST',
          body: formData,
          headers: {} // Let browser set content-type for FormData
        })

        if (response && response.ok) {
          const result = await response.json()
          profile.user.profilePicture = result.avatarUrl
          profile.updateAvatar()
          profile.showNotification('Avatar updated successfully!', 'success')
        } else {
          profile.showNotification('Failed to upload avatar', 'error')
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
        profile.showNotification('Error uploading avatar', 'error')
      }
    }
  }
  input.click()
}

function exportUserData() {
  profile.showNotification('Exporting your data...', 'info')
  // In a real app, this would trigger a data export
  setTimeout(() => {
    profile.showNotification('Data export completed! Check your email.', 'success')
  }, 2000)
}

function deleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      profile.showNotification('Account deletion in progress...', 'info')
      // In a real app, this would delete the account
      setTimeout(() => {
        auth.logout()
      }, 2000)
    }
  }
}

// Initialize profile when DOM is loaded
let profile
document.addEventListener('DOMContentLoaded', () => {
  profile = new ProfileManager()
})

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