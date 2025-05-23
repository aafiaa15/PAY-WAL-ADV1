

A full-stack digital wallet application built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and **TailwindCSS**, designed to simulate core features of a platform like Paytm. It supports secure user authentication, wallet operations, transaction history, and basic fraud detection logic.

---

## 🚀 Features

### 1. 🔐 User Authentication & Session Management
- Secure **user registration and login**
- Passwords hashed using **bcrypt**
- Authentication via **JWT tokens**
- Protected backend routes with **middleware**
- Session persistence using **localStorage**

### 2. 💳 Wallet Operations
- Deposit & withdraw **virtual cash**
- **P2P transfers** between users
- Detailed **transaction history**
- Support for **currency abstraction** (multiple digital currencies – optional)

### 3. 🧮 Transaction Processing & Validation
- Ensures **atomicity**: debits and credits handled securely
- Real-time validations:
  - Prevent **overdrafts**
  - No **negative deposits** or invalid transfers

### 4. ⚠️ Basic Fraud Detection Logic
- Detect suspicious activity with simple rule-based checks:
  - Multiple transfers in a short time
  - Sudden large withdrawals
- Anomalies flagged with **logs/mock alerts** for review

### 5. 🛡️ Admin & Reporting APIs
- Dedicated admin endpoints for:
  - Viewing **flagged/suspicious transactions**
  - Aggregating **total balances** across users
  - Viewing **top users** by wallet balance or transaction volume


---

## 🛠️ Tech Stack

| Technology      | Role                  |
|-----------------|-----------------------|
| React.js        | Frontend UI           |
| TailwindCSS     | UI Styling            |
| Node.js         | Backend Runtime       |
| Express.js      | API Server            |
| MongoDB         | Database              |
| Mongoose        | ODM for MongoDB       |
| JWT             | Authentication Tokens |
| bcrypt          | Password Hashing      |
| Axios           | API Communication     |

---

## 📂 Folder Structure

```

/client       → React frontend (TailwindCSS, axios)
/server       → Node.js backend (Express, MongoDB)
/models       → Mongoose schema definitions
/routes       → Auth, wallet, and transaction endpoints
/middleware   → Auth protection logic

````

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/paytm-wallet-clone.git
cd paytm-wallet-clone
````

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

* Set environment variables in `.env`:

  ```
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  ```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 📸 UI Highlights

* Clean, responsive UI using TailwindCSS
* Animated transaction history using `framer-motion`
* Dynamic filters: view all/sent/received transactions
* Visual fraud flags for suspicious transactions

---

## 📌 Future Improvements

* Role-based access (admin/user)
* Graphical transaction insights
* Notification system for suspicious activities
* Real-time updates using WebSockets

---
VIDEO LINK= https://drive.google.com/file/d/1HapqJgdahsXBcYrSYk2hWY-fPBHf-2VP/view?usp=drive_link
