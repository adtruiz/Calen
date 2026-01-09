const { google } = require('googleapis');

// Initialize OAuth2 client if credentials are available
let calendar = null;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  calendar = google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Get today's calendar events
 */
async function getTodaysEvents() {
  if (!calendar) {
    console.log('[MOCK] Would fetch today\'s calendar events');
    return [];
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'Untitled',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description,
      attendees: event.attendees?.map(a => a.email) || []
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error.message);
    return [];
  }
}

/**
 * Categorize an event by project based on keywords
 */
function categorizeEvent(event) {
  const text = `${event.title} ${event.description || ''}`.toLowerCase();

  const keywords = {
    vlaid: ['vlaid', 'healthcare api', 'fhir', 'emr', 'plaid for health'],
    'willow-co': ['willow', 'dog park', 'clover'],
    verzi: ['verzi', 'partner meeting'],
    diathrive: ['diathrive', 'schema', 'hca'],
    network: ['coffee', 'intro', 'networking', 'catch up', 'lunch with'],
    maturi: ['maturi', 'syrup', 'brazil'],
    graphene: ['graphene', 'ucsgraphene'],
    'cms-star-ratings': ['cms', 'star rating', 'healthcare data'],
    sportsmarkets: ['sports', 'prediction', 'betting'],
    personal: ['family', 'personal', 'doctor', 'appointment']
  };

  for (const [project, terms] of Object.entries(keywords)) {
    if (terms.some(term => text.includes(term))) {
      return project;
    }
  }

  return 'general';
}

/**
 * Format event time for display
 */
function formatEventTime(event) {
  const start = new Date(event.start);
  return start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get schedule summary grouped by project
 */
async function getScheduleSummary() {
  const events = await getTodaysEvents();

  const categorized = {};

  events.forEach(event => {
    const category = categorizeEvent(event);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push({
      time: formatEventTime(event),
      title: event.title,
      context: event.description?.split('\n')[0]
    });
  });

  return categorized;
}

module.exports = {
  getTodaysEvents,
  categorizeEvent,
  getScheduleSummary
};
