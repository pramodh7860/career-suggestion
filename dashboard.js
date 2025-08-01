// Dashboard functionality
class DashboardManager {
  constructor() {
    this.user = null
    this.quizResults = []
    this.savedCareers = []
    this.recommendations = []
    this.init()
  }

  async init() {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
      window.location.href = '/login.html'
      return
    }

    this.user = auth.getCurrentUser()
    this.updateUserInfo()
    await this.loadDashboardData()
    this.setupEventListeners()
  }

  updateUserInfo() {
    const userNameElement = document.getElementById('userName')
    if (userNameElement && this.user) {
      userNameElement.textContent = this.user.firstName || this.user.username || 'User'
    }
  }

  async loadDashboardData() {
    try {
      // Load all data in parallel
      const [quizResults, savedCareers, recommendations, stats] = await Promise.all([
        this.loadQuizResults(),
        this.loadSavedCareers(),
        this.loadRecommendations(),
        this.loadUserStats()
      ])

      this.quizResults = quizResults
      this.savedCareers = savedCareers
      this.recommendations = recommendations

      this.updateStats(stats)
      this.renderRecentResults()
      this.renderRecommendations()
      this.renderSavedCareers()
      this.setupProgressChart()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      this.showNotification('Error loading dashboard data', 'error')
    }
  }

  async loadQuizResults() {
    try {
      const response = await auth.apiRequest('/api/quiz/history')
      if (response && response.ok) {
        const data = await response.json()
        return data.results || []
      }
    } catch (error) {
      console.error('Error loading quiz results:', error)
    }
    return []
  }

  async loadSavedCareers() {
    try {
      const response = await auth.apiRequest('/api/careers/saved')
      if (response && response.ok) {
        const data = await response.json()
        return data.careers || []
      }
    } catch (error) {
      console.error('Error loading saved careers:', error)
    }
    return []
  }

  async loadRecommendations() {
    try {
      const response = await auth.apiRequest('/api/users/recommendations')
      if (response && response.ok) {
        const data = await response.json()
        return data.recommendations || []
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
    return []
  }

  async loadUserStats() {
    try {
      const response = await auth.apiRequest('/api/users/progress')
      if (response && response.ok) {
        const data = await response.json()
        return data.stats || {}
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
    return {}
  }

  updateStats(stats) {
    document.getElementById('quizCount').textContent = stats.quizCount || 0
    document.getElementById('savedCareers').textContent = stats.savedCareers || 0
    document.getElementById('avgScore').textContent = `${stats.avgScore || 0}%`
    document.getElementById('progressDays').textContent = stats.activeDays || 0
  }

  renderRecentResults() {
    const container = document.getElementById('recentResults')
    if (!container) return

    if (this.quizResults.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <p>No quiz results yet</p>
          <button class="btn btn-primary" onclick="location.href='quiz.html'">Take Your First Quiz</button>
        </div>
      `
      return
    }

    const recentResults = this.quizResults.slice(0, 5)
    container.innerHTML = recentResults.map(result => `
      <div class="result-item" onclick="viewQuizResult('${result._id}')">
        <div class="result-info">
          <h4>${result.quizType || 'Career Quiz'}</h4>
          <p>${new Date(result.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="result-score">${result.averageScore || 0}%</div>
      </div>
    `).join('')
  }

  renderRecommendations() {
    const container = document.getElementById('topRecommendations')
    if (!container) return

    if (this.recommendations.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⭐</div>
          <p>No recommendations yet</p>
          <button class="btn btn-primary" onclick="location.href='quiz.html'">Take Quiz for Recommendations</button>
        </div>
      `
      return
    }

    const topRecommendations = this.recommendations.slice(0, 5)
    container.innerHTML = topRecommendations.map(career => `
      <div class="recommendation-item" onclick="viewCareer('${career._id}')">
        <div class="recommendation-icon">💼</div>
        <div class="recommendation-content">
          <h4>${career.title}</h4>
          <p>${career.shortDescription}</p>
        </div>
      </div>
    `).join('')
  }

  renderSavedCareers() {
    const container = document.getElementById('savedCareersList')
    if (!container) return

    if (this.savedCareers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❤️</div>
          <p>No saved careers yet</p>
          <button class="btn btn-primary" onclick="location.href='explorer.html'">Explore Careers</button>
        </div>
      `
      return
    }

    container.innerHTML = this.savedCareers.map(career => `
      <div class="saved-career-item" onclick="viewCareer('${career._id}')">
        <div class="saved-career-icon">💼</div>
        <h4>${career.title}</h4>
        <p>${career.category}</p>
      </div>
    `).join('')
  }

  setupProgressChart() {
    const canvas = document.getElementById('progressChart')
    if (!canvas) return

    // Mock data for now - in real app, this would come from backend
    const ctx = canvas.getContext('2d')
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Quiz Score',
        data: [65, 72, 68, 85, 78, 82, 90],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    }

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    })
  }

  setupEventListeners() {
    // Chart period controls
    const chartControls = document.querySelectorAll('.chart-controls .btn-text')
    chartControls.forEach(btn => {
      btn.addEventListener('click', (e) => {
        chartControls.forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
        this.updateChartPeriod(e.target.dataset.period)
      })
    })
  }

  updateChartPeriod(period) {
    // In a real app, this would fetch new data based on the period
    console.log('Updating chart for period:', period)
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

// Global functions for dashboard actions
function viewAllResults() {
  // In a real app, this would navigate to a detailed results page
  window.location.href = '/quiz-results.html'
}

function refreshRecommendations() {
  dashboard.loadRecommendations().then(() => {
    dashboard.renderRecommendations()
    dashboard.showNotification('Recommendations updated!', 'success')
  })
}

function viewQuizResult(resultId) {
  // In a real app, this would show detailed quiz result
  console.log('Viewing quiz result:', resultId)
}

function viewCareer(careerId) {
  // In a real app, this would navigate to career details
  window.location.href = `/explorer.html?career=${careerId}`
}

function updateLearningPath() {
  dashboard.showNotification('Learning path updated!', 'success')
}

function exportData() {
  // In a real app, this would export user data
  dashboard.showNotification('Data export started!', 'success')
}

function shareProgress() {
  // In a real app, this would share progress on social media
  if (navigator.share) {
    navigator.share({
      title: 'My Career Progress',
      text: 'Check out my career journey on Career Compass!',
      url: window.location.href
    })
  } else {
    dashboard.showNotification('Sharing not supported on this browser', 'error')
  }
}

// Initialize dashboard when DOM is loaded
let dashboard
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new DashboardManager()
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
