// Google Analytics Event Tracking
// This file handles all custom event tracking for the fitness app

document.addEventListener('DOMContentLoaded', function() {
    
    // Track privacy policy clicks
    const privacyLinks = document.querySelectorAll('a[href="privacy-policy.html"], a[href*="privacy"]')
    privacyLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'privacy_policy_click', {
                    event_category: 'legal',
                    event_label: 'privacy_policy_view'
                })
            }
        })
    })
    
    // Track app store badge clicks
    const appStoreBadges = document.querySelectorAll('.app-store-badge')
    appStoreBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const isIOS = badge.classList.contains('ios-badge')
            const platform = isIOS ? 'ios' : 'android'
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'app_store_click', {
                    event_category: 'engagement',
                    event_label: `${platform}_store_badge`,
                    custom_parameters: {
                        platform: platform,
                        badge_location: 'signup_form'
                    }
                })
            }
        })
    })
    
    // Track challenge demo interactions
    const challengeButtons = document.querySelectorAll('.btn-accept, .btn-decline')
    challengeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = button.classList.contains('btn-accept') ? 'accept' : 'decline'
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'challenge_demo_interaction', {
                    event_category: 'engagement',
                    event_label: `demo_${action}_click`,
                    custom_parameters: {
                        action: action,
                        demo_type: 'bench_press_challenge'
                    }
                })
            }
        })
    })
    
    // Track form field interactions (to see where people drop off)
    const formInputs = document.querySelectorAll('.form-input, .form-select')
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            const fieldName = input.id || input.name || 'unknown'
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_field_focus', {
                    event_category: 'form_interaction',
                    event_label: `${fieldName}_focus`,
                    custom_parameters: {
                        field_name: fieldName
                    }
                })
            }
        })
        
        input.addEventListener('blur', function() {
            const fieldName = input.id || input.name || 'unknown'
            const hasValue = input.value.trim() !== ''
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_field_complete', {
                    event_category: 'form_interaction',
                    event_label: `${fieldName}_${hasValue ? 'completed' : 'abandoned'}`,
                    custom_parameters: {
                        field_name: fieldName,
                        completed: hasValue
                    }
                })
            }
        })
    })
    
    // Track scroll depth (to see how engaged users are)
    let maxScrollPercentage = 0
    let scrollTimer = null
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercentage = Math.round((scrollTop / documentHeight) * 100)
            
            // Track significant scroll milestones
            if (scrollPercentage > maxScrollPercentage && scrollPercentage >= 25) {
                const milestone = Math.floor(scrollPercentage / 25) * 25
                
                if (milestone > maxScrollPercentage && typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        event_category: 'engagement',
                        event_label: `${milestone}_percent`,
                        custom_parameters: {
                            scroll_percentage: milestone
                        }
                    })
                    maxScrollPercentage = milestone
                }
            }
        }, 500) // Debounce scroll events
    })
    
    // Track time on page (for engagement metrics)
    let startTime = Date.now()
    let timeTracked = false
    
    // Track when user has been on page for 30 seconds (engaged visitor)
    setTimeout(function() {
        if (!timeTracked && typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                event_category: 'engagement',
                event_label: '30_seconds',
                custom_parameters: {
                    engagement_time: 30
                }
            })
            timeTracked = true
        }
    }, 30000)
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // User switched tabs or minimized - track time spent
            const timeSpent = Math.round((Date.now() - startTime) / 1000)
            
            if (timeSpent >= 10 && typeof gtag !== 'undefined') {
                gtag('event', 'page_engagement', {
                    event_category: 'engagement',
                    event_label: 'session_end',
                    custom_parameters: {
                        time_spent_seconds: timeSpent
                    }
                })
            }
        } else {
            // User returned to tab
            startTime = Date.now()
        }
    })
})

// Helper function to track custom events from anywhere
window.trackEvent = function(eventName, category, label, customParams) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category || 'custom',
            event_label: label || '',
            custom_parameters: customParams || {}
        })
    }
    console.log(`Analytics Event: ${eventName}`, { category, label, customParams })
} 