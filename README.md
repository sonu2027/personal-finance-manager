# Personal Finance Manager

Track income, expenses, and budgets in one simple and secure full-stack app.

# Tech Stack

- Frontend: <br>
  React + TailwindCSS <br>
  Chart.js and Recharts for data visualization

- Backend: <br>
  Node.js + Express <br>
  MongoDB + Mongoose <br>
  JWT Auth for authentication <br>
  Bcrypt for password hashing <br>
  REST APIs

# Core Features

- User Authentication: JWT-based register/login, secure password hashing
- Transaction Management: CRUD for income & expenses with categories
- Budget Management: Set per-category budgets & receive alerts
- Data Visualization: Charts to track spending trends
- Responsive UI: Works across devices
- Validation & Error Handling: Frontend + backend validation

# Demo

- Frontend: https://managepersonalfinance.vercel.app/login
- Backend: https://personal-finance-manager-chos.vercel.app

# Folder Structure
```bash
personal-finance-manager/
│
├── backend/
│ ├── src/
│ │ ├── controllers/ # Route handlers (User, Transaction, Budget)
│ │ ├── middlewares/ # Auth middleware, error handling
│ │ ├── models/ # Mongoose schemas
│ │ ├── routes/ # Express routes
│ │ ├── app.js # Express app entry point
│ │ ├── connectDB.js # MongoDB connection logic
│ │ └── constant.js # Constants (roles, messages, etc.)
│ │
│ ├── .env # Environment variables (ignored in Git)
│ ├── .env.sample # Sample environment file
│ ├── index.js # Server entry point
│ ├── package.json
│ ├── package-lock.json
│ └── vercel.json # Deployment config (for Vercel)
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── databaseCall/ # API call functions
│ │ ├── pages/ # App pages (Login, Register, Dashboard)
│ │ ├── App.css
│ │ ├── App.jsx
│ │ ├── Routing.jsx # React Router setup
│ │ ├── index.css
│ │ └── main.jsx # React app entry point
│ │
│ ├── .env # Frontend environment variables
│ ├── .gitignore
│ ├── README.md
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── vercel.json # Deployment config (for Vercel)
│ └── vite.config.js # Vite configuration
│
└── README.md
```

# Setup Instructions

- git clone https://github.com/sonu2027/personal-finance-manager.git

Backend

- cd backend
- npm install
- npm run dev

Frontend

- cd frontend
- npm install
- npm run dev
- Make sure frontend is running at http://localhost:5173

# .env

- You don't need to create .env beacuse I haven't keep it on .gitignore

# API Endpoints

- User <br>
POST /api/auth/register <br>
Body: { fullName, email, password } <br>

POST /api/auth/login <br>

POST /api/user/verifyemail <br>
Body: JSON.stringify({ email }) <br>

PUT /api/user/updatepassword <br>
Body: JSON.stringify({ email, password }) <br>

POST /api/user/register <br>
Body: { email, password } <br>

POST /api/user/sendemailverificationotp <br>
Body: JSON.stringify(data) <br>

Response: { token, user } <br>

GET /api/user/getincome <br>

GET /api/user/login <br>

- Transactions <br>
Post /api/transaction/createtransaction <br>
Body: JSON.stringify(data) <br>

DELETE /api/transaction/deletetransaction/${transactionId} <br>

PUT /api/transaction/updatetransaction <br>
Body: JSON.stringify(data) <br>

GET /api/budget/fetchbudget <br>

GET /api/transaction/fetchtransaction <br>

GET /api/transactions <br>

POST /api/transactions <br>
Body: { description, amount, type, category, date } <br>

PUT /api/transactions/:id <br>

DELETE /api/transactions/:id <br>

- Budgets <br>
POST /api/budget/createbudget <br>
Body: body: JSON.stringify(data) <br>

DELETE /api/budget/deletebudget/${budgetId} <br>

PUT /api/budget/updatebudget <br>
Body: JSON.stringify(data) <br>

GET /api/budgets <br>

POST /api/budgets <br>
Body: { category, limit } <br>

PUT /api/user/updateincome <br>
Body: JSON.stringify({ income }) <br>

GET /api/budgets/alerts <br>