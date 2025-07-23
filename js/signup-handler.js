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
            // Track validation error
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_validation_error', {
                    event_category: 'signup',
                    event_label: 'incomplete_form'
                })
            }
            return
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error')
            // Track email validation error
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_validation_error', {
                    event_category: 'signup',
                    event_label: 'invalid_email'
                })
            }
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
            
            // Track successful signup in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'sign_up', {
                    event_category: 'engagement',
                    event_label: 'early_access_signup',
                    custom_parameters: {
                        training_level: trainingLevel,
                        source: 'landing_page'
                    }
                })
                
                // Track as conversion
                gtag('event', 'conversion', {
                    send_to: 'G-J1FPHPCNWF/signup'
                })
            }
            
            // Reset form
            signupForm.reset()
            
            // Log for debugging
            console.log('Signup successful:', data)
            
        } catch (error) {
            console.error('🚨 Signup error details:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)
            console.error('Full error object:', JSON.stringify(error, null, 2))
            
            // Handle specific error cases
            if (error.code === '23505' || error.message?.includes('duplicate key value')) {
                // Duplicate email - PostgreSQL unique constraint violation
                showMessage('🎯 Good news! This email is already on our early access list. You\'re all set!', 'warning')
                
                // Track duplicate signup attempt
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'duplicate_signup_attempt', {
                        event_category: 'signup',
                        event_label: 'email_already_registered'
                    })
                }
            } else if (error.message?.includes('relation "fitness_signups" does not exist')) {
                showMessage('Database table not found. Please run the SQL schema in Supabase.', 'error')
            } else if (error.message?.includes('JWT') || error.message?.includes('Invalid API key')) {
                showMessage('Authentication error. Please check your Supabase configuration.', 'error')
            } else if (error.message?.includes('violates check constraint')) {
                showMessage('Please select a valid training level from the dropdown.', 'error')
            } else {
                showMessage(`Error: ${error.message || 'Something went wrong. Please try again.'}`, 'error')
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