## 🚀 IT-IMS Integration Guide - Smart Issue Assignment System

### 📋 Overview
This guide documents all the changes made to implement:
- **Smart issue assignment** based on technician category and availability
- **Two-step technician signup** with profile completion
- **Workload management** to prevent technician overload

---

## 🔄 Backend Changes

### 1. **User Model Updates** (`src/models/user.model.js`)
Added technician-specific fields:
```javascript
// New fields added:
- contactNo (String): Technician's contact number
- category (String): Specialization (Electrical, Plumbing, HVAC, Network, etc.)
- isAvailable (Boolean): Current availability status
- currentWorkload (Number): Count of active issues
- maxCapacity (Number): Max issues a technician can handle
- profileCompleted (Boolean): Track if technician completed setup
```

### 2. **Issue Assignment Service** (`src/services/issueAssignment.service.js`)
**New file** with core assignment logic:
- `assignTechnicianToIssue()`: Automatically assigns issues to best available technician
  - Matches issue category with technician category
  - Ensures technician is available
  - Checks if technician has capacity
  - Assigns to technician with LEAST workload (least busy)
  
- `unassignTechnicianFromIssue()`: Frees up technician when issue is resolved/closed
- `getAvailableTechniciansByCategory()`: Get all available technicians for a category
- `getTechnicianWorkload()`: Check technician's current load

### 3. **Technician Auth Controller** (`src/controllers/technicianAuth.controller.js`)
**Key Changes:**
- `signupTechnician()`: Now only requires (name, email, password, contactNo)
  - Sets `profileCompleted: false` initially
  - Returns token for redirect to profile completion page
  
- **NEW** `completeProfile()`: Updates technician's category and max capacity
  - Sets `profileCompleted: true`
  - Makes technician available for assignments

### 4. **Employee Issue Controller** (`src/controllers/employeeIssue.controller.js`)
**Key Changes:**
- `createIssue()`: Now auto-assigns technician after creating issue
  - Calls `assignTechnicianToIssue()`
  - Emits real-time notification to assigned technician
  
- `updateIssueStatus()`: Auto-unassigns technician when issue is resolved/closed
  - Calls `unassignTechnicianFromIssue()` when status = 'resolved' or 'closed'
  - Updates technician workload

### 5. **Available Technician Controller** (`src/controllers/availableTechnician.controller.js`)
**New file** with admin/query endpoints:
- `getAvailableTechnicians()`: Get available technicians for a category
- `getAllTechnicians()`: Admin view of all technicians
- `getTechnicianStats()`: Category-wise statistics

### 6. **Routes** 
**Updated:**
- `src/routes/technicianAuth.routes.js`: Added `/complete-profile` POST endpoint

**New:**
- `src/routes/availableTechnician.routes.js`:
  - GET `/api/technicians/available?category=Electrical`
  - GET `/api/technicians/all`
  - GET `/api/technicians/stats`

**Modified:**
- `src/app.js`: 
  - Registered new routes
  - Uncommented technician issue routes

---

## 🎨 Frontend Changes

### 1. **Signup Page** (`src/public/signup.html`)
**Changes:**
- Added dynamic contact number field (visible only for technicians)
- Added event listeners for role selection
- Contact field required only for technician signup

### 2. **Signup Script** (`src/public/signup.js`)
**Key Changes:**
- `toggleContactField()`: Show/hide contact field based on selected role
- For technicians: Redirects to profile completion after signup
- For employees: Redirects to login as before
- Stores token and user data in localStorage for technician redirect

### 3. **Profile Completion Page** (`src/public/technician-profile-completion.html`)
**New File** - Step 2 of technician signup:
- Category selection dropdown (Electrical, Plumbing, HVAC, Network, Maintenance, Security, Other)
- Max capacity input (1-50 issues)
- Helpful note about automatic assignment

### 4. **Profile Completion Script** (`src/public/technician-profile-completion.js`)
**New File**:
- Form validation
- Calls `/api/technician/auth/complete-profile` endpoint
- Redirects to technician dashboard after completion

---

## 📡 API Endpoints

### Technician Authentication
| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/technician/auth/signup` | POST | {name, email, password, contactNo} | {token, user} |
| `/api/technician/auth/complete-profile` | POST | {category, maxCapacity} | {user} |
| `/api/technician/auth/login` | POST | {email, password} | {token, user} |
| `/api/technician/auth/profile` | GET | - | {user} |

### Issue Management
| Endpoint | Method | Query/Body | Response |
|----------|--------|-----------|----------|
| `/api/employee/issues` | POST | {title, description, category, priority, location, images} | {issue, assignment} |
| `/api/employee/issues/{id}` | GET | - | {issue} |
| `/api/employee/issues/{id}/status` | PATCH | {status} | {issue} |

### Technician Queries
| Endpoint | Method | Query/Params | Response |
|----------|--------|------------|----------|
| `/api/technicians/available` | GET | ?category=Electrical | {technicians} |
| `/api/technicians/all` | GET | - | {technicians} |
| `/api/technicians/stats` | GET | - | {stats} |

---

## 🔌 Smart Assignment Algorithm

```
When Issue is Created:
1. Extract issue.category (e.g., "Electrical")
2. Find all technicians where:
   - role = "technician"
   - category = issue.category
   - isAvailable = true
   - profileCompleted = true
   - currentWorkload < maxCapacity
3. Sort by currentWorkload (ascending - least busy first)
4. Assign to technician[0] (least busy)
5. Update:
   - issue.assignedTechnician = technician._id
   - issue.status = "assigned"
   - technician.currentWorkload += 1
   - If currentWorkload >= maxCapacity: technician.isAvailable = false
6. Emit real-time notification to technician
```

```
When Issue is Resolved/Closed:
1. Get assigned technician
2. Decrement technician.currentWorkload
3. If currentWorkload < maxCapacity: technician.isAvailable = true
4. Update issue.assignedTechnician = null
```

---

## 🎯 Testing Checklist

### Backend Testing
- [ ] POST `/api/technician/auth/signup` with {name, email, password, contactNo}
- [ ] Verify token returned
- [ ] POST `/api/technician/auth/complete-profile` with {category, maxCapacity}
- [ ] Verify profileCompleted = true
- [ ] POST `/api/employee/issues` and verify auto-assignment
- [ ] Check that least-busy technician is assigned
- [ ] Verify technician workload increases
- [ ] Create issue when technician at max capacity - should not assign
- [ ] PATCH issue to 'resolved' status - technician should be unassigned
- [ ] GET `/api/technicians/available?category=Electrical` - returns correct technicians
- [ ] GET `/api/technicians/stats` - shows category-wise statistics

### Frontend Testing
- [ ] Signup as Employee - no contact field shown
- [ ] Signup as Technician - contact field appears and required
- [ ] Complete technician signup - redirected to profile completion page
- [ ] Fill profile completion form - category and capacity saved
- [ ] Verify token stored in localStorage
- [ ] After profile completion - redirected to technician dashboard

---

## 📊 Database Structure

### User Document (Technician)
```javascript
{
  _id: ObjectId,
  name: "John Technician",
  email: "john@tech.com",
  contactNo: "+91 98765 43210",
  password: "hashed_password",
  role: "technician",
  category: "Electrical",        // NEW
  profileCompleted: true,        // NEW
  isAvailable: true,             // NEW
  currentWorkload: 3,            // NEW
  maxCapacity: 10,               // NEW
  rating: 4.5,
  totalReviews: 12,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Issue Document
```javascript
{
  _id: ObjectId,
  title: "Broken Power Socket",
  description: "Power socket in cabin 3 not working",
  category: "Electrical",        // Matches technician.category
  priority: "Urgent",
  location: "Cabin 3",
  assignedTechnician: ObjectId,  // Auto-assigned
  status: "assigned",            // Updated to 'assigned' after assignment
  createdBy: ObjectId,
  timeline: [
    { status: "open", timestamp: Date },
    { status: "assigned", timestamp: Date, note: "Assigned to John Technician" },
    ...
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## ⚙️ Configuration Notes

### Environment Variables
Ensure these are set in `.env`:
```
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Default Values
- Default max capacity: 10 issues
- Available categories: Electrical, Plumbing, HVAC, Network, Maintenance, Security, Other

---

## 🚨 Important Notes

1. **Google Auth Integration**: Current setup is ready for Google OAuth. After implementing Google auth, the signup flow can be modified to only collect basic info, with profile completion as the second step.

2. **Real-time Notifications**: When an issue is assigned to a technician, a Socket.IO event is emitted:
   ```javascript
   io.to(`technician_${technicianId}`).emit("newIssueAssigned", {issueId, title, category, priority})
   ```

3. **Workload Management**: The system uses `currentWorkload < maxCapacity` to determine availability. Both employees and admins can see technician workload via the technician details endpoints.

4. **Future Enhancements**:
   - Add skills-based matching (not just category)
   - Add priority-based assignment (urgent issues to most experienced)
   - Add location-based routing
   - Add estimated time-to-complete (ETC)
   - Add reassignment logic if technician becomes unavailable

---

## 📚 File Summary

### New Files Created
1. `src/services/issueAssignment.service.js` - Core assignment logic
2. `src/controllers/availableTechnician.controller.js` - Technician queries
3. `src/routes/availableTechnician.routes.js` - Technician API routes
4. `src/public/technician-profile-completion.html` - Profile completion UI
5. `src/public/technician-profile-completion.js` - Profile completion logic

### Modified Files
1. `src/models/user.model.js` - Added technician fields
2. `src/controllers/technicianAuth.controller.js` - New complete-profile endpoint
3. `src/controllers/employeeIssue.controller.js` - Auto-assignment logic
4. `src/routes/technicianAuth.routes.js` - Added complete-profile route
5. `src/public/signup.html` - Added contact field
6. `src/public/signup.js` - Handle technician redirect
7. `src/app.js` - Register new routes

---

## 🔗 Quick Links

- **Assignment Logic**: `src/services/issueAssignment.service.js`
- **Technician Signup**: `src/controllers/technicianAuth.controller.js`
- **Auto-Assignment**: `src/controllers/employeeIssue.controller.js` (createIssue function)
- **Profile Completion**: `src/public/technician-profile-completion.html` & `.js`
