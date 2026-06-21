# JanLunMS Documentation

## Project: JanLunMS - Jan Laundry Management System
## Version: 1.0.0
## Status: Active
## Last Updated: 2026-05-25

---

## Overview

JanLunMS is a multi-tenant SaaS platform for laundry and dry-cleaning businesses. This documentation repository contains all architectural decisions, specifications, playbooks, and operational guides for the system.

## Documentation Structure

```
/docs
  /architecture     - System architecture, decisions, principles
  /requirements     - SRDs, specifications, feature docs
  /implementation   - Build guides, scaffolding, setup
  /playbooks        - Feature implementation playbooks
  /testing          - Testing strategy, plans, procedures
  /operations       - Deployment, monitoring, maintenance
  /workflows        - Business workflows, UI flows
  /state-machines   - Lifecycle states, transitions
  /api              - API standards, contracts, documentation
  /security         - Security model, RBAC, audit
  /deployment       - Environment configs, CI/CD
  /mobile           - Mobile app specifications
  /frontend         - Frontend architecture, components
  /backend          - Backend modules, services
  /database         - Schema, migrations, procedures
  /integrations     - Payment, SMS, WhatsApp, email
  /decisions        - Architecture Decision Records (ADRs)
  /diagrams         - System diagrams, flowcharts
```

## Quick Links

- [Document Index](./DOCUMENT_INDEX.md) - Complete document inventory
- [Architecture Overview](./architecture/ARCHITECTURE_OVERVIEW.md) - System architecture
- [Implementation Roadmap](./implementation/IMPLEMENTATION_ROADMAP.md) - Build schedule
- [Build Runbook](./implementation/BUILD_RUNBOOK.md) - Development commands

## Document Standards

Every document includes:
- Title and version
- Status (Draft | Active | Approved | Superseded | Deprecated | In Progress)
- Last updated timestamp
- Related modules
- Implementation status
- Dependencies

## Living Documentation

This is a **living documentation model**. Documents evolve with implementation:
- Updates reflect architectural improvements
- ADRs track significant decisions
- Traceability links code to documentation
- Change sections are marked with `[UPDATED YYYY-MM-DD]`

## Contact

Project: JanLunMS
Platform: Multi-tenant laundry management SaaS
Brands: pressing237 (customer/operations), LaundryOS (platform admin)
