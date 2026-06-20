# vibecart-orders-ui (scm-ui)

Admin dashboard for Supply Chain Management — view and manage orders, track inventory, and manage warehouses.

**Port:** `3001`  
**React:** 19.2.7 | **Framework:** Create React App

---

## Features

- Order management table with search, sort, filter, and pagination
- Inventory tracking per SKU per warehouse
- Warehouse management
- Charts and dashboards for order/inventory analytics
- DataTables integration for large data sets

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `react` | 19.2.7 | UI framework |
| `react-router-dom` | 6.30.4 | Client-side routing |
| `@reduxjs/toolkit` | 2.12.0 | State management |
| `react-redux` | 9.3.0 | React–Redux bindings |
| `axios` | 1.7.5 | HTTP client |
| `bootstrap` | 5.3.8 | CSS framework |
| `react-bootstrap` | 2.10.10 | Bootstrap React components |
| `datatables.net` + `datatables.net-dt` | 2.1.5 | Advanced data tables |
| `jquery` | 3.7.1 | DataTables dependency |
| `react-table` | 7.8.0 | React table primitives |
| `react-paginate` | 8.3.0 | Pagination component |
| `react-spinners` | 0.14.1 | Loading indicators |
| `sweetalert2` | 11.13.2 | Alert dialogs |
| `@amcharts/amcharts5` | 5.18.0 | Charts |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3001)
npm start

# Production build
npm run build
```

---

## Environment Variables

Create a `.env` file in this directory:

```
PORT=3001
REACT_APP_API_URL=http://localhost:5001
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
```

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | API Gateway base URL |
| `PORT` | Dev server port |

---

## API Integration

```
Base URL: REACT_APP_API_URL
Orders:    /api/v1/vibe-cart/scm/orders/**
Inventory: /api/v1/vibe-cart/scm/inventory/**
Warehouse: /api/v1/vibe-cart/scm/warehouses/**
```

---

## Project Structure

```
src/
├── App.js
├── index.js
└── OMS/
    ├── Orders/       # Order list, detail, status updates
    ├── Inventory/    # Inventory grid and management
    └── Warehouse/    # Warehouse CRUD
```

---

## Notes

- `.npmrc` sets `legacy-peer-deps=true` — required because `react-spinners@0.14.1` and `react-split-pane@0.1.92` declare peer deps for React ≤18 but work correctly with React 19 at runtime.
