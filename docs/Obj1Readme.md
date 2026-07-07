# Objective #1: Automated Tenancy, Billing, and Guest Management System

**Owner (Member Name):** John Aron M. Caay

## Objective Title

**Automated Tenancy, Billing, and Guest Management System**

## Objective Description

This objective focuses on implementing automated notifications and AI-driven recommendation features. The system provides alerts for due and overdue payments, lease expirations, room availability, maintenance requests, and high-risk tenants. It also generates recommendations to help apartment owners improve revenue collection, reduce losses, and optimize room occupancy using historical apartment performance data.

---

# 6-Week Task Breakdown

## Week 1 - Day 1
### Task Description
**Create Landing Page**

#### Sub-Tasks
- Text fields
- Buttons
- Header

#### Deliverables
- Email and Password text field
- Sign-in and Continue as a Guest button
- Header Title

#### Test Suite / PR Acceptance Criteria
- It should allow the user to enter an email.
- It should call `onSubmit` when the button is clicked.
- It should render the header title.

---

## Week 2 - Day 1
### Task Description
**Creating Customer Service Widget**

#### Sub-Tasks
- Customer Service Button Widget
- Customer Service Window
- Option Buttons

#### Deliverables
- Customer Service Widget
- Customer Service Window
- Option Buttons

#### Test Suite / PR Acceptance Criteria
- It should render the Customer Service widget successfully.
- It should display the Customer Service window when the widget is clicked.
- It should display the Inquiry, Maintenance, and Other option buttons successfully.

---

## Week 2 - Day 2
### Task Description
**Customer Service Option Button Forms**

#### Sub-Tasks
- Text fields for Inquiries
- Text fields for Maintenance
- Text fields for Other

#### Deliverables
- Inquiry Form
- Maintenance Form
- Other Form

#### Test Suite / PR Acceptance Criteria
- It should render the Inquiry form with all required input fields.
- It should render the Maintenance form with all required input fields.
- It should render the Other form with all required input fields.

---

## Week 3 - Day 1

### Task Description

**Tenant Portal & Implement Tenant Portal Backend**

#### Sub-Tasks

- Create Tenant Header/Sub-Header
- Create My Room, Monthly Rent, and Next Due
- Display Payment History by Month
- Implement Tenant Model
- Implement Tenant Service
- Implement Tenant Service Unit Tests

#### Deliverables

- Tenant Header/Sub-Header
- My Room, Monthly Rent, and Next Due Cards
- Payment History
- Tenant Model
- Tenant Service
- Tenant Service Test

#### Test Suite / PR Acceptance Criteria

- It should render the Tenant Header and Sub-Header correctly.
- It should display the tenant's assigned room number, monthly rent amount, and next payment due date correctly.
- It should display the tenant's payment history grouped by month correctly.
- It should retrieve tenant information from the data source successfully.
- It should return the tenant's room number, monthly rent, next due date, and payment history correctly.
- It should pass all Tenant Service Vitest unit tests successfully.

---

## Week 3 - Day 2
### Task Description
**Guest Access Module with Database Integration**

#### Sub-Tasks
- Create Guest UI
- Create inquiry form and connect it to the database
- Save guest inquiries

#### Deliverables
- Guest UI
- Inquiry Database Connection
- Guest Inquiry Records

#### Test Suite / PR Acceptance Criteria
- It should display available rooms, rates, and room descriptions correctly on the guest interface.
- It should allow guests to submit inquiries through the inquiry form and store the submitted data in the database successfully.
- It should retrieve and display saved guest inquiry records accurately in the administrator dashboard.

---

## Week 4 - Day 1
### Task Description
**Implement Bill Display with Database Integration**

#### Sub-Tasks
- Retrieve billing records from the database
- Display tenant bills
- Display outstanding balances

#### Deliverables
- Billing Data Integration
- Bill Display Interface
- Outstanding Balance View

#### Test Suite / PR Acceptance Criteria
- It should retrieve billing records associated with the logged-in tenant from the database successfully.
- It should display billing details including billing period, due date, amount due, and payment status accurately.
- It should calculate and display the tenant's outstanding balance based on unpaid billing records correctly.

---

## Week 4 - Day 2
### Task Description
**Implement Billing Management**

#### Sub-Tasks
- Generate bills
- Track balances
- Store billing records

#### Deliverables
- Bill Generation Module
- Balance Tracking Module
- Billing Records

#### Test Suite / PR Acceptance Criteria
- It should generate billing records for assigned tenants based on their room rates successfully.
- It should calculate and track tenant balances accurately after bill generation.
- It should store billing records including billing period, due date, amount due, and payment status in the database successfully.

---

## Week 5 - Day 1
### Task Description
**Implement Payment Recording**

#### Sub-Tasks
- Record payments
- Update balances
- Maintain payment history

#### Deliverables
- Payment Recording Module
- Balance Update Module
- Payment History Records

#### Test Suite / PR Acceptance Criteria
- It should allow administrators to record received tenant payments successfully.
- It should automatically update the tenant's outstanding balance after a payment is recorded.
- It should store payment details including payment date, amount paid, and payment status in the payment history records successfully.

---

## Week 5 - Day 2
### Task Description
**Integrate Management Modules**

#### Sub-Tasks
- Connect room and tenant modules
- Connect billing and payment records
- Synchronize data across modules

#### Deliverables
- Room & Tenant Integration
- Billing & Payment Record Integration
- Synchronized Data Flow

#### Test Suite / PR Acceptance Criteria
- It should automatically update room occupancy information when a tenant is assigned or removed from a room.
- It should automatically update billing records and tenant balances when a payment is recorded by the administrator.
- It should synchronize room, tenant, billing, payment, and inquiry data correctly across all connected modules.

---

## Week 6 - Day 1
### Task Description
**Finalize Dashboard & Testing**

#### Sub-Tasks
- Display dashboard summaries
- Improve interface

#### Deliverables
- Dashboard Summary View
- Improved User Interface

#### Test Suite / PR Acceptance Criteria
- It should display accurate occupancy, tenant, billing, and payment summaries based on the latest system records.
- It should provide a responsive, user-friendly, and fully functional interface across all system modules.