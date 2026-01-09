# Vlaid - Healthcare Data Interoperability Platform

## Project Overview
Vlaid is a B2B API platform ("Plaid for Healthcare") that aggregates patient health data from multiple EMR systems and insurance providers using FHIR standards. This is Adrian's solo project, potentially becoming a Verzi LLC venture.

## Current Status: PRODUCTION & ACTIVE
- **Stage**: Production-ready, actively developed
- **Last Activity**: January 8, 2026
- **Deployment**: Railway (https://stripe-healthcare-production.up.railway.app/)

## Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with encrypted token storage (AES-256-GCM)
- **Frontend**: Next.js 14 (developer portal & marketing site)
- **Authentication**: Google OAuth + SMART on FHIR with PKCE
- **Caching/Queuing**: Redis
- **Deployment**: Railway

## Key Features
- OAuth 2.0 with PKCE for multi-provider support
- FHIR R4 data aggregation across multiple sources
- Token encryption and automatic refresh
- Smart deduplication with fuzzy matching
- HIPAA-compliant audit logging
- Developer dashboard with API key management
- Rate limiting and webhook events
- Connect Widget for embeddable provider selection

## EMR Integration Status
| Provider | Status | Coverage |
|----------|--------|----------|
| Epic MyChart | Working | 305M+ patients |
| Oracle Health (Cerner) | Planned | 800+ hospitals |
| NextGen Healthcare | Configured | 16K+ practices |
| Healow | Planned | - |
| athenahealth | Planned | - |

## Business Model
- B2B API subscription
- Target: Healthcare payers, health tech companies
- Revenue model: Per-API-call or subscription tiers

## Source Code Location
Original codebase: `/Users/adruiz/projects/plaid-for-healthcare`

## Key Files Reference
- `apps/api/` - Core API source code
- `apps/developer-portal/` - Developer dashboard
- `apps/marketing-site/` - Public website
- `PROJECT_STATUS.md` - Detailed roadmap and status

## GitHub
- Repo: https://github.com/adtruiz/willow-and-co (note: repo name mismatch)

## Current Priorities
1. Continue EMR integrations
2. Investor outreach and pitch refinement
3. Developer documentation improvements
4. HIPAA compliance documentation

## Notes
- This is a solo project by Adrian
- May become official Verzi LLC project in future
- Active development - commits happening regularly
