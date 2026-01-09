const { Octokit } = require('octokit');

// Initialize GitHub client
const octokit = process.env.GITHUB_TOKEN
  ? new Octokit({ auth: process.env.GITHUB_TOKEN })
  : null;

const OWNER = process.env.GITHUB_OWNER || 'adtruiz';
const REPO = process.env.GITHUB_REPO || 'Calen';

/**
 * Get file contents from a specific branch
 */
async function getFileContents(branch, path) {
  if (!octokit) {
    console.log(`[MOCK] Would read ${path} from ${branch}`);
    return null;
  }

  try {
    const response = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
      ref: branch
    });

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return {
      content,
      sha: response.data.sha
    };
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Update or create a file in the repository
 */
async function updateFile(branch, path, content, message, sha = null) {
  if (!octokit) {
    console.log(`[MOCK] Would update ${path} in ${branch}`);
    return { mock: true };
  }

  try {
    const params = {
      owner: OWNER,
      repo: REPO,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch
    };

    if (sha) {
      params.sha = sha;
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents(params);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${path} in ${branch}:`, error.message);
    throw error;
  }
}

/**
 * Append entry to a project's daily log
 */
async function appendToDailyLog(project, entry) {
  const branch = project;
  const path = 'daily-log.md';

  try {
    const file = await getFileContents(branch, path);

    if (!file) {
      console.error(`daily-log.md not found in ${project} branch`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const lines = file.content.split('\n');

    // Check if today's section exists
    const todayHeader = `## ${today}`;
    const todayIndex = lines.findIndex(line => line.includes(todayHeader));

    let newContent;
    if (todayIndex === -1) {
      // Add new day section after the title
      const template = `\n## ${today} (${dayName})\n### Updates\n- ${entry}\n\n---\n`;
      lines.splice(2, 0, template);
      newContent = lines.join('\n');
    } else {
      // Find the "Updates" or "Accomplishments" section and append
      let insertIndex = todayIndex + 1;
      while (insertIndex < lines.length && !lines[insertIndex].startsWith('### ')) {
        insertIndex++;
      }
      insertIndex++; // Move past the ### header

      lines.splice(insertIndex, 0, `- ${entry}`);
      newContent = lines.join('\n');
    }

    await updateFile(
      branch,
      path,
      newContent,
      `Update daily log: ${today}`,
      file.sha
    );

    console.log(`Updated daily log for ${project}`);
  } catch (error) {
    console.error(`Error appending to daily log for ${project}:`, error.message);
  }
}

/**
 * Get yesterday's summary from a project's daily log
 */
async function getYesterdaySummary(project) {
  const branch = project;
  const path = 'daily-log.md';

  try {
    const file = await getFileContents(branch, path);

    if (!file) {
      return null;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lines = file.content.split('\n');
    const yesterdayIndex = lines.findIndex(line => line.includes(`## ${yesterdayStr}`));

    if (yesterdayIndex === -1) {
      return null;
    }

    // Extract content until next day section or separator
    let summary = '';
    for (let i = yesterdayIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## ') || lines[i].startsWith('---')) {
        break;
      }
      if (lines[i].trim() && !lines[i].startsWith('#')) {
        summary += lines[i] + '\n';
      }
    }

    return summary.trim() || null;
  } catch (error) {
    console.error(`Error getting yesterday's summary for ${project}:`, error.message);
    return null;
  }
}

module.exports = {
  getFileContents,
  updateFile,
  appendToDailyLog,
  getYesterdaySummary
};
