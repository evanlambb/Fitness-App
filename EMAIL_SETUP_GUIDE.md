# Email Notification Setup Guide 📧

Choose the method that best fits your technical comfort level and requirements.

---

## 🚀 **Option 1: Zapier (Easiest - No Code Required)**

**Best for:** Non-technical users, quick setup, reliable delivery

### Step-by-Step Setup:

1. **Create Zapier Account**
   - Go to [zapier.com](https://zapier.com)
   - Sign up for free account (100 tasks/month)

2. **Set Up Supabase Webhook**
   - Go to your Supabase Dashboard
   - Navigate to **Database → Webhooks**
   - Click **"Create a new webhook"**
   - Configure:
     - **Name:** `New Signup Notification`
     - **Table:** `fitness_signups`
     - **Events:** `INSERT` ✅ (uncheck UPDATE, DELETE)
     - **Type:** `HTTP Request`
     - **HTTP URL:** (Get this from step 3)

3. **Create Zapier Webhook**
   - In Zapier, click **"Create Zap"**
   - **Trigger:** Search for "Webhooks by Zapier"
   - **Event:** "Catch Hook"
   - **Copy the webhook URL** Zapier provides
   - **Go back to Supabase** and paste this URL

4. **Set Up Email Action**
   - **Action:** Choose your email service:
     - "Email by Zapier" (simplest)
     - "Gmail" (if you use Gmail)
     - "Outlook" (if you use Outlook)
   - **Configure email template:**
     - **To:** darefitness14@gmail.com
     - **Subject:** 🔥 New Early Access Signup: {{gym_name}}
     - **Body:** See template below

5. **Test the Integration**
   - Submit a test signup on your website
   - Check that email arrives within 1-2 minutes

### Zapier Email Template:
```
🔥 New Early Access Signup!

Gym Name: {{gym_name}}
Email: {{email}}
Training Level: {{training_level}}
Signup Date: {{signup_date}}
Source: {{source}}

This is an automated notification from your Fitness App signup form.
```

**Cost:** Free for up to 100 signups/month

---

## 🔧 **Option 2: EmailJS (Frontend Solution)**

**Best for:** Developers who want frontend control, quick setup

### Step-by-Step Setup:

1. **Create EmailJS Account**
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Sign up for free account (200 emails/month)

2. **Set Up Email Service**
   - In EmailJS dashboard, go to **"Email Services"**
   - Click **"Add New Service"**
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the connection steps

3. **Create Email Template**
   - Go to **"Email Templates"**
   - Click **"Create New Template"**
   - Use this template:

```html
Subject: 🔥 New Early Access Signup: {{user_name}}

<h2>🔥 New Early Access Signup!</h2>

<p><strong>Gym Name:</strong> {{user_name}}</p>
<p><strong>Email:</strong> {{user_email}}</p>
<p><strong>Training Level:</strong> {{training_level}}</p>
<p><strong>Signup Date:</strong> {{signup_date}} at {{signup_time}}</p>
<p><strong>Source:</strong> {{source}}</p>

<hr>
<p><small>This is an automated notification from your Fitness App.</small></p>
```

4. **Get Your Credentials**
   - **Service ID:** From Email Services page
   - **Template ID:** From Email Templates page  
   - **Public Key:** From Integration → API Keys

5. **Update Your Website**
   - Add EmailJS script to your HTML
   - Update credentials in `js/email-notifications.js`
   - Integrate with signup handler

### Integration Code:

Add to your `index.html` before closing `</body>`:
```html
<!-- EmailJS -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script src="js/email-notifications.js"></script>
```

Update `js/email-notifications.js` with your credentials:
```javascript
const EMAILJS_SERVICE_ID = 'your_service_id_here'
const EMAILJS_TEMPLATE_ID = 'your_template_id_here'
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'
```

Add to your signup success handler in `js/signup-handler.js`:
```javascript
// After successful signup
if (typeof sendSignupNotification === 'function') {
    sendSignupNotification({
        gymName: gymName,
        email: email,
        trainingLevel: trainingLevel
    })
}
```

**Cost:** Free for up to 200 emails/month

---

## 💪 **Option 3: Supabase Edge Functions (Advanced)**

**Best for:** Developers who want full control, custom logic, multiple notification channels

### Prerequisites:
- Node.js installed
- Supabase CLI
- Email service account (Resend, SendGrid, etc.)

### Setup Process:

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Initialize Supabase Project**
```bash
cd your-fitness-app
supabase init
```

3. **Deploy the Edge Function**
```bash
supabase functions deploy notify-new-signup
```

4. **Set Environment Variables**
```bash
# Choose an email service and get API key
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set NOTIFICATION_EMAIL=darefitness14@gmail.com
```

5. **Create Database Webhook**
   - In Supabase Dashboard: **Database → Webhooks**
   - **HTTP URL:** `https://your-project.supabase.co/functions/v1/notify-new-signup`
   - **Events:** INSERT only
   - **Headers:** 
     - `Authorization: Bearer YOUR_ANON_KEY`
     - `Content-Type: application/json`

### Email Service Options:

**Resend (Recommended):**
- Sign up: [resend.com](https://resend.com)
- 100 emails/month free
- $20/month for 50k emails
- Great deliverability

**SendGrid:**
- Sign up: [sendgrid.com](https://sendgrid.com)
- 100 emails/day free
- Easy integration

**Mailgun:**
- Sign up: [mailgun.com](https://mailgun.com)
- 5,000 emails/month free for 3 months

---

## 📊 **Feature Comparison**

| Feature | Zapier | EmailJS | Edge Functions |
|---------|--------|---------|----------------|
| Setup Difficulty | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Advanced |
| Monthly Cost | Free (100 emails) | Free (200 emails) | Free (500k requests) |
| Customization | Limited | Medium | Full Control |
| Reliability | ⭐⭐⭐ High | ⭐⭐ Medium | ⭐⭐⭐ High |
| Additional Features | Many integrations | Frontend only | Unlimited |

---

## 🎯 **Recommendation**

**Start with Zapier** if you want something working in 10 minutes.

**Upgrade to Edge Functions** later if you want:
- Custom email designs
- Multiple notification channels (Slack, Discord, SMS)
- Advanced logic (different emails for different training levels)
- Better security and reliability

---

## 🧪 **Testing Your Setup**

1. **Submit a test signup** on your website
2. **Check your email** within 1-2 minutes
3. **Verify the data** looks correct
4. **Test duplicate email** (should still notify)

---

## 🚨 **Troubleshooting**

### Zapier Not Working:
- Check webhook URL is correctly copied
- Verify Supabase webhook events include "INSERT"
- Test with Zapier's webhook tester

### EmailJS Not Working:
- Check browser console for errors
- Verify API keys are correct
- Test with EmailJS dashboard test feature

### Edge Functions Not Working:
- Check Supabase function logs
- Verify environment variables are set
- Test webhook manually with curl

---

## 📈 **Next Steps**

Once notifications are working:
1. **Set up daily/weekly summary emails** with signup statistics
2. **Add Slack notifications** for team awareness
3. **Create welcome email sequence** for new signups
4. **Track email open rates** and engagement

Choose the option that fits your comfort level and let me know if you need help with any specific setup! 