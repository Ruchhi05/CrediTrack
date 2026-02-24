# CrediTrack – Full Stack Expense Tracker

CrediTrack is a full-stack expense tracking web application that allows users to manage income and expenses securely with authentication, filtering, analytics, and data visualization.

---

##  Features

-  User Authentication (JWT based login & register)
-  Add Income & Expenses
-  Category-based tracking
-  Search transactions
-  Filter (All / Income / Expense)
-  Sort (Newest, Oldest, High to Low, Low to High)
-  Spending Breakdown Analytics
-  Dynamic Pie Chart (Chart.js)
-  Edit Transactions
-  Delete with Confirmation Modal
-  Real-time Balance Calculation
-  Protected API Routes using Middleware

---

##  Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js

---

##  Project Structure

```
CrediTrack/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── frontend/
├── server.js
├── package.json
└── README.md
```

---

##  Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Ruchi05/CrediTrack.git
cd CrediTrack
```

### 2. Install dependencies

```
npm install
```

### 3. Create a .env file

Create a `.env` file in the root folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the server

```
node server.js
```

Server will run on:

```
http://localhost:5000
```

---

##  Learning Highlights

- Implemented MVC architecture
- Built secure authentication system
- Managed async API handling
- Developed analytics dashboard
- Applied filtering & sorting logic
- Structured modular backend

---

##  Future Improvements

- Deploy backend (Render/Railway)
- Deploy frontend (Vercel/Netlify)
- Add pagination
- Add monthly reports
- Add downloadable expense reports

---

## 👩 Author

Ruchi  
B.Tech Computer Science Student  
Aspiring Full Stack Developer

---

⭐ If you like this project, consider giving it a star!