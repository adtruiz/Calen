const { WebClient } = require('@slack/web-api');

// Initialize Slack client (will be null if no token)
const slackClient = process.env.SLACK_BOT_TOKEN
  ? new WebClient(process.env.SLACK_BOT_TOKEN)
  : null;

// Channel configuration - map project names to channel IDs
const CHANNELS = {
  vlaid: process.env.SLACK_CHANNEL_VLAID,
  'willow-co': process.env.SLACK_CHANNEL_WILLOW,
  network: process.env.SLACK_CHANNEL_NETWORK,
  verzi: process.env.SLACK_CHANNEL_VERZI,
  diathrive: process.env.SLACK_CHANNEL_DIATHRIVE,
  maturi: process.env.SLACK_CHANNEL_MATURI,
  graphene: process.env.SLACK_CHANNEL_GRAPHENE,
  'cms-star-ratings': process.env.SLACK_CHANNEL_CMS,
  sportsmarkets: process.env.SLACK_CHANNEL_SPORTSMARKETS,
  execwatchdog: process.env.SLACK_CHANNEL_EXECWATCHDOG,
  retrocashrush: process.env.SLACK_CHANNEL_RETROCASHRUSH,
  momentbeheld: process.env.SLACK_CHANNEL_MOMENTBEHELD,
  personal: process.env.SLACK_CHANNEL_PERSONAL
};

/**
 * Send a message to a project's Slack channel
 */
async function sendMessage(project, text, blocks = null) {
  if (!slackClient) {
    console.log(`[MOCK] Would send to ${project}: ${text}`);
    return { ok: true, mock: true };
  }

  const channel = CHANNELS[project];
  if (!channel) {
    console.warn(`No channel configured for project: ${project}`);
    return { ok: false, error: 'no_channel' };
  }

  try {
    const payload = { channel, text };
    if (blocks) payload.blocks = blocks;

    const result = await slackClient.chat.postMessage(payload);
    return result;
  } catch (error) {
    console.error(`Error sending to ${project}:`, error.message);
    throw error;
  }
}

/**
 * Send morning brief to a project channel
 */
async function sendMorningBrief(project, data) {
  const { schedule = [], tasks = [], yesterday = '' } = data;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Good Morning - ${project.toUpperCase()}`,
        emoji: true
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${today}*`
      }
    },
    { type: 'divider' }
  ];

  // Add schedule if available
  if (schedule.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*TODAY\'S SCHEDULE:*\n' + schedule.map(e => `• ${e.time}: ${e.title}`).join('\n')
      }
    });
    blocks.push({ type: 'divider' });
  }

  // Add tasks if available
  if (tasks.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*TOP PRIORITIES:*\n' + tasks.slice(0, 5).map((t, i) => `${i + 1}. ${t.title}`).join('\n')
      }
    });
    blocks.push({ type: 'divider' });
  }

  // Add yesterday summary if available
  if (yesterday) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*YESTERDAY:*\n${yesterday}`
      }
    });
  }

  return sendMessage(project, `Good morning! Here's your ${project} brief.`, blocks);
}

/**
 * Send end-of-day prompt
 */
async function sendEODPrompt(project) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `End of Day - ${project.toUpperCase()}`,
        emoji: true
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Time to wrap up! Share what happened today:\n\n• What did you accomplish?\n• Any key conversations or insights?\n• What\'s next?\n\nJust type or voice message your update!'
      }
    }
  ];

  return sendMessage(project, `End of day check-in for ${project}`, blocks);
}

module.exports = {
  sendMessage,
  sendMorningBrief,
  sendEODPrompt,
  CHANNELS
};
