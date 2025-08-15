# New Signup Email Notification Function

This Supabase Edge Function sends email notifications when new users sign up for early access. It currently emails the signup's email address, signup timestamp, and source.

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

# Set notification email address (fallback defaults to darefitness14@gmail.com if not set)
supabase secrets set NOTIFICATION_EMAIL=your_notification_email@yourdomain.com

# Optional: Slack webhook for additional notifications
supabase secrets set SLACK_WEBHOOK_URL=your_slack_webhook_url_here
```

Note: The function sends with `from: "Fitness App <notifications@yourdomain.com>"`. Ensure this domain/address is verified in your email provider (e.g., Resend) or update it in `index.ts`.

### 5. Create Database Webhook
In your Supabase Dashboard:
1. Go to Database → Webhooks
2. Create new webhook:
   - **Name:** `New Signup Notification`
   - **Table:** `fitness_signups`
   - **Events:** `INSERT`
   - **Type:** `HTTP Request`
   - **HTTP URL:** `https://your-project.supabase.co/functions/v1/notify-new-signup`
   - **HTTP Headers:** None required by the current function

Security note: The current implementation does not validate headers. If you want to restrict access, add a shared secret header in the webhook and verify it in `index.ts` before processing the request.

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
      "signup_date": "2025-01-01T12:00:00Z",
      "source": "landing_page"
    }
  }'
```

## What You'll Receive

When someone signs up, you'll get a formatted email with:
- 🔥 New signup notification
- **Email** of the signer
- **Signup timestamp**
- **Source** (e.g., `landing_page`)
- Professional HTML design matching your app's theme

Customization: You can adjust the email content and styling in `generateEmailHTML` within `index.ts`. Slack notifications are available via `sendSlackNotification` (currently not called by default).