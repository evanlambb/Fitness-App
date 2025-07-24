# New Signup Email Notification Function

This Supabase Edge Function sends email notifications when new users sign up for early access.

## Setup Instructions

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Initialize Supabase (if not already done)
```bash
supabase init
```

### 3. Deploy the Function
```bash
supabase functions deploy notify-new-signup
```

### 4. Set Environment Variables
```bash
# Set your Resend API key (or other email service)
supabase secrets set RESEND_API_KEY=your_resend_api_key_here

# Set notification email address
supabase secrets set NOTIFICATION_EMAIL=darefitness14@gmail.com

# Optional: Slack webhook for additional notifications
supabase secrets set SLACK_WEBHOOK_URL=your_slack_webhook_url_here
```

### 5. Create Database Webhook
In your Supabase Dashboard:
1. Go to Database → Webhooks
2. Create new webhook:
   - **Name:** `New Signup Notification`
   - **Table:** `fitness_signups`
   - **Events:** `INSERT`
   - **Type:** `HTTP Request`
   - **HTTP URL:** `https://your-project.supabase.co/functions/v1/notify-new-signup`
   - **HTTP Headers:** 
     - `Authorization: Bearer YOUR_ANON_KEY`
     - `Content-Type: application/json`

## Email Services Options

### Option A: Resend (Recommended)
- Sign up at [resend.com](https://resend.com)
- Get API key from dashboard
- 100 emails/month free, $20/month for 50k emails

### Option B: SendGrid
- Replace Resend API calls with SendGrid
- 100 emails/day free

### Option C: Mailgun
- Replace with Mailgun API calls
- 5,000 emails/month free for 3 months

## Testing
```bash
# Test the function locally
supabase functions serve notify-new-signup

# Send test request
curl -X POST http://localhost:54321/functions/v1/notify-new-signup \
  -H "Content-Type: application/json" \
  -d '{
    "record": {
      "email": "test@example.com",
      "gym_name": "Test User",
      "training_level": "intermediate",
      "signup_date": "2025-01-01T12:00:00Z",
      "source": "landing_page"
    }
  }'
```

## What You'll Receive

When someone signs up, you'll get a beautifully formatted email with:
- 🔥 New signup notification
- User's gym name and email
- Training level badge
- Signup timestamp
- Source information
- Professional HTML design matching your app's theme 