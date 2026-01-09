# CMS Star Ratings API - Healthcare Provider Data Platform

## Overview
REST API providing 8 years of CMS provider star ratings for hospitals, nursing homes, dialysis centers, and home health agencies. Production API with authentication and rate limiting.

## Current Status: PRODUCTION
- **Stage**: Live production (v2.1)
- **URL**: https://api.healthcaredata.io/
- **Last Activity**: October-November 2025

## Coverage
- **Facilities**: 46,512 unique providers
- **Provider Types**: Hospitals, Nursing Homes, Dialysis, Home Health
- **Historical Data**: 8 years (2018-2025), 133 quarters
- **Data Size**: 218 MB (gzipped)

## Tech Stack
- **Backend**: Python (Flask/FastAPI)
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Railway
- **Data Processing**: Pandas

## Features
- REST API with OpenAPI/Swagger documentation
- Authentication required
- Rate limiting: 10,000 requests/day
- Quarterly data updates

## Source Location
Codebase: `/Users/adruiz/projects/cmsProviderData`

## Key Files
- `README.md` - Complete documentation
- `QUARTERLY_UPDATE_GUIDE.md` - Update process
- `star_ratings_api/extract_star_ratings_optimized.py` - Data extraction
- `ADMIN_DASHBOARD_GUIDE.md` - Admin access

## Performance
- Extraction time: ~2.5 minutes (v2.1)
- 10-20x faster than v1

## Current Priorities
1. Quarterly data updates
2. Trend analysis endpoints
3. Redis caching layer

## Notes
- Production API, live users
- Quarterly maintenance cycle
- Healthcare data focus
