# 📧 MyMindSpace Email Notification Service

A production-ready, lightweight email notification service for the MyMindSpace mental wellness platform. Send beautiful, branded email notifications with a simple REST API.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

## ✨ Features

- 🚀 **Simple REST API** - Single endpoint for sending emails
- 📧 **Multiple Providers** - Gmail, SMTP, or test accounts
- 🎨 **Beautiful Templates** - Professional HTML emails with MyMindSpace branding  
- 🛡️ **Security First** - Rate limiting, input validation, CORS protection
- 🐳 **Docker Ready** - Production-ready containerization
- 📊 **Health Monitoring** - Built-in health checks and status endpoints
- 🧪 **Fully Tested** - Comprehensive test suite with Jest

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- Gmail account with App Password (recommended)

### **1. Install Dependencies**
```bash
cd Email
npm install
```

### **2. Setup Environment**
```bash
copy .env.example .env
# Edit .env with your email credentials
```

### **3. Configure Gmail (Recommended)**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: [Google Account Settings](https://myaccount.google.com/) → Security → App Passwords
3. Update your `.env` file:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-character-app-password
   EMAIL_FROM=MyMindSpace <your-email@gmail.com>
   ```

### **4. Start Service**
```bash
npm start        # Production
npm run dev      # Development with auto-reload
npm test         # Run tests
```

## 📡 API Reference

### **Send Email Notification**
**POST** `/api/email/send`

Send a personalized email notification to any recipient.

**Request Body:**
```json
{
  "email": "user@example.com",           // Required: Valid email address
  "name": "John Doe",                    // Required: Recipient name (1-100 chars)
  "content": "Your message here...",     // Required: Email content (1-5000 chars)
  "subject": "Custom Subject",           // Optional: Email subject (max 200 chars)
  "priority": "normal"                   // Optional: low, normal, high
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "unique-message-id",
  "timestamp": "2025-08-28T10:30:00.000Z"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Validation Error",
  "details": "Please provide a valid email address"
}
```

### **Service Status**
**GET** `/api/email/status`

Get current service status and configuration.

**Response:**
```json
{
  "success": true,
  "service": "Email Notification Service", 
  "status": "Active",
  "provider": "gmail",
  "timestamp": "2025-08-28T10:30:00.000Z"
}
```

### **Health Check**
**GET** `/health`

Basic health check for monitoring and load balancers.

**Response:**
```json
{
  "status": "OK",
  "service": "MyMindSpace Email Service",
  "timestamp": "2025-08-28T10:30:00.000Z"
}
```

## ⚙️ Configuration

### **Environment Variables**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3003` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `EMAIL_SERVICE` | No | `gmail` | Email provider (gmail/smtp/test) |
| `EMAIL_USER` | Yes | - | Gmail username or SMTP user |
| `EMAIL_APP_PASSWORD` | Yes | - | Gmail App Password or SMTP password |
| `EMAIL_FROM` | No | `EMAIL_USER` | From address with name |
| `RATE_LIMIT_WINDOW` | No | `15` | Rate limit window (minutes) |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window |

### **Gmail Setup (Recommended)**
1. **Enable 2-Factor Authentication** in your Google Account
2. **Generate App Password:** 
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Select "App passwords" 
   - Choose "Mail" and generate password
3. **Configure Environment:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-character-password
   EMAIL_FROM=MyMindSpace <your-email@gmail.com>
   ```

### **SMTP Setup (Alternative)**
For other email providers or custom SMTP servers:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

### **Test Mode (Development)**
For development without real email sending:
```env
EMAIL_SERVICE=test
```
This uses Ethereal test accounts and provides preview URLs in console logs.

## 🔧 Usage Examples

### **cURL Commands**

**Basic Notification:**
```bash
curl -X POST http://localhost:3003/api/email/send ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@example.com\",\"name\":\"John Doe\",\"content\":\"Welcome to MyMindSpace! Your wellness journey starts here.\"}"
```

**High Priority Alert:**
```bash
curl -X POST http://localhost:3003/api/email/send ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@example.com\",\"name\":\"Jane Smith\",\"content\":\"Crisis support resources are available 24/7.\",\"subject\":\"Urgent: Support Available\",\"priority\":\"high\"}"
```

### **JavaScript/Node.js Integration**

```javascript
const axios = require('axios');

// Simple notification function
async function sendNotification(email, name, content, options = {}) {
  try {
    const response = await axios.post('http://localhost:3003/api/email/send', {
      email,
      name,
      content,
      subject: options.subject || 'MyMindSpace Notification',
      priority: options.priority || 'normal'
    });
    
    console.log('Email sent:', response.data.messageId);
    return response.data;
  } catch (error) {
    console.error('Email failed:', error.response?.data || error.message);
    throw error;
  }
}

// Usage examples
await sendNotification('user@example.com', 'John', 'Welcome to MyMindSpace!');
await sendNotification('user@example.com', 'Jane', 'Your analysis is ready!', {
  subject: 'Mood Analysis Complete',
  priority: 'normal'
});
```

### **PowerShell (Windows)**
```powershell
Invoke-RestMethod -Uri "http://localhost:3003/api/email/send" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"user@example.com","name":"Test User","content":"PowerShell test notification!"}'
```

## � Docker Deployment

### **Quick Docker Start**
```bash
# Build and run with Docker
docker build -t mymindspace-email .
docker run -d --name email-service -p 3003:3003 --env-file .env mymindspace-email

# Or use Docker Compose
docker-compose up -d
```

### **Google Cloud Run**
```bash
# Deploy directly to Cloud Run
gcloud run deploy email-service --source . --platform managed --region us-central1 --allow-unauthenticated

# Set environment variables
gcloud run services update email-service \
  --set-env-vars EMAIL_USER=your-email@gmail.com,EMAIL_APP_PASSWORD=your-app-password \
  --region us-central1
```

### **Environment Variables for Docker**
Create a `.env` file for Docker deployment:
```env
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM=MyMindSpace <your-email@gmail.com>
```

**📄 See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for complete deployment guide.**

## 🛡️ Security & Performance

### **Security Features**
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **Input Validation** - Joi schema validation for all inputs  
- ✅ **CORS Protection** - Configurable cross-origin requests
- ✅ **Environment Security** - Sensitive data in environment variables
- ✅ **Error Handling** - Comprehensive error responses without data leaks
- ✅ **Docker Security** - Non-root user, Alpine Linux base

### **Performance Optimizations**
- ✅ **Connection Pooling** - Reusable SMTP connections
- ✅ **Async Operations** - Non-blocking email sending
- ✅ **Health Monitoring** - Automatic service recovery
- ✅ **Resource Limits** - Memory and CPU constraints in Docker
- ✅ **Lightweight Base** - Alpine Linux for minimal footprint

## 🎨 Email Templates

The service automatically generates beautiful emails with:
- **Responsive HTML Design** - Works on all devices
- **MyMindSpace Branding** - Professional visual identity
- **Plain Text Fallback** - Compatible with all email clients
- **Personalized Content** - Dynamic name and content insertion

### **Template Preview**
- Clean, modern design with gradient header
- Professional typography and spacing
- Mobile-responsive layout
- Branded footer with wellness messaging

## 🧪 Testing

### **Run Test Suite**
```bash
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run with coverage report
```

### **Manual Testing**
```bash
# Test service health
curl http://localhost:3003/health

# Test email sending
curl -X POST http://localhost:3003/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","content":"Test message"}'

# Test service status
curl http://localhost:3003/api/email/status
```

## 📊 Monitoring & Logs

### **Application Logs**
```bash
# Development logs
npm run dev

# Docker logs  
docker logs -f mymindspace-email

# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision"
```

### **Health Monitoring**
- **Health Endpoint:** `GET /health` - Basic service health
- **Status Endpoint:** `GET /api/email/status` - Detailed service status
- **Docker Health Checks** - Automatic container monitoring
- **Cloud Run Health Checks** - Built-in uptime monitoring

### **Error Tracking**
All errors are logged with:
- Timestamp and severity level
- Request context and user information
- Detailed error messages for debugging
- Email sending status and message IDs

## 📋 Error Reference

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| `400` | Validation Error | Invalid input data (email format, missing fields) |
| `429` | Rate Limit | Too many requests from same IP |
| `500` | Email Send Failed | SMTP connection or authentication issues |
| `500` | Internal Server Error | Unexpected server errors |

### **Common Issues & Solutions**

**🔴 "Gmail Authentication Failed"**
- Verify 2FA is enabled on Gmail account
- Regenerate Gmail App Password  
- Check EMAIL_USER and EMAIL_APP_PASSWORD in .env

**🔴 "Rate Limit Exceeded"**
- Wait 15 minutes or adjust rate limits in server.js
- Consider using multiple email accounts for high volume

**🔴 "Container Health Check Failed"**
- Check if service is running on correct port
- Verify environment variables are set correctly
- Review Docker logs for startup errors

## 🔗 Integration with MyMindSpace

This service integrates seamlessly with the main MyMindSpace platform for:

### **User Notifications**
- **Welcome emails** for new user registrations
- **Daily mood reminders** and wellness check-ins  
- **Achievement notifications** for skill progression
- **Analysis ready** alerts for mood/journal insights

### **Mental Health Support**
- **Crisis support** resource notifications
- **Appointment reminders** for therapy sessions
- **Resource recommendations** based on user needs
- **Community updates** and group activities

### **Platform Updates**
- **Feature announcements** and platform updates
- **Maintenance notifications** and service updates
- **Feedback requests** and user surveys
- **Newsletter content** and wellness tips

## 🚀 Production Deployment

### **Recommended Architecture**
```
Internet → Load Balancer → Google Cloud Run → Email Service
                                         ↓
                               Gmail SMTP / Custom SMTP
```

### **Scaling Considerations**
- **Horizontal Scaling:** Cloud Run auto-scales based on traffic
- **Rate Limiting:** Adjust limits based on email provider quotas
- **Multiple Providers:** Consider backup SMTP providers for reliability
- **Monitoring:** Set up alerts for service health and email delivery rates

### **Environment-Specific Configs**

**Development:**
```env
NODE_ENV=development
EMAIL_SERVICE=test  # Uses Ethereal for safe testing
```

**Staging:**
```env
NODE_ENV=staging  
EMAIL_SERVICE=gmail
EMAIL_USER=staging@yourdomain.com
```

**Production:**
```env
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=notifications@yourdomain.com
RATE_LIMIT_MAX=1000  # Higher limits for production
```

---

## 🎯 **Ready to Deploy!**

Your MyMindSpace Email Notification Service is production-ready with:
- ✅ **Secure authentication** and input validation
- ✅ **Beautiful email templates** with professional branding
- ✅ **Docker containerization** for easy deployment
- ✅ **Comprehensive monitoring** and health checks
- ✅ **Complete documentation** and examples
- ✅ **Test suite** for reliability assurance

**Start sending wellness notifications today! 📧✨**

---

## 📞 Support

- **Documentation:** [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
- **Issues:** Create issues in the project repository
- **Email:** Technical questions and support requests
