## 🧪 Frontend Testing Guide - Real-Time Dashboard

### Prerequisites
✅ Backend running on port 5000
✅ MongoDB connected
✅ Socket.IO initialized

### Test Case 1: Employee Signup → Create Issue → Technician Auto-Assignment

#### Step 1A: Employee Signup
```
1. Go to http://localhost:3000/signup.html
2. Select "Employee" (contact field hidden)
3. Fill form:
   - Name: John Employee
   - Email: employee@test.com
   - Password: Secure@123
   - Confirm: Secure@123
4. Click CREATE ACCOUNT
5. Should redirect to login.html
```

#### Step 1B: Technician Signup & Profile
```
1. Go to http://localhost:3000/signup.html
2. Select "Technician" (contact field appears)
3. Fill form:
   - Name: Raj Technician
   - Email: technician@test.com
   - Password: Secure@123
   - Confirm: Secure@123
   - Contact: +91 98765 43210
4. Click CREATE ACCOUNT
5. Redirects to technician-profile-completion.html
6. Fill profile:
   - Category: Electrical
   - Max Capacity: 5
7. Click COMPLETE PROFILE
8. Redirects to Technician.html dashboard
9. ✅ Should see all counts as "-" (loading)
10. ✅ After 5 seconds, counts should update to 0 (no issues yet)
```

#### Step 1C: Employee Login & Create Issue
```
1. Go to http://localhost:3000/login.html
2. Select "Employee"
3. Login with: employee@test.com / Secure@123
4. Redirects to Employee.html dashboard
5. Click "Report Issue" or navigate to report-issue.html
6. Fill issue form:
   - Title: "Socket not working"
   - Description: "Power socket in cabin 3 is broken"
   - Category: Electrical (MUST match technician's)
   - Priority: Urgent
   - Location: Cabin 3
7. Click CREATE ISSUE
8. ✅ Dashboard updates: "Total Issues: 1"
```

#### Step 1D: Verify Technician Auto-Assignment
```
1. Go back to Technician dashboard
2. Open browser DevTools (F12 → Console)
3. ✅ Should see logs:
   "✅ Dashboard updated: 1 assigned, 0 in progress, 0 completed"
4. ✅ Numbers update on dashboard:
   - Tasks Assigned: 1
   - Tasks In Progress: 0
   - Completed Tasks: 0
5. ✅ Wait 5 seconds, numbers refresh
```

### Test Case 2: Multiple Issues → Load Balancing

#### Step 2A: Create More Issues as Employee
```
1. Create 3 more electrical issues
2. Each one should auto-assign to the same technician (no other available)
3. Technician dashboard updates in real-time
4. After issue 5: "Tasks Assigned: 5"
```

#### Step 2B: Test Overload Protection
```
1. Create 6th electrical issue
2. Technician at max capacity (5/5)
3. ✅ Issue should NOT be assigned
4. Issue stays in "open" status
5. ✅ Dashboard still shows 5 assigned
```

#### Step 2C: Create Second Technician
```
1. Signup as: Priya Technician / priya@test.com / Secure@123
2. Profile: Electrical / Max 3
3. Go to Technician.html
4. ✅ Dashboard shows: 0 assigned, 0 in progress, 0 completed
```

#### Step 2D: Create Issue for New Technician
```
1. As Employee: Create new electrical issue
2. ✅ Auto-assigned to Priya (least busy: 0 vs 5)
3. Raj dashboard: still shows 5
4. Priya dashboard: shows 1
```

### Test Case 3: Real-Time Updates

#### Step 3A: Issue Status Changes
```
1. Employee marks issue as "in-progress"
2. ✅ Technician sees update within 5 seconds:
   - Tasks Assigned: decreases
   - Tasks In Progress: increases
3. Employee marks as "resolved"
4. ✅ Technician sees:
   - Tasks Assigned: decreases
   - Completed Tasks: increases
   - Technician becomes available again
```

#### Step 3B: New Assignment for Freed Technician
```
1. Technician marked 1 issue as resolved
2. Now has 1/5 capacity
3. Create new electrical issue as employee
4. ✅ Auto-assigns to technician with lowest workload
5. Dashboard updates automatically
```

### Test Case 4: Navigation

#### Step 4A: Sidebar Links
```
1. Click "Dashboard" → reloads dashboard, fetches data
2. Click "Assigned Tasks" → navigates to assigned-tasks.html
3. Click "Live Issues" → navigates to live_issues.html
4. Click "My Profile" → navigates to profile.html
5. Click "Logout" → clears localStorage, redirects to login.html
```

### Test Case 5: Data Persistence

#### Step 5A: Page Reload
```
1. Technician logged in, viewing dashboard
2. Press F5 to reload
3. ✅ Should NOT redirect to login (token in localStorage)
4. ✅ Dashboard data loads again
5. ✅ Numbers update correctly
```

#### Step 5B: New Tab
```
1. Open new tab, go to Technician.html directly
2. ✅ Should load dashboard (token valid)
3. ✅ Data displays correctly
```

### Test Case 6: Error Handling

#### Step 6A: Invalid Credentials
```
1. Go to login.html
2. Enter wrong email/password
3. ✅ Shows error: "Incorrect password" or "Technician not found"
4. ✅ NOT redirected, stays on login page
```

#### Step 6B: Missing Profile Completion
```
1. Technician account created but profile NOT completed
2. Close browser, clear localStorage
3. Go to profile completion page directly: technician-profile-completion.html
4. Should show form to complete
5. After completion, redirect to Technician.html
```

#### Step 6C: Network Error
```
1. Turn off backend server
2. Technician dashboard tries to load
3. ✅ Should show in console: "Error loading dashboard data"
4. ✅ Dashboard shows "-" (not updated)
5. Turn backend on
6. Wait 5 seconds, data loads
```

### Expected Console Logs

When dashboard loads properly:
```
🔧 Technician Dashboard Loaded
🔐 login.js LOADED
✅ Dashboard updated: 1 assigned, 0 in progress, 0 completed
✅ Dashboard updated: 1 assigned, 0 in progress, 0 completed (repeats every 5 sec)
```

### Debugging Checklist

- [ ] Token exists in localStorage: `localStorage.getItem('token')`
- [ ] User data stored: `JSON.parse(localStorage.getItem('user'))`
- [ ] API called correctly: Check Network tab in DevTools
- [ ] Response status 200: Check Network → Response
- [ ] IDs are correct: `document.getElementById('tasksAssigned')` should exist
- [ ] No JavaScript errors: Check Console tab

### Quick URLs

- Login: `http://localhost:3000/login.html`
- Signup: `http://localhost:3000/signup.html`
- Technician Dashboard: `http://localhost:3000/Technician.html`
- Employee Dashboard: `http://localhost:3000/Employee.html`
- Report Issue: `http://localhost:3000/report-issue.html`

---

**All tests passing = System working correctly! ✅**
