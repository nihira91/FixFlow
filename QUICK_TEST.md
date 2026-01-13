## 🧪 Quick Test Guide - Technician Dashboard

### ⚡ 5-Minute Test

#### Step 1: Start Backend
```bash
npm run dev
# Verify: "🚀 Unified Backend running on port 5000"
```

#### Step 2: Employee Creates Issue
1. Open browser → `http://localhost:3000/signup.html`
2. Create employee account (if needed)
3. Login
4. Click "Report Issue" or go to create issue page
5. Fill form:
   - Title: "AC Not Working"
   - Category: "HVAC" (must match technician's category)
   - Location: "Room 203"
   - Priority: "Urgent"
6. Click "Submit"

#### Step 3: Technician Dashboard
1. Login as technician (or create new one)
2. After login, redirected to Technician.html
3. **Check Dashboard Numbers:**
   - Should show "Tasks Assigned: 1"
   - "Tasks In Progress: 0"
   - "Completed Tasks: 0"
4. **Check Navigation:**
   - Click "Assigned Tasks" → Should show the issue
   - Click "Live Issues" → Should show the issue
   - Click "Dashboard" → Back to dashboard
   - Click "My Profile" → Should open profile page
   - Click "Logout" → Should return to login

#### Step 4: Verify Real-Time
1. Keep technician dashboard open
2. Switch to employee tab
3. Create another issue (same category as technician)
4. Switch back to technician tab
5. **Watch dashboard numbers update** (within 5 seconds)
6. Check Assigned Tasks page → New issue should appear

---

### 📋 Complete Test Scenarios

#### Scenario 1: Single Technician, Multiple Issues
```
1. Create 1 technician (Category: Electrical)
2. Create 5 issues (all Electrical category)
3. All 5 should auto-assign
4. Dashboard shows: Tasks Assigned = 5
5. Assigned Tasks page shows all 5 issues
```

#### Scenario 2: Multiple Technicians, Auto-Assignment
```
1. Create 2 technicians (both Electrical category)
   - Tech 1: Max Capacity = 2
   - Tech 2: Max Capacity = 3
2. Create 5 Electrical issues
3. Assignments:
   - Issue 1 → Tech 1 (0/2)
   - Issue 2 → Tech 2 (0/3)
   - Issue 3 → Tech 2 (1/3)
   - Issue 4 → Tech 1 (1/2)
   - Issue 5 → Tech 2 (2/3)
4. Tech 1 dashboard: Tasks Assigned = 2
5. Tech 2 dashboard: Tasks Assigned = 3
```

#### Scenario 3: Category Mismatch
```
1. Create 1 technician (Category: Electrical)
2. Create issue (Category: Plumbing)
3. Issue should NOT auto-assign
4. Live Issues page shows "Waiting for assignment..."
5. Dashboard shows: Tasks Assigned = 0
```

#### Scenario 4: Real-Time Updates
```
1. Open Technician dashboard
2. Open another tab with employee
3. Create issue as employee
4. Watch technician dashboard update within 5 seconds
5. Check assigned-tasks page → Issue appears immediately
6. Check live_issues page → Issue appears immediately
```

#### Scenario 5: Issue Resolution
```
1. Technician has 3 assigned issues
2. Dashboard shows: Tasks Assigned = 3
3. Employee marks 1 issue as "Resolved"
4. Technician dashboard updates: Tasks Assigned = 2
5. Technician becomes available for new issues
```

---

### ✅ Expected Behavior Checklist

**Dashboard Page:**
- [ ] Shows correct task counts
- [ ] Updates every 5 seconds
- [ ] Shows empty state when no issues
- [ ] Displays technician's name in header

**Assigned Tasks Page:**
- [ ] Shows only issues assigned to current technician
- [ ] Displays issue cards with all details
- [ ] Search works (by title/description)
- [ ] Status filter works
- [ ] Updates every 5 seconds
- [ ] Empty state when no issues
- [ ] Click "View Details" works

**Live Issues Page:**
- [ ] Shows all open/assigned issues
- [ ] Displays unassigned issues as "Waiting for assignment"
- [ ] Priority filter buttons work
- [ ] Shows assigned technician name
- [ ] Updates every 3 seconds
- [ ] Empty state when all resolved

**Navigation:**
- [ ] Dashboard link works
- [ ] Assigned Tasks link works
- [ ] Live Issues link works
- [ ] My Profile link works
- [ ] Logout clears session

---

### 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Dashboard shows 0 even after creating issue | Check if issue's category matches technician's category |
| Navigation links don't work | Check browser console for errors |
| Pages don't refresh automatically | Check if API is responding (check network tab) |
| Assigned Tasks page is empty | Create issue with matching category |
| Issues not auto-assigning | Verify technician has profileCompleted = true |
| Old hardcoded data showing | Clear browser cache, refresh page |

---

### 📊 Data You Can Use for Testing

**Technician Categories:**
- Electrical
- Plumbing
- HVAC
- Network
- Maintenance
- Security
- Other

**Issue Priorities:**
- Critical
- Urgent
- Routine
- Risky

**Issue Statuses:**
- open
- assigned
- in-progress
- on-hold
- resolved
- closed

---

### 🎯 Success Criteria

✅ **All criteria must be met:**
1. Dashboard shows real data from backend
2. All pages open via navigation
3. Real-time updates work (without page refresh)
4. Empty states display correctly
5. No hardcoded data visible
6. Issues auto-assign based on category
7. Technician workload tracked accurately
8. No console errors

**If all above pass, your implementation is COMPLETE!** 🎉
