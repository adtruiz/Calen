const { google } = require('googleapis');

// Initialize Gmail client if credentials available
let gmail = null;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  gmail = google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Get recent sent emails (last 24 hours)
 */
async function getRecentSentEmails() {
  if (!gmail) {
    console.log('[MOCK] Would fetch recent sent emails');
    return [];
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const timestamp = Math.floor(yesterday.getTime() / 1000);

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: `in:sent after:${timestamp}`,
      maxResults: 50
    });

    if (!response.data.messages) {
      return [];
    }

    const emails = await Promise.all(
      response.data.messages.map(async (message) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
          metadataHeaders: ['To', 'Subject', 'Date']
        });

        const headers = detail.data.payload.headers;
        const to = headers.find(h => h.name === 'To')?.value || '';
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const date = headers.find(h => h.name === 'Date')?.value;

        return {
          id: message.id,
          to,
          subject,
          date: date ? new Date(date) : new Date()
        };
      })
    );

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    return [];
  }
}

/**
 * Categorize email by project based on keywords in subject/recipient
 */
function categorizeEmail(email) {
  const text = `${email.subject} ${email.to}`.toLowerCase();

  const keywords = {
    vlaid: ['vlaid', 'healthcare', 'fhir', 'emr', 'investor', 'pitch', 'fundraising'],
    'willow-co': ['willow', 'dog park', 'clover', 'booking'],
    verzi: ['verzi'],
    diathrive: ['diathrive', 'schema', 'hca'],
    network: ['intro', 'introduction', 'connect', 'coffee', 'lunch'],
    maturi: ['maturi', 'syrup', 'brazil', 'xarope'],
    graphene: ['graphene', 'ucsgraphene', 'nanomaterial'],
    'cms-star-ratings': ['cms', 'star rating', 'provider data'],
    sportsmarkets: ['sports', 'prediction', 'betting'],
    personal: ['family', 'personal']
  };

  for (const [project, terms] of Object.entries(keywords)) {
    if (terms.some(term => text.includes(term))) {
      return project;
    }
  }

  return 'uncategorized';
}

/**
 * Get email summary grouped by project
 */
async function getEmailSummary() {
  const emails = await getRecentSentEmails();

  const categorized = {};

  emails.forEach(email => {
    const category = categorizeEmail(email);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(email);
  });

  return categorized;
}

/**
 * Get email count summary for morning brief
 */
async function getEmailCountSummary() {
  const summary = await getEmailSummary();
  const counts = {};

  for (const [project, emails] of Object.entries(summary)) {
    counts[project] = emails.length;
  }

  return counts;
}

module.exports = {
  getRecentSentEmails,
  categorizeEmail,
  getEmailSummary,
  getEmailCountSummary
};
