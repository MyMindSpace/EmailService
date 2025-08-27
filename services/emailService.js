const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Configure email transporter based on environment
      const emailService = process.env.EMAIL_SERVICE || 'gmail';
      
      if (emailService === 'gmail') {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
          }
        });
      } else if (emailService === 'smtp') {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });
      } else {
        // Fallback to ethereal for testing
        this.createTestAccount();
      }
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Using Ethereal test account:', testAccount.user);
    } catch (error) {
      console.error('Failed to create test account:', error);
    }
  }

  async sendNotification({ email, name, content, subject, priority = 'normal' }) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      // Verify transporter connection
      await this.transporter.verify();

      // Prepare email options
      const mailOptions = {
        from: {
          name: 'MyMindSpace',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@mymindspace.com'
        },
        to: {
          name: name,
          address: email
        },
        subject: subject,
        html: this.generateEmailHTML(name, content),
        text: this.generateEmailText(name, content),
        priority: priority === 'high' ? 'high' : 'normal'
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`📧 Email sent successfully to ${email} (Message ID: ${result.messageId})`);
      
      // For Ethereal, log preview URL
      if (result.messageId && process.env.EMAIL_SERVICE !== 'gmail' && process.env.EMAIL_SERVICE !== 'smtp') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateEmailHTML(name, content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MyMindSpace Notification</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px 20px; }
          .greeting { color: #333; font-size: 18px; margin-bottom: 20px; }
          .message { color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 30px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧠 MyMindSpace</h1>
            <p>Your Mental Wellness Companion</p>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <div class="message">${content.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            <p>This notification was sent from MyMindSpace</p>
            <p>Take care of your mental wellness 💚</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateEmailText(name, content) {
    return `
Hello ${name},

${content}

---
This notification was sent from MyMindSpace
Take care of your mental wellness 💚
    `.trim();
  }

  async testConnection() {
    try {
      if (!this.transporter) {
        return { success: false, error: 'Transporter not initialized' };
      }
      
      await this.transporter.verify();
      return { success: true, message: 'Email service connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
