# Calen - Chief of Staff System (Main Branch)

## What This Is
Calen is Adrian's personal "chief of staff" system - a multi-project management platform using git worktrees. Each project has its own branch and worktree with dedicated context.

## Main Branch Purpose
The main branch (master) is the **dashboard/aggregation layer**. Use it for:
- Viewing overall project status
- Running aggregation scripts
- Managing the backend services
- Cross-project planning

## DO NOT use main branch for:
- Individual project work (use project worktrees)
- Project-specific tasks
- Daily logging (each project has its own daily-log.md)

## Project Portfolio (13 worktrees)

### Priority Projects (Full Chief of Staff Setup)
1. **Vlaid** - Healthcare data API, production
2. **Willow & Co** - Dog park SaaS, active
3. **Network** - Relationship management, cross-cutting

### Other Projects
- Verzi (company ops), Diathrive (client)
- Maturi, Graphene (Sage Group LLC)
- CMS Star Ratings, SportsMarkets (active)
- ExecWatchDog, RetroCashRush, MomentBeheld (paused)
- Personal (family/life)

## Navigation
```bash
# Go to any project
cd worktrees/vlaid && claude
cd worktrees/network && claude
# etc.
```

## Backend Services
The `backend/` directory contains the Railway-deployed automation:
- Morning briefs (7:30 AM)
- EOD prompts (6:00 PM)
- Email/calendar sync
- Slack integration

## Aggregation
Run `./scripts/aggregate-daily-logs.sh` to pull all daily logs into a unified view.

## Key Principle
Each worktree is isolated with its own context. When you `cd` into a worktree and run `claude`, it reads that project's CLAUDE.md for full context.
