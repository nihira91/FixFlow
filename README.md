# 🔧 FixFlow: Intelligent Issue Management System

---

## 📋 Overview

FixFlow is a full-stack issue management system designed for IT support teams. It automates the assignment of support tickets to the most suitable technician based on their specialization, availability, and current workload.

**Perfect for:** IT departments, support teams, helpdesk operations, facility management systems

---

## ✨ Features

### 🤖 Smart Assignment Engine
- **Category-based matching**: Issues automatically assigned to technicians specializing in that area
- **Load balancing**: Assigns to the least busy technician with available capacity
- **Availability tracking**: Only assigns to technicians who are currently available
- **Capacity management**: Prevents technician overload with configurable max issue limits

### 👥 Dual User Roles
- **Employees**: Create support tickets and track their resolution
- **Technicians**: View assigned issues and update their status
- **Admins**: Monitor technician availability and workload statistics

### 📱 Real-Time Features
- Live issue assignment notifications via Socket.IO
- Real-time technician dashboard updates
- Instant workload tracking
- Bi-directional communication between frontend and backend

### 🔐 Security
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers

### 📊 Dashboard & Reporting
- Technician workload dashboard
- Available technicians list with category filters
- Issue statistics and analytics
- Real-time status tracking

### ⏰ SLA (Service Level Agreement) Tracking
- **Priority-based SLAs**: Different response and resolution times for Critical, Urgent, Risky, Routine
- **Real-time monitoring**: Tracks SLA status (Pending, Met, Breached)
- **Visual indicators**: Progress bars showing time remaining
- **Escalation alerts**: Automatic notifications when SLA is about to breach
- **Response & Resolution tracking**: Separate timers for first response and complete resolution

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn
- A code editor (VS Code recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/IT-IMS.git
cd The_Four_Variables
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/it-ims
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Start the backend server**
```bash
# Development with auto-reload
npm run dev

# Or production
npm start
```

Expected output:
```
✅ MongoDB connected
🚀 Unified Backend running on port 5000
✔ technicianAuth.routes.js
✔ technicianIssue.routes.js
✔ availableTechnician.routes.js
```

5. **Serve frontend (in another terminal)**
```bash
# Using Python 3
python -m http.server 3000 --directory ./src/public

# Or using Node
npx http-server ./src/public -p 3000
```

6. **Access the application**
Open your browser and navigate to: `http://localhost:3000`

---

## 🧪 Testing the System

### Quick Test Workflow

1. **Technician Signup**
   - Go to `http://localhost:3000/signup.html`
   - Select "Technician" role
   - Fill in: Name, Email, Password, Contact Number
   - Click Signup → Redirects to profile completion

2. **Complete Technician Profile**
   - Select Category (e.g., "Electrical")
   - Set Max Capacity (e.g., 5 issues)
   - Click Save → Dashboard ready

3. **Employee Signup**
   - Go to `http://localhost:3000/signup.html`
   - Select "Employee" role
   - Fill in: Name, Email, Password
   - Login and proceed to dashboard

4. **Create an Issue**
   - Navigate to Employee Dashboard
   - Click "Create Issue"
   - Category: Select the same category as your technician (e.g., "Electrical")
   - Add Title, Description, Location, Priority
   - Submit

5. **Watch Auto-Assignment**
   - Check server logs → Should see assignment confirmation
   - Technician dashboard updates automatically
   - Issue appears in technician's "Assigned Tasks"

### Expected Results
```
Employee creates issue (Electrical category)
    ↓
Backend finds available technicians (Electrical)
    ↓
Assigns to technician with least workload
    ↓
Socket.IO sends real-time notification
    ↓
Technician dashboard updates automatically
    ↓
Status visible in both employee & technician views
```

---

## 🏗️ Architecture

### System Overview
```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│    EMPLOYEE     │         │     BACKEND      │         │   TECHNICIAN     │
├─────────────────┤         ├──────────────────┤         ├──────────────────┤
│ • Create Issue  │────────→│ • Validates      │         │ • View Issues    │
│ • View Status   │         │ • Auto-assigns   │────────→│ • Update Status  │
│ • Dashboard     │←────────│ • Real-time      │         │ • Profile        │
│ • Profile       │         │ • Notifications  │←────────│ • Dashboard      │
└─────────────────┘         └──────────────────┘         └──────────────────┘
                                    │
                                    │
                            ┌───────┴──────────┐
                            │   MONGODB        │
                            │ • Users          │
                            │ • Issues         │
                            │ • Comments       │
                            │ • Notifications  │
                            └──────────────────┘
```

### Tech Stack
| Component | Technology |
|-----------|------------|
| **Backend Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Real-time** | Socket.IO |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Security** | bcryptjs |
| **Middleware** | Morgan, Helmet, CORS |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Process Manager** | Nodemon (development) |

---

## 📁 Project Structure

```
The_Four_Variables/
├── src/
│   ├── controllers/          # Business logic controllers
│   │   ├── authcontroller.js
│   │   ├── technicianAuth.controller.js
│   │   ├── employeeIssue.controller.js
│   │   ├── availableTechnician.controller.js
│   │   └── ...
│   ├── models/               # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── issue.model.js
│   │   ├── comment.model.js
│   │   └── ...
│   ├── routes/               # API endpoints
│   │   ├── technicianAuth.routes.js
│   │   ├── availableTechnician.routes.js
│   │   ├── employeeIssue.routes.js
│   │   └── ...
│   ├── middlewares/          # Authentication & error handling
│   │   ├── authmiddleware.js
│   │   ├── rolemiddleware.js
│   │   └── errormiddleware.js
│   ├── services/             # Reusable business logic
│   │   └── issueAssignment.service.js
│   ├── config/               # Configuration files
│   │   ├── db.js
│   │   └── sla.config.js
│   ├── public/               # Frontend (HTML, CSS, JS)
│   │   ├── index.html
│   │   ├── signup.html
│   │   ├── login.html
│   │   ├── Employee.html
│   │   ├── technician-profile-completion.html
│   │   └── ...
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   └── socket.js             # Socket.IO configuration
├── package.json
├── .env                      # Environment variables (create this)
└── README.md                 # This file
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/technician/signup` | Register new technician |
| POST | `/api/auth/technician/complete-profile` | Complete technician setup |
| POST | `/api/auth/technician/login` | Technician login |
| POST | `/api/auth/employee/signup` | Register new employee |
| POST | `/api/auth/employee/login` | Employee login |

### Issues
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employee/issues` | Get employee's issues |
| POST | `/api/employee/issues` | Create new issue (auto-assigned) |
| PUT | `/api/employee/issues/:id` | Update issue status |
| GET | `/api/technician/issues/assigned` | Get assigned issues |
| PUT | `/api/technician/issues/:id/status` | Update issue status |

### Technician Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/technicians/available?category=X` | Get available technicians |
| GET | `/api/technicians/all` | Get all technicians (admin) |
| GET | `/api/technicians/stats` | Get technician statistics |

---

## 🔑 Key Features Explained

### Smart Assignment Algorithm
When an employee creates an issue:
1. ✅ Validates the issue category
2. ✅ Finds all technicians in that category
3. ✅ Filters for: available + profile completed + has capacity
4. ✅ Selects technician with LEAST current workload
5. ✅ Updates technician's workload counter
6. ✅ Sends real-time notification via Socket.IO

### Two-Step Technician Signup
**Step 1 (Signup)**
- Collects: Name, Email, Password, Contact Number
- Creates user account with `profileCompleted: false`

**Step 2 (Profile Completion)**
- Collects: Specialization Category, Max Capacity
- Sets `profileCompleted: true`
- Now available for assignments

### Workload Management
- **Tracks**: Number of active (open/in-progress) issues
- **Prevents**: Assignment when workload ≥ maxCapacity
- **Auto-updates**: Decrements when issue is resolved/closed
- **Flexibility**: Technicians can edit their max capacity anytime

### SLA Tracking System
Priority-based Service Level Agreements with automatic tracking:

| Priority | Response Time | Resolution Time | Escalation Alert |
|----------|---------------|-----------------|-----------------|
| **Critical** | 30 minutes | 2 hours | 90 minutes |
| **Urgent** | 1 hour | 8 hours | 6 hours |
| **Risky** | 4 hours | 24 hours | 18 hours |
| **Routine** | 8 hours | 48 hours | 36 hours |

**Features:**
- Real-time SLA status monitoring (Pending → Met → Breached)
- Visual progress bars showing time remaining
- Automatic escalation alerts when approaching deadline
- Separate tracking for first response and complete resolution
- SLA widget for easy integration into issue details pages


<div align="center">

**Made with ❤️ by the FixFlow Team**

</div>
