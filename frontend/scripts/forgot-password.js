// Forgot Password Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
    }
    
    // Add email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearFieldError);
    }
});

// Handle forgot password form submission
async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    // Validate email
    if (!validateEmail({ target: document.getElementById('email') })) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual endpoint)
        await simulatePasswordReset(email);
        
        // Show success state
        showSuccessState();
        
        // Show success message
        showNotification('Password reset link sent! Check your email.', 'success');
        
    } catch (error) {
        console.error('Error sending reset link:', error);
        showNotification('Failed to send reset link. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

// Validate email field
function validateEmail(e) {
    const emailInput = e.target;
    const email = emailInput.value.trim();
    
    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(emailInput, 'Email address is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(emailInput);
    return true;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--error-color);
        font-size: 0.85rem;
        margin-top: 0.25rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Simulate password reset API call
function simulatePasswordReset(email) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true, message: 'Reset link sent successfully' });
            } else {
                reject(new Error('Email not found or service temporarily unavailable'));
            }
        }, 2000);
    });
}

// Show success state
function showSuccessState() {
    const card = document.querySelector('.forgot-password-card');
    const header = card.querySelector('.forgot-password-header');
    const form = card.querySelector('.forgot-password-form');
    
    // Add success class
    card.classList.add('success');
    
    // Update header content
    header.innerHTML = `
        <div class="lock-icon">✅</div>
        <h1>Check Your Email</h1>
        <p>We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.</p>
    `;
    
    // Hide the form
    form.style.display = 'none';
    
    // Update footer
    const footer = card.querySelector('.forgot-password-footer');
    footer.innerHTML = `
        <p>Didn't receive the email? <a href="#" onclick="resendResetLink()">Resend</a></p>
        <p>Back to <a href="login.html">Login</a></p>
    `;
}

// Resend reset link function
function resendResetLink() {
    const email = document.getElementById('email').value;
    if (email) {
        handleForgotPasswordSubmit({ 
            preventDefault: () => {},
            target: document.getElementById('forgotPasswordForm')
        });
    } else {
        showNotification('Please enter your email address first.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
            break;
        case 'error':
            notification.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
            break;
        default:
            notification.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS animations for notifications and field errors
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .forgot-password-form input.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
    }
    
    .field-error {
        color: var(--error-color);
        font-size: 0.85rem;
        margin-top: 0.25rem;
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(style); 