# Document Index

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  

---

## Document Registry

| ID | Document | Location | Status | Category | Implementation Status |
|----|----------|----------|--------|----------|----------------------|
| DOC-001 | README | /README.md | Active | Meta | N/A |
| DOC-002 | Document Index | /DOCUMENT_INDEX.md | Active | Meta | N/A |
| DOC-003 | Architecture Overview | /architecture/ARCHITECTURE_OVERVIEW.md | Active | Architecture | In Progress |
| DOC-004 | Module Dependency Map | /architecture/MODULE_DEPENDENCY_MAP.md | Active | Architecture | In Progress |
| DOC-005 | System Architecture | /architecture/01_UNIFIED_SYSTEM_ARCHITECTURE.md | Active | Architecture | In Progress |
| DOC-006 | Monorepo Structure | /architecture/02_MONOREPO_STRUCTURE.md | Active | Architecture | In Progress |
| DOC-007 | Tech Architecture | /architecture/03_TECH_ARCHITECTURE.md | Active | Architecture | In Progress |
| DOC-008 | NestJS Module Blueprint | /backend/20_NESTJS_MODULE_AND_TABLE_BLUEPRINT.md | Active | Backend | In Progress |
| DOC-009 | API Standards | /api/API_STANDARDS.md | Active | API | Planned |
| DOC-010 | Event Architecture | /backend/EVENT_ARCHITECTURE.md | Active | Backend | Planned |
| DOC-011 | Security Model | /security/SECURITY_MODEL.md | Active | Security | Planned |
| DOC-012 | State Machine Definitions | /state-machines/STATE_MACHINE_DEFINITIONS.md | Active | State Machines | Planned |
| DOC-013 | Offline Sync Strategy | /mobile/OFFLINE_SYNC_STRATEGY.md | Active | Mobile | Planned |
| DOC-014 | ADR Log | /decisions/ADR_LOG.md | Active | Decisions | In Progress |
| DOC-015 | Frontend Responsibilities | /frontend/09_FRONTEND_APP_RESPONSIBILITIES.md | Active | Frontend | In Progress |
| DOC-016 | UI/UX Design System | /frontend/10_UI_UX_DESIGN_SYSTEM_GUIDE.md | Active | Frontend | In Progress |
| DOC-017 | Admin Dashboard Scope | /frontend/24_ADMIN_DASHBOARD_SCOPE.md | Active | Frontend | In Progress |
| DOC-018 | Frontend Architecture Lock | /frontend/24.5_FRONTEND_ARCHITECTURE_LOCK.md | Active | Frontend | In Progress |
| DOC-019 | Navigation Architecture | /frontend/28_NAV_ARCHITECTURE.md | Active | Frontend | In Progress |
| DOC-020 | Customer Web Spec | /frontend/25_CUSTOMER_WEB_SPEC.md | Active | Frontend | Planned |
| DOC-021 | Pressing Web Spec | /frontend/26_PRESSING_WEB_SPEC.md | Active | Frontend | In Progress |
| DOC-022 | Customer Mobile Spec | /mobile/27_CUSTOMER_MOBILE_SPEC.md | Active | Mobile | Planned |
| DOC-023 | Order and QR Spec | /requirements/29_ORDER_AND_QR_SPEC.md | Active | Requirements | In Progress |
| DOC-024 | Customer Web Gap Analysis | /requirements/30_CUSTOMER_WEB_GAP_ANALYSIS.md | Active | Requirements | Planned |
| DOC-025 | Garment Lifecycle SRD | /workflows/31_GARMENT_LIFECYCLE_SRD.md | Active | Workflows | In Progress |
| DOC-026 | Delivery Logistics Spec | /requirements/32_DELIVERY_LOGISTICS_SPEC.md | Active | Requirements | Planned |
| DOC-027 | Pricing Engine Spec | /requirements/33_PRICING_ENGINE_SPEC.md | Active | Requirements | Planned |
| DOC-028 | Notification System Spec | /integrations/34_NOTIFICATION_SYSTEM_SPEC.md | Active | Integrations | Planned |
| DOC-029 | Environments and Deployment | /deployment/14_ENVIRONMENTS_AND_DEPLOYMENT.md | Active | Deployment | Planned |
| DOC-030 | Infrastructure Guide | /deployment/15_INFRASTRUCTURE_IMPLEMENTATION_GUIDE.md | Active | Deployment | Planned |
| DOC-031 | Domain and Environment Matrix | /deployment/16_DOMAIN_AND_ENVIRONMENT_MATRIX.md | Active | Deployment | Planned |
| DOC-032 | Staging Bootstrap Checklist | /operations/23_STAGING_BOOTSTRAP_CHECKLIST.md | Active | Operations | Planned |
| DOC-033 | Implementation Plan | /implementation/IMPLEMENTATION_PLAN.md | Active | Implementation | In Progress |
| DOC-034 | Build Runbook | /implementation/BUILD_RUNBOOK.md | Active | Implementation | In Progress |
| DOC-035 | Testing Strategy | /testing/TESTING_STRATEGY.md | Active | Testing | Planned |
| DOC-036 | Implementation Roadmap | /implementation/IMPLEMENTATION_ROADMAP.md | Active | Implementation | In Progress |
| DOC-037 | OpenCode Execution Runbook | /implementation/21A_OPENCODE_EXECUTION_RUNBOOK.md | Active | Implementation | In Progress |

---

## Feature Playbooks

| ID | Playbook | Location | Status |
|----|----------|----------|--------|
| PBL-001 | Order Intake & Processing | /playbooks/PBL-001_ORDER_INTAKE.md | Planned |
| PBL-002 | Garment Tagging & QC | /playbooks/PBL-002_GARMENT_TAGGING.md | Planned |
| PBL-003 | QR Tracking System | /playbooks/PBL-003_QR_TRACKING.md | Planned |
| PBL-004 | Delivery Logistics | /playbooks/PBL-004_DELIVERY_LOGISTICS.md | Planned |
| PBL-005 | Payment Integration | /playbooks/PBL-005_PAYMENT_INTEGRATION.md | Planned |
| PBL-006 | Payroll & Timesheets | /playbooks/PBL-006_PAYROLL.md | Planned |
| PBL-007 | Customer Self-Service | /playbooks/PBL-007_CUSTOMER_SELF_SERVICE.md | Planned |
| PBL-008 | Inventory Management | /playbooks/PBL-008_INVENTORY.md | Planned |
| PBL-009 | Reporting & Analytics | /playbooks/PBL-009_REPORTING.md | Planned |
| PBL-010 | Notification Systems | /playbooks/PBL-010_NOTIFICATIONS.md | Planned |
| PBL-011 | Mobile Offline Sync | /playbooks/PBL-011_MOBILE_OFFLINE.md | Planned |
| PBL-012 | Tenant & Organization Management | /playbooks/PBL-012_TENANT_MANAGEMENT.md | Planned |

---

## Cross-Reference Map

### Architecture Documents
- `ARCHITECTURE_OVERVIEW` → references `01_UNIFIED_SYSTEM_ARCHITECTURE`, `02_MONOREPO_STRUCTURE`, `03_TECH_ARCHITECTURE`
- `MODULE_DEPENDENCY_MAP` → references `20_NESTJS_MODULE_AND_TABLE_BLUEPRINT`, `28_NAV_ARCHITECTURE`

### Backend Documents
- `20_NESTJS_MODULE_AND_TABLE_BLUEPRINT` → referenced by `IMPLEMENTATION_PLAN`, `BUILD_RUNBOOK`
- `API_STANDARDS` → referenced by all API endpoint definitions
- `EVENT_ARCHITECTURE` → referenced by `29_ORDER_AND_QR_SPEC`, `34_NOTIFICATION_SYSTEM_SPEC`

### Frontend Documents
- `26_PRESSING_WEB_SPEC` → references `28_NAV_ARCHITECTURE`, `10_UI_UX_DESIGN_SYSTEM_GUIDE`
- `25_CUSTOMER_WEB_SPEC` → references `30_CUSTOMER_WEB_GAP_ANALYSIS`
- `28_NAV_ARCHITECTURE` → referenced by all frontend page specs

### Integration Documents
- `34_NOTIFICATION_SYSTEM_SPEC` → referenced by `31_GARMENT_LIFECYCLE_SRD`, `29_ORDER_AND_QR_SPEC`
- `32_DELIVERY_LOGISTICS_SPEC` → referenced by `26_PRESSING_WEB_SPEC`

---

## Document Status Legend

| Status | Meaning |
|--------|---------|
| Draft | Initial creation, not yet reviewed |
| Active | Current, approved, in use |
| Approved | Reviewed and accepted |
| Superseded | Replaced by newer version |
| Deprecated | No longer maintained |
| In Progress | Being actively updated |
