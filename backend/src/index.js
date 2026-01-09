require('dotenv').config();
const express = require('express');
const cronJobs = require('./cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'calen-chief-of-staff'
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    name: 'Calen Chief of Staff',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      trigger: '/trigger/:action'
    }
  });
});

// Manual trigger endpoints (for testing)
app.post('/trigger/morning-brief', async (req, res) => {
  try {
    await cronJobs.triggerMorningBrief();
    res.json({ success: true, message: 'Morning brief triggered' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/trigger/eod-prompt', async (req, res) => {
  try {
    await cronJobs.triggerEODPrompt();
    res.json({ success: true, message: 'EOD prompt triggered' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Slack events endpoint (for future interactive features)
app.post('/slack/events', (req, res) => {
  const { type, challenge } = req.body;

  // URL verification for Slack
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // Handle other events
  console.log('Slack event received:', req.body);
  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`Calen Chief of Staff backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Start cron jobs
  cronJobs.start();
});
