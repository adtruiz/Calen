# Calen - Chief of Staff System

Personal productivity system using git worktrees to manage multiple projects with AI-powered assistance.

## Overview

Calen is a multi-project management system that uses git worktrees to maintain separate contexts for each project. Each worktree has its own CLAUDE.md (context for Claude Code), README.md, and daily-log.md.

## Project Portfolio

### Active Projects
| Project | Description | Status |
|---------|-------------|--------|
| [Vlaid](worktrees/vlaid/) | Healthcare data API ("Plaid for Healthcare") | Production |
| [Willow & Co](worktrees/willow-co/) | Dog park management SaaS | Active (Apple approval) |
| [CMS Star Ratings](worktrees/cms-star-ratings/) | Healthcare provider ratings API | Production |
| [SportsMarkets](worktrees/sportsmarkets/) | AI sports predictions for X | Active |

### Business Projects (Sage Group LLC)
| Project | Description | Status |
|---------|-------------|--------|
| [Maturi](worktrees/maturi/) | Brazilian tropical syrup brand | Market expansion |
| [Graphene](worktrees/graphene/) | B2B industrial nanomaterials | Established |

### Verzi LLC
| Project | Description | Status |
|---------|-------------|--------|
| [Verzi](worktrees/verzi/) | Company operations | Active |
| [Diathrive](worktrees/diathrive/) | Client - healthcare data schemas | Complete |

### Paused/Dormant
| Project | Description | Status |
|---------|-------------|--------|
| [ExecWatchDog](worktrees/execwatchdog/) | CEO compensation analysis | Paused |
| [Retro Cash Rush](worktrees/retrocashrush/) | Multiplayer cash prize game | Paused |
| [MomentBeheld](worktrees/momentbeheld/) | Historical visual stories | Dormant |

### Cross-Cutting
| Project | Description | Status |
|---------|-------------|--------|
| [Network](worktrees/network/) | Professional relationships | Active |
| [Personal](worktrees/personal/) | Family & life | Active |

## Quick Navigation

```bash
# Jump to any worktree
cd ~/projects/Calen/worktrees/vlaid
cd ~/projects/Calen/worktrees/willow-co
cd ~/projects/Calen/worktrees/network
# ... etc

# List all worktrees
git worktree list
```

## Daily Workflow

1. **Morning**: Check Slack for daily briefs
2. **Work**: Open relevant worktree in terminal, run `claude`
3. **Throughout Day**: Update via Slack or direct commits
4. **Evening**: Brain dump in Slack, system auto-commits

## System Components

- **GitHub**: Worktree storage and version control
- **Slack**: Communication interface (one channel per project)
- **Linear**: Task management
- **Gmail/Calendar**: Auto-sync for context
- **Railway**: Backend automation services

## Repository Structure

```
Calen/
├── README.md           # This file
├── CLAUDE.md           # Main branch context
├── backend/            # Railway deployment
└── worktrees/
    ├── vlaid/
    ├── willow-co/
    ├── verzi/
    ├── diathrive/
    ├── maturi/
    ├── graphene/
    ├── cms-star-ratings/
    ├── sportsmarkets/
    ├── execwatchdog/
    ├── retrocashrush/
    ├── momentbeheld/
    ├── network/
    └── personal/
```

## Getting Started

Each worktree is independent. To work on a specific project:

1. Navigate to the worktree: `cd worktrees/vlaid`
2. Start Claude Code: `claude`
3. Claude will read the CLAUDE.md for context
4. Work on your project
5. Commit and push when done
