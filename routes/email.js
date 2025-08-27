const express = require('express');
const Joi = require('joi');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation schema
const sendEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  name: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Name cannot be empty',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  content: Joi.string().min(1).max(5000).required().messages({
    'string.min': 'Content cannot be empty',
    'string.max': 'Content cannot exceed 5000 characters',
    'any.required': 'Content is required'
  }),
  subject: Joi.string().min(1).max(200).optional().messages({
    'string.max': 'Subject cannot exceed 200 characters'
  }),
  priority: Joi.string().valid('low', 'normal', 'high').optional().default('normal')
});

// POST /api/email/send - Send email notification
router.post('/send', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = sendEmailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { email, name, content, subject, priority } = value;

    // Send email
    const result = await emailService.sendNotification({
      email,
      name,
      content,
      subject: subject || 'MyMindSpace Notification',
      priority
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Email Send Failed',
        message: result.error
      });
    }

  } catch (error) {
    console.error('Email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to process email request'
    });
  }
});

// GET /api/email/status - Service status
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Email Notification Service',
    status: 'Active',
    provider: process.env.EMAIL_SERVICE || 'Not configured',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
