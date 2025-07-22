// Signup Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form')
    const submitButton = document.querySelector('.btn-submit')
    
    // Form submission handler
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        
        // Get form data
        const formData = new FormData(signupForm)
        const email = signupForm.querySelector('input[type="email"]').value.trim()
        const gymName = signupForm.querySelector('input[type="text"]').value.trim()
        const trainingLevel = signupForm.querySelector('select').value
        const termsAccepted = signupForm.querySelector('#terms').checked
        
        // Validate form
        if (!email || !gymName || !trainingLevel || !termsAccepted) {
            showMessage('Please fill in all fields and accept the terms.', 'error')
            return
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error')
            return
        }
        
        // Disable submit button and show loading state
        submitButton.disabled = true
        const originalText = submitButton.textContent
        submitButton.textContent = 'SECURING YOUR SPOT...'
        
        try {
            // Insert data into Supabase
            const { data, error } = await window.supabaseClient
                .from('fitness_signups')
                .insert([
                    {
                        email: email,
                        gym_name: gymName,
                        training_level: trainingLevel,
                        terms_accepted: termsAccepted,
                        signup_date: new Date().toISOString(),
                        source: 'landing_page'
                    }
                ])
            
            if (error) {
                throw error
            }
            
            // Success! Show success message
            showMessage('🔥 Welcome to the battle! You\'re now on the early access list.', 'success')
            
            // Reset form
            signupForm.reset()
            
            // Optional: Track successful signup (you can integrate with analytics later)
            console.log('Signup successful:', data)
            
        } catch (error) {
            console.error('Signup error:', error)
            
            // Handle specific error cases
            if (error.code === '23505') {
                // Duplicate email
                showMessage('This email is already registered! You\'re already on the list.', 'warning')
            } else {
                showMessage('Something went wrong. Please try again in a moment.', 'error')
            }
        } finally {
            // Re-enable submit button
            submitButton.disabled = false
            submitButton.textContent = originalText
        }
    })
})

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Helper function to show messages to users
function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.signup-message')
    if (existingMessage) {
        existingMessage.remove()
    }
    
    // Create message element
    const messageDiv = document.createElement('div')
    messageDiv.className = `signup-message signup-message-${type}`
    messageDiv.textContent = message
    
    // Insert message before the form
    const signupForm = document.querySelector('.signup-form')
    signupForm.parentNode.insertBefore(messageDiv, signupForm)
    
    // Auto-remove success/warning messages after 5 seconds
    if (type === 'success' || type === 'warning') {
        setTimeout(() => {
            messageDiv.remove()
        }, 5000)
    }
} 