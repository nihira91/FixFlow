## 🔧 Implementation & Testing Checklist

### Prerequisites
- [ ] Node.js and npm installed
- [ ] MongoDB running (local or Atlas)
- [ ] `.env` file with JWT_SECRET and MONGODB_URI

### Backend Setup
- [ ] All new files created and placed in correct directories
- [ ] `npm install` dependencies (if any new packages needed)
- [ ] Start server: `npm start` or `npm run dev`
- [ ] Verify server running on port 5000

### Database Setup
- [ ] MongoDB connection working
- [ ] `User` collection exists with new schema
- [ ] `Issue` collection exists

---

## ✅ Step-by-Step Testing

### Phase 1: Technician Signup Flow

**Test 1.1: Basic Technician Signup**
```bash
curl -X POST http://localhost:5000/api/technician/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Sharma",
    "email": "raj@techmail.com",
    "password": "Secure@123",
    "contactNo": "+91 98765 43210"
  }'
```
Expected Response:
```json
{
  "message": "Technician registered successfully. Please complete your profile.",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "Raj Sharma",
    "email": "raj@techmail.com",
    "profileCompleted": false
  }
}
```
✓ Check: Status 201, token provided, profileCompleted = false

**Test 1.2: Profile Completion**
```bash
curl -X POST http://localhost:5000/api/technician/auth/complete-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_from_1.1>" \
  -d '{
    "category": "Electrical",
    "maxCapacity": 12
  }'
```
Expected Response:
```json
{
  "message": "Profile completed successfully",
  "user": {
    "id": "...",
    "category": "Electrical",
    "profileCompleted": true,
    "isAvailable": true,
    "currentWorkload": 0,
    "maxCapacity": 12
  }
}
```
✓ Check: Status 200, category saved, profileCompleted = true

**Test 1.3: Technician Login**
```bash
curl -X POST http://localhost:5000/api/technician/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj@techmail.com",
    "password": "Secure@123"
  }'
```
Expected Response:
```json
{
  "message": "Technician login successful",
  "token": "new_jwt_token",
  "user": {
    "id": "...",
    "category": "Electrical",
    "profileCompleted": true
  }
}
```
✓ Check: Status 200, token provided, profile is complete

---

### Phase 2: Smart Issue Assignment

**Setup: Create Multiple Technicians**
```javascript
// Create 3 technicians with Electrical category
Technician 1: "Raj Sharma" - maxCapacity: 3
Technician 2: "Priya Singh" - maxCapacity: 2
Technician 3: "Amit Kumar" - maxCapacity: 5
```

**Test 2.1: Create Issue - First Assignment**
```bash
curl -X POST http://localhost:5000/api/employee/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <employee_token>" \
  -d '{
    "title": "Broken Power Socket",
    "description": "Power socket in cabin 3 not working",
    "category": "Electrical",
    "priority": "Urgent",
    "location": "Cabin 3"
  }'
```
Expected:
- ✓ Issue created with status "assigned"
- ✓ Assigned to Technician 1 (least busy: workload 0)
- ✓ Raj's currentWorkload = 1
- ✓ Real-time notification sent to Raj

**Test 2.2: Create Issue - Assignment to Least Busy**
```bash
# Create 2 more issues for Electrical category
```
Expected:
- ✓ Issue 2 assigned to Technician 1 (still least busy: workload 1)
- ✓ Issue 3 assigned to Technician 2 (workload 0 is now least busy)
- Raj's workload: 2
- Priya's workload: 1
- Amit's workload: 0

**Test 2.3: At Max Capacity - No Assignment**
```bash
# Raj has 3 issues (at max capacity)
# Priya has 2 issues (at max capacity)
# Amit has 2 issues (below max of 5)
# Create new Electrical issue
```
Expected:
- ✓ Assigned to Amit (only one with capacity)
- ✓ Raj is marked isAvailable = false
- ✓ Priya is marked isAvailable = false

**Test 2.4: No Available Technician**
```bash
# If all Electrical technicians are at max capacity
# Create a new Electrical issue
```
Expected Response:
```json
{
  "success": false,
  "message": "No available technician found for category: Electrical"
}
```
✓ Check: Issue created but NOT assigned, status remains "open"

**Test 2.5: Wrong Category Assignment**
```bash
# Create an issue with category "Plumbing" 
# but only Electrical technicians available
```
Expected:
- ✓ Issue created but not assigned
- ✓ Error message returned in response

---

### Phase 3: Issue Resolution & Workload Update

**Test 3.1: Resolve Issue**
```bash
curl -X PATCH http://localhost:5000/api/employee/issues/<issueId>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <employee_token>" \
  -d '{"status": "resolved"}'
```
Expected:
- ✓ Issue status = "resolved"
- ✓ Technician unassigned
- ✓ Technician's currentWorkload decreased by 1
- ✓ If workload < maxCapacity, technician marked isAvailable = true

**Test 3.2: Verify Workload Decreased**
```bash
# Get technician profile
curl -X GET http://localhost:5000/api/technician/auth/profile \
  -H "Authorization: Bearer <technician_token>"
```
Expected:
- ✓ currentWorkload decreased
- ✓ isAvailable may have changed to true

---

### Phase 4: Available Technicians Queries

**Test 4.1: Get Available Technicians by Category**
```bash
curl -X GET "http://localhost:5000/api/technicians/available?category=Electrical"
```
Expected Response:
```json
{
  "message": "Found 2 available technicians",
  "category": "Electrical",
  "technicians": [
    {
      "_id": "...",
      "name": "Amit Kumar",
      "email": "amit@tech.com",
      "category": "Electrical",
      "currentWorkload": 3,
      "maxCapacity": 5,
      "rating": 4.5
    },
    {
      "_id": "...",
      "name": "New Technician",
      "email": "new@tech.com",
      "category": "Electrical",
      "currentWorkload": 0,
      "maxCapacity": 10,
      "rating": 0
    }
  ]
}
```
✓ Check: Only available technicians returned, sorted by workload

**Test 4.2: Get All Technicians (Admin)**
```bash
curl -X GET http://localhost:5000/api/technicians/all \
  -H "Authorization: Bearer <admin_token>"
```
Expected:
- ✓ All technicians returned with workload info

**Test 4.3: Get Statistics**
```bash
curl -X GET http://localhost:5000/api/technicians/stats \
  -H "Authorization: Bearer <admin_token>"
```
Expected Response:
```json
{
  "message": "Technician statistics by category",
  "stats": [
    {
      "_id": "Electrical",
      "totalTechnicians": 3,
      "totalCapacity": 20,
      "totalWorkload": 5,
      "availableTechnicians": 2
    },
    {
      "_id": "Plumbing",
      "totalTechnicians": 2,
      "totalCapacity": 15,
      "totalWorkload": 0,
      "availableTechnicians": 2
    }
  ]
}
```
✓ Check: Statistics correct for each category

---

### Phase 5: Frontend Testing

**Test 5.1: Employee Signup**
1. Navigate to `/signup.html`
2. Select "Employee" radio button
3. ✓ Contact number field should NOT appear
4. Fill form and submit
5. ✓ Redirected to login.html

**Test 5.2: Technician Signup**
1. Navigate to `/signup.html`
2. Select "Technician" radio button
3. ✓ Contact number field appears and is required
4. Fill all fields and submit
5. ✓ Redirected to `/technician-profile-completion.html`

**Test 5.3: Profile Completion**
1. Should be on profile completion page after signup
2. Select category (e.g., "Electrical")
3. Change max capacity if needed
4. Click "COMPLETE PROFILE"
5. ✓ Redirected to `/Technician.html`
6. ✓ localStorage contains user with profileCompleted = true

**Test 5.4: Technician Login After Profile**
1. Logout from technician dashboard
2. Go to login page
3. Login with technician credentials
4. ✓ Should show that profile is completed
5. ✓ Should have category displayed

---

### Phase 6: Edge Cases

**Test 6.1: Duplicate Email**
```bash
# Try to signup with same email twice
curl -X POST http://localhost:5000/api/technician/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Raj",
    "email": "raj@techmail.com",
    "password": "Different@123",
    "contactNo": "+91 99999 99999"
  }'
```
Expected:
- ✓ Status 409 (Conflict)
- ✓ Message: "Email already exists"

**Test 6.2: Missing Required Fields**
```bash
curl -X POST http://localhost:5000/api/technician/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Tech",
    "email": "incomplete@tech.com"
  }'
```
Expected:
- ✓ Status 400
- ✓ Message about required fields

**Test 6.3: Invalid Category**
```bash
curl -X POST http://localhost:5000/api/technician/auth/complete-profile \
  -H "Authorization: Bearer <token>" \
  -d '{
    "category": "InvalidCategory"
  }'
```
Expected:
- ✓ Should complete anyway (category is free text for flexibility)

---

## 📊 Success Criteria

- [ ] All Phase 1-6 tests pass
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Workload tracking accurate
- [ ] Assignment logic correct
- [ ] No technician overloaded
- [ ] Real-time notifications working
- [ ] Frontend UI responsive

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Token not found after signup | Check localStorage, ensure token is saved |
| Profile completion fails | Verify token is valid, check JWT_SECRET in .env |
| Issues not auto-assigning | Check technician has profileCompleted = true |
| Wrong technician assigned | Verify sorting logic, check currentWorkload values |
| Port 5000 already in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| MongoDB connection error | Verify MONGODB_URI in .env, check MongoDB is running |

---

## 📝 Notes

- **Password Requirements**: Must have uppercase, number, and special character (@$!%*?&)
- **Contact Number Format**: Any format accepted (stored as string)
- **Categories**: Can be customized - currently Electrical, Plumbing, HVAC, Network, Maintenance, Security, Other
- **Default Max Capacity**: 10 issues
- **Assignment Priority**: Lowest currentWorkload wins (load balancing)
