# Calen Backend - Chief of Staff Services

Backend automation for the Calen chief of staff system. Handles morning briefs, EOD prompts, and integrations.

## Features

- **Morning Brief (7:30 AM)**: Sends daily priorities to Slack channels
- **EOD Prompt (6:00 PM)**: Reminds you to log daily activity
- **Calendar Integration**: Pulls Google Calendar events
- **GitHub Integration**: Reads/writes to worktree branches

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Run Locally

```bash
npm run dev
```

### 4. Deploy to Railway

```bash
# Connect to Railway
railway link

# Deploy
railway up

# Set environment variables in Railway dashboard
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /trigger/morning-brief` - Manually trigger morning brief
- `POST /trigger/eod-prompt` - Manually trigger EOD prompt
- `POST /slack/events` - Slack event webhook

## Environment Variables

See `.env.example` for all required variables.

### Required for Slack Integration
- `SLACK_BOT_TOKEN` - Bot user OAuth token
- `SLACK_CHANNEL_*` - Channel IDs for each project

### Required for GitHub Integration
- `GITHUB_TOKEN` - Personal access token
- `GITHUB_OWNER` - Repository owner (adtruiz)
- `GITHUB_REPO` - Repository name (Calen)

### Optional for Calendar
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

## Slack App Setup

1. Go to https://api.slack.com/apps
2. Create new app > From scratch
3. Add Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
   - `channels:read`
4. Install to workspace
5. Copy Bot User OAuth Token to `.env`
6. Create channels for priority projects:
   - `#vlaid-chief-of-staff`
   - `#willow-chief-of-staff`
   - `#network-chief-of-staff`
7. Invite bot to each channel
8. Copy channel IDs to `.env`

## Google Calendar Setup (Optional)

1. Go to https://console.cloud.google.com
2. Create project > Enable Calendar API
3. Create OAuth 2.0 credentials
4. Use OAuth playground to get refresh token
5. Add credentials to `.env`

## Priority Projects

Currently configured for:
- Vlaid
- Willow & Co
- Network

Other projects can be added by updating `PRIORITY_PROJECTS` in `src/cron/index.js`.
