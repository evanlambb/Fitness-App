// Supabase Edge Function for New Signup Email Notifications
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || 'darefitness14@gmail.com'

interface SignupData {
  email: string
  gym_name?: string | null
  training_level?: string | null
  signup_date: string
  source: string
}

serve(async (req) => {
  try {
    // Only handle POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Parse the webhook payload from Supabase
    const payload = await req.json()
    const signupData: SignupData = payload.record

    console.log('New signup received:', signupData)

    // Send email notification using Resend
    if (RESEND_API_KEY) {
      await sendEmailNotification(signupData)
    } else {
      console.log('No RESEND_API_KEY found, skipping email notification')
    }

    // You could also send notifications to Slack, Discord, etc. here
    // await sendSlackNotification(signupData)

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function sendEmailNotification(signupData: SignupData) {
  const emailBody = generateEmailHTML(signupData)
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Fitness App <notifications@yourdomain.com>',
      to: [NOTIFICATION_EMAIL],
      subject: `🔥 New Early Access Signup: ${signupData.email}`,
      html: emailBody,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`)
  }

  console.log('Email notification sent successfully')
}

function generateEmailHTML(signupData: SignupData): string {
  const signupDate = new Date(signupData.signup_date).toLocaleString()
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1a1a1a, #2a2a2a); border-radius: 20px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #ffd700, #ffed4e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .title { color: #00ff9d; font-size: 20px; font-weight: 700; margin: 20px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; }
        .info-label { color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .info-value { color: #ffffff; font-weight: 600; }
        .training-level { display: inline-block; background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 700; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DARE FITNESS</div>
          <div class="title">🔥 New Early Access Signup!</div>
        </div>
        
          <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${signupData.email}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Signup Date</div>
            <div class="info-value">${signupDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Source</div>
            <div class="info-value">${signupData.source}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This notification was automatically generated when someone signed up for early access.</p>
          <p>Source: ${signupData.source}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Optional: Add Slack notifications
async function sendSlackNotification(signupData: SignupData) {
  const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL')
  
  if (!SLACK_WEBHOOK_URL) {
    console.log('No Slack webhook URL configured')
    return
  }

  const message = {
    text: `🔥 New Early Access Signup!`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔥 New Early Access Signup!*\n\n*Email:* ${signupData.email}\n*Source:* ${signupData.source}`
        }
      }
    ]
  }

  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })

  console.log('Slack notification sent')
} 