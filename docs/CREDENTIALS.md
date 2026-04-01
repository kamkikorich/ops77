---
description: User credentials for Ops Kesan Digital - Internal use only
---

# User Credentials

## Admin Account
| Email | Password | Role |
|-------|----------|------|
| admin@perkeso.gov.my | admin123 | admin |

## User Accounts
| Email | Password | Role | Status |
|-------|----------|------|--------|
| kup@perkeso.gov.my | perkeso123 | user | active |
| ahmad@perkeso.gov.my | perkeso123 | user | active |
| kasman@perkeso.gov.my | perkeso123 | user | active |
| kerani@perkeso.gov.my | perkeso123 | user | active |

## Google Sheets ID
- **Spreadsheet**: `1jZYDzVQ-_RLga9mexOM3NSsJ1OGLLMu4PlGZzZ8kI9A`
- **Name**: perkeso_ops1_Rumah

## Sheets Structure
| Sheet | Purpose |
|-------|---------|
| users | User accounts (email, password, name, role, status) |
| premises | Premise data (uuid, nama_kedai, no_lot, status_perkeso) |
| visits | Visit records (id, premis_id, inspector_id, status, catatan) |

## Status Values
- **active** - User can login
- **pending** - Waiting for admin approval

## Role Values
- **admin** - Full access (create users, print stickers, reports)
- **user** - Standard access (scan, register premises, record visits)

---

**Note**: Passwords stored as plain text for internal use. Change to hashed passwords for production.