
# 🧾 Web App PRD

---

<details>
<summary>🏠 A. Homepage</summary>

### 1. Import Data

#### 1.1. Add Transaction

- **Step 1 (Front End): Raw Input**
  - Paste from Google Sheets or Excel into a text area.
  - Click `Next` → go to Direct Table Editor.
  - Required columns:
    - Date
    - Customer Name
    - Debt Increase
    - Debt Decrease
    - Branch
    - Bank Account
    - Note  
  > 🔸 Use Direct Table Editor if raw input causes issues.

- **Step 2 (Back End): Data Cleaning**
  - Remove quotes, commas: `"John Doe"` → `John Doe`
  - Date auto-format: `15/07` → `15/07/2025`

- **Step 3 (Front End): Direct Table Editor**
  - `contentEditable` preview table
  - Changes update `previewData` array

- **Error Handling & Highlighting**
  - Red fill for:
    - Invalid date (future or >5 years old)
    - Invalid name (`z`, `j`, or `0-9`)
    - Negative amount

- **Add New Customer Button**
  - Appears for unmatched names
  - Opens modal → save info → refresh customer & transaction list

---

#### 1.2. Add New Customer

- **Step 1 (Front End): Raw Input**
  - Paste table with:
    - Customer ID
    - Customer Name
    - Customer Address
    - Phone Number
    - How to Contact

- **Step 2 & 3**
  - Data cleaning and direct table editing (same as transaction import)

---

#### 1.3 & 1.4. Import via Excel/CSV

- Supports import by Excel or CSV files:
  - `1.3`: New customers
  - `1.4`: Transactions

---

### 2. Dashboard

#### 2.1. Key Metrics (Card)

- Visuals:
  - Total Outstanding Balance _(compare to last period)_
  - Balance by Branch _(card)_
  - Balance by Bank Account _(column chart)_
  - Cashflow over Time _(Waterfall chart)_

> 💡 Balance = Initial + Increase - Decrease  
> 🔗 [Waterfall Chart Reference](https://foresightbi.com.ng/data-visualization/how-to-use-waterfall-charts-in-power-bi/)

- **Slicer Button**:
  - Select time range: Day / Week / Month / Quarter

---

#### 2.2. Detailed Lists

- Visuals:
  - 5 most recent transactions
  - Top 5 customers with highest outstanding balance

- **Dropdown Controls**:
  - Choose 5, 10, 15, 20 items for both lists

---

### 3. Export Report (from Dashboard)

- **Download Options**:
  - Key Metrics Summary (table format)
  - All Transactions
  - All Customer Balances

> 🧾 Each option generates an `.xlsx` sheet.  
> Example: select 3 checkboxes → output 3 sheets

---

### 4. Menu / Navigation Pane

- **Menu Items**:
  1. Homepage
  2. Customer List
  3. Branches
  4. Bank Account

- Each with a **SVG icon** for easy navigation

</details>

---

<details>
<summary>👥 B. Customer List</summary>

### 1. List

- Columns:
  - Customer ID
  - Customer Name
  - Phone Number
  - Contact Method
  - Outstanding Balance _(sortable)_
  - Last Transaction Date _(sortable)_

- **Action Button** (right side, 3-line icon):
  - Shows pop-up with history:
    - Customer info
    - Amount (+/-)
    - Date, balance, branch, bank
    - Sortable fields
    - Conditional formatting:
      - 🔴 Negative = red
      - 🟢 Positive = green

---

### 2. Search

- **Search Box**:
  - Free text: ID, name, phone, transaction date, branch, etc.
  - Suggestions: full matches (e.g. full ID, name, phone)

- **Date Selection**:
  - Calendar dropdown
  - Supports range filter (from...to)

---

### 3. Export

- **Export Options**:
  - Option 1: Download selected (based on filters)
  - Option 2: Download all
  - Checkbox: Include historical data per customer?

</details>
