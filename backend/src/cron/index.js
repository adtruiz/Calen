const cron = require('node-cron');
const slackService = require('../services/slack');
const githubService = require('../services/github');
const calendarService = require('../services/calendar');
const gmailService = require('../services/gmail');

// Priority projects get full chief of staff features
const PRIORITY_PROJECTS = ['vlaid', 'willow-co', 'network'];

// All projects (for later expansion)
const ALL_PROJECTS = [
  'vlaid', 'willow-co', 'network', 'verzi', 'diathrive',
  'maturi', 'graphene', 'cms-star-ratings', 'sportsmarkets',
  'execwatchdog', 'retrocashrush', 'momentbeheld', 'personal'
];

/**
 * Send morning briefs to priority projects
 */
async function sendMorningBriefs() {
  console.log('Running morning briefs...');

  try {
    const schedule = await calendarService.getScheduleSummary();
    const emailCounts = await gmailService.getEmailCountSummary();

    for (const project of PRIORITY_PROJECTS) {
      const yesterdaySummary = await githubService.getYesterdaySummary(project);
      const emailCount = emailCounts[project] || 0;

      // Add email info to yesterday summary if available
      let enhancedYesterday = yesterdaySummary || '';
      if (emailCount > 0) {
        enhancedYesterday += `\n📧 ${emailCount} email(s) sent related to ${project}`;
      }

      await slackService.sendMorningBrief(project, {
        schedule: schedule[project] || [],
        tasks: [],
        yesterday: enhancedYesterday
      });

      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Morning briefs sent to priority projects');
  } catch (error) {
    console.error('Error in morning briefs:', error);
  }
}

/**
 * Send EOD prompts to priority projects
 */
async function sendEODPrompts() {
  console.log('Running EOD prompts...');

  try {
    for (const project of PRIORITY_PROJECTS) {
      await slackService.sendEODPrompt(project);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('EOD prompts sent to priority projects');
  } catch (error) {
    console.error('Error in EOD prompts:', error);
  }
}

// Cron job: Morning brief at 7:30 AM (adjust timezone as needed)
const morningBrief = cron.schedule('30 7 * * *', sendMorningBriefs, {
  timezone: process.env.TIMEZONE || 'America/Chicago',
  scheduled: false
});

// Cron job: EOD prompt at 6:00 PM
const eodPrompt = cron.schedule('0 18 * * *', sendEODPrompts, {
  timezone: process.env.TIMEZONE || 'America/Chicago',
  scheduled: false
});

/**
 * Start all cron jobs
 */
function start() {
  console.log('Starting cron jobs...');
  console.log(`Timezone: ${process.env.TIMEZONE || 'America/Chicago'}`);
  console.log('- Morning brief: 7:30 AM');
  console.log('- EOD prompt: 6:00 PM');

  morningBrief.start();
  eodPrompt.start();

  console.log('Cron jobs started');
}

/**
 * Stop all cron jobs
 */
function stop() {
  morningBrief.stop();
  eodPrompt.stop();
  console.log('Cron jobs stopped');
}

/**
 * Manual triggers for testing
 */
async function triggerMorningBrief() {
  await sendMorningBriefs();
}

async function triggerEODPrompt() {
  await sendEODPrompts();
}

module.exports = {
  start,
  stop,
  triggerMorningBrief,
  triggerEODPrompt
};
