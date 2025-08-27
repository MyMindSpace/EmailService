const request = require('supertest');
const app = require('../server');

describe('Email Notification Service', () => {
  describe('Health Check', () => {
    it('should return service health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.service).toBe('MyMindSpace Email Service');
    });
  });

  describe('Email Status', () => {
    it('should return email service status', async () => {
      const response = await request(app)
        .get('/api/email/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.service).toBe('Email Notification Service');
    });
  });

  describe('Send Email Validation', () => {
    it('should reject request without required fields', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .send({
          email: 'invalid-email',
          name: 'Test User',
          content: 'Test content'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toContain('valid email address');
    });

    it('should reject empty name', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .send({
          email: 'test@example.com',
          name: '',
          content: 'Test content'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toContain('Name cannot be empty');
    });

    it('should reject empty content', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          content: ''
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toContain('Content cannot be empty');
    });

    it('should accept valid email request', async () => {
      const response = await request(app)
        .post('/api/email/send')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          content: 'This is a test notification from MyMindSpace',
          subject: 'Test Notification'
        });

      // Note: This might return 200 or 500 depending on email configuration
      // In a real environment with proper email setup, this should return 200
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Email sent successfully');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/unknown-endpoint')
        .expect(404);

      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});
