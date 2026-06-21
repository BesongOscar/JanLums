# Feature Playbook: Reporting & Analytics

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** reports  
**Implementation Status:** Planned  
**Dependencies:** All modules  

## 1. Business Flow

### Overview
Generate reports and dashboards for business intelligence, operational efficiency, and financial analysis.

### Report Categories

| Category | Reports | Audience |
|----------|---------|----------|
| Financial | Revenue, profit, costs | Management |
| Operational | Orders, processing times | Operations |
| Customer | Acquisition, retention, satisfaction | Marketing |
| Employee | Productivity, attendance | HR |
| Inventory | Stock levels, usage | Operations |

---

## 2. UI Flow

### pressing-web: Reports

```
Reports Page → Category Tabs → Report View

Report View:
- Date range selector
- Filter options
- Chart visualization
- Data table
- Export buttons (PDF, Excel, CSV)
```

### Dashboard

```
Dashboard Page → KPI Cards → Charts

KPI Cards:
- Orders today
- Revenue today
- Active customers
- Garments in process
- Ready for pickup
- Pending deliveries

Charts:
- Revenue trend (line)
- Orders by hour (bar)
- Top services (pie)
- Customer growth (area)
```

---

## 3. API Flow

### Generate Report

```
POST /api/v1/reports/generate
Request:
{
  "type": "revenue",
  "dateRange": {
    "start": "2026-05-01",
    "end": "2026-05-31"
  },
  "groupBy": "day",
  "filters": {
    "branchId": "uuid",
    "serviceTypeId": "uuid"
  }
}

Response:
{
  "data": [
    {
      "date": "2026-05-01",
      "revenue": 125000,
      "orders": 25,
      "averageOrderValue": 5000
    }
  ],
  "summary": {
    "totalRevenue": 3750000,
    "totalOrders": 750
  }
}
```

---

## 4. Database

### Read-Only Aggregates

Reports query from:
- orders
- order_items
- payments
- customers
- employees
- inventory_transactions

### Materialized Views

For performance:
```sql
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT 
  DATE(created_at) as date,
  SUM(total_amount) as revenue,
  COUNT(*) as orders
FROM orders
GROUP BY DATE(created_at);
```

---

## 5. Permissions

| Role | View Reports | Export Reports | Configure Dashboards |
|------|-------------|----------------|---------------------|
| manager | ✅ (own branch) | ✅ | ❌ |
| admin | ✅ (all) | ✅ | ✅ |
| employee | ❌ | ❌ | ❌ |

---

## 6. Scheduled Reports

| Report | Frequency | Recipients |
|--------|-----------|------------|
| Daily Summary | Daily 08:00 | Managers |
| Weekly Performance | Monday 08:00 | Management |
| Monthly P&L | 1st of month | Finance |
| Quarterly Review | Quarterly | Stakeholders |

---

## 7. Export Formats

- PDF (formatted report)
- Excel (data with charts)
- CSV (raw data)
- JSON (API response)

---

## 8. Edge Cases

- **No data**: Show empty state with suggestions
- **Large datasets**: Paginate, limit to 10k rows
- **Date ranges**: Max 1 year per request
- **Real-time**: Cache for 5 minutes
