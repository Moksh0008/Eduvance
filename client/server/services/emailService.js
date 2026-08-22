/* ═══════════════════════════════════════════════════
   EMAIL SERVICE — Send OTP and notification emails
   Falls back to console.log if no email provider configured
   ═══════════════════════════════════════════════════ */

/**
 * Generate a 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send an email (or log to console if no provider configured)
 */
export async function sendEmail({ to, subject, html, text }) {
  // If using a real email provider, configure here
  // For now, log to console for development
  console.log(`\n📧 Email sent to: ${to}`)
  console.log(`   Subject: ${subject}`)
  console.log(`   Body: ${text || html?.replace(/<[^>]*>/g, '')}`)

  // Uncomment and configure one of these for production:

  // Option 1: Gmail SMTP
  // if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  //   const nodemailer = await import('nodemailer')
  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  //   })
  //   await transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, html, text })
  //   return true
  // }

  // Option 2: SendGrid
  // if (process.env.SENDGRID_API_KEY) {
  //   const sgMail = await import('@sendgrid/mail')
  //   sgMail.default.setApiKey(process.env.SENDGRID_API_KEY)
  //   await sgMail.default.send({ from: 'noreply@eduvance.app', to, subject, html, text })
  //   return true
  // }

  // Option 3: Resend
  // if (process.env.RESEND_API_KEY) {
  //   const { Resend } = await import('resend')
  //   const resend = new Resend(process.env.RESEND_API_KEY)
  //   await resend.emails.send({ from: 'noreply@eduvance.app', to, subject, html })
  //   return true
  // }

  return true
}

/**
 * Send email verification OTP
 */
export async function sendVerificationOTP(email, otp, name) {
  return sendEmail({
    to: email,
    subject: 'Verify your Eduvance account',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1;">Welcome to Eduvance! 🎓</h2>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't create an account, ignore this email.</p>
      </div>
    `,
    text: `Your Eduvance verification code is: ${otp}. It expires in 10 minutes.`,
  })
}
