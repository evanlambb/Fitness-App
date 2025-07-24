// Email Notifications using EmailJS
// This sends emails directly from the frontend when users sign up

// EmailJS Configuration
// Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID' 
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'

// Initialize EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY)
        console.log('📧 EmailJS initialized successfully')
        return true
    } else {
        console.log('📧 EmailJS not configured or library not loaded')
        return false
    }
}

// Send notification email when someone signs up
async function sendSignupNotification(signupData) {
    if (!initEmailJS()) {
        console.log('EmailJS not available, skipping email notification')
        return false
    }

    try {
        const templateParams = {
            to_email: 'darefitness14@gmail.com', // Your notification email
            from_name: 'Fitness App Notifications',
            user_name: signupData.gymName,
            user_email: signupData.email,
            training_level: signupData.trainingLevel,
            signup_date: new Date().toLocaleDateString(),
            signup_time: new Date().toLocaleTimeString(),
            source: 'Landing Page'
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        )

        console.log('📧 Signup notification email sent successfully:', response)
        return true

    } catch (error) {
        console.error('📧 Failed to send signup notification:', error)
        return false
    }
}

// Export for use in signup handler
window.sendSignupNotification = sendSignupNotification 