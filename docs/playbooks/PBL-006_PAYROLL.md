# Feature Playbook: Payroll & Timesheets

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** employees, payroll  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT  

## 1. Business Flow

### Overview
Track employee hours, calculate payroll, generate payslips, process payments.

### Actors
- **Employee**: Clocks in/out, views payslip
- **Manager**: Approves timesheets, reviews payroll
- **Payroll Admin**: Processes payroll, handles deductions

### Primary Flow

```
1. Employee clocks in at start of shift
2. Employee clocks out at end of shift
3. System calculates hours worked
4. Manager reviews and approves timesheet
5. Payroll period closes
6. System calculates gross pay, deductions, net pay
7. Payslip generated
8. Manager approves payroll
9. Payment processed
10. Payslip delivered to employee
```

---

## 2. UI Flow

### pressing-web: Timesheet

```
Employees → Timesheets Tab → Weekly View

Weekly View:
- Employee list
- Daily hours grid
- Total hours per employee
- Overtime highlighting
- Approval buttons
```

### pressing-web: Payroll

```
Payroll → Periods Tab → Payroll Detail

Payroll Detail:
- Period summary
- Employee list with calculations
- Gross, deductions, net
- Approval workflow
- Export to PDF/Excel
```

---

## 3. API Flow

### Clock In/Out

```
POST /api/v1/employees/:id/clock
Request:
{
  "action": "in",
  "timestamp": "2026-05-25T08:00:00Z",
  "location": {
    "latitude": 3.848,
    "longitude": 11.502
  }
}

Response:
{
  "shiftId": "uuid",
  "status": "checked_in",
  "message": "Clock-in successful"
}
```

### Process Payroll

```
POST /api/v1/payroll/periods/:id/process
Request:
{
  "approvedBy": "manager-uuid"
}

Response:
{
  "periodId": "uuid",
  "status": "processing",
  "payslipsGenerated": 25,
  "totalGross": 2500000,
  "totalNet": 1875000
}
```

---

## 4. Database Entities

### shifts
- id (uuid, PK)
- employee_id (uuid, FK)
- shift_date (date)
- start_time (timestamp)
- end_time (timestamp)
- break_minutes (int)
- status (enum)

### payroll_periods
- id (uuid, PK)
- tenant_id (uuid, FK)
- period_start (date)
- period_end (date)
- status (enum)
- total_gross (decimal)
- total_deductions (decimal)
- total_net (decimal)

### payslips
- id (uuid, PK)
- payroll_period_id (uuid, FK)
- employee_id (uuid, FK)
- gross_salary (decimal)
- total_deductions (decimal)
- net_salary (decimal)

---

## 5. Lifecycle States

```
Timesheet: scheduled → checked_in → checked_out → [approved | rejected]
Payroll: draft → processing → approved → paid → closed
```

---

## 6. Validations

- Clock-in before clock-out
- Minimum break time
- Maximum hours per day/week
- Manager approval required
- Deduction calculations correct

---

## 7. Permissions

| Role | Clock In/Out | View Timesheet | Approve Timesheet | Process Payroll |
|------|-------------|----------------|-------------------|-----------------|
| employee | ✅ (self) | ✅ (self) | ❌ | ❌ |
| manager | ❌ | ✅ (team) | ✅ | ✅ |
| admin | ❌ | ✅ (all) | ✅ | ✅ |

---

## 8. Failure Handling

| Failure | Handling |
|---------|----------|
| Forgot to clock in | Manager override, manual entry |
| Forgot to clock out | Auto clock-out after shift + 2h |
| Device offline | Queue clock event, sync later |
| Wrong location | Geo-fence warning, manager approval |
| Duplicate clock | Prevent, show last clock event |

---

## 9. Notifications

| Event | Recipient | Channel |
|-------|-----------|---------|
| Clock-in reminder | Employee | Push |
| Timesheet approved | Employee | Email |
| Payroll processed | Employee | Email + SMS |
| Payslip available | Employee | Email |

---

## 10. Edge Cases

- **Overtime**: >40h/week, different rate
- **Holiday pay**: Double rate for holidays
- **Sick leave**: Mark as sick, no pay or partial
- **Unpaid leave**: Deduct from days worked
- **Bonus**: One-time or recurring
- **Loan repayment**: Deduct from salary

---

## 11. Audit Requirements

- All clock events logged with GPS
- Timesheet changes tracked
- Payroll calculation details stored
- Approval chain recorded
- Payment confirmation logged

---

## 12. Reporting Implications

- Labor cost by department
- Overtime trends
- Absenteeism rate
- Payroll cost per order
- Employee cost efficiency

---

## 13. Mobile Considerations

- One-tap clock in/out
- GPS verification
- Shift reminders
- Payslip viewer
- Time-off requests
