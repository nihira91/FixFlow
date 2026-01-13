# Electrical Issues - Complete Examples

## Critical Priority (Immediate Action Required)

### 1. **Power Failure in Section**
- **Title:** Power failure in East Wing
- **Description:** Entire east wing has lost power. Affects 10+ rooms. Need to restore immediately.
- **Location:** East Wing
- **Category:** Electrical
- **Priority:** Critical

### 2. **Burning Smell from Electrical**
- **Title:** Burning smell near electrical outlet in Store Room
- **Description:** Strong burning smell coming from outlet in back wall. Needs urgent investigation.
- **Location:** Store Room
- **Category:** Electrical
- **Priority:** Critical

### 3. **Server Room Power Down**
- **Title:** Circuit breaker tripped in Server Room
- **Description:** Main circuit breaker has tripped. Need immediate attention. All servers down.
- **Location:** Server Room
- **Category:** Electrical
- **Priority:** Critical

### 4. **Backup Generator Failure**
- **Title:** Backup generator not starting
- **Description:** Generator won't turn on during manual test. No power output. Needs service.
- **Location:** Generator Room
- **Category:** Electrical
- **Priority:** Critical

### 5. **Burst/Exposed Wiring**
- **Title:** Loose electrical wire in Cabin 5
- **Description:** Exposed wire near power outlet. Potential safety hazard. Needs immediate fixing.
- **Location:** Cabin 5
- **Category:** Electrical
- **Priority:** Critical (when exposed/dangerous)

---

## Urgent Priority (Very High - Fix Today)

### 6. **Dangerous Outlet**
- **Title:** Faulty electrical outlet in Conference Room A
- **Description:** Outlet sparks when plugging in devices. Very dangerous. Do not use.
- **Location:** Conference Room A
- **Category:** Electrical
- **Priority:** Urgent

### 7. **Dead Socket**
- **Title:** Power socket in Cabin 3 not working
- **Description:** The power socket near the desk is completely dead. No power supply. Checked multiple devices.
- **Location:** Cabin 3
- **Category:** Electrical
- **Priority:** Urgent

### 8. **Loose Connections**
- **Title:** Loose electrical connection in Distribution Box
- **Description:** Found loose connection in main distribution box. Creating intermittent power issues.
- **Location:** Main Distribution Room
- **Category:** Electrical
- **Priority:** Urgent

### 9. **Damaged Power Cord**
- **Title:** Power cord damaged in Conference Room C
- **Description:** Cable has visible damage and exposed wires. Equipment at risk. Need to replace.
- **Location:** Conference Room C
- **Category:** Electrical
- **Priority:** Urgent

### 10. **Emergency Light Battery Dead**
- **Title:** Emergency light battery needs replacement
- **Description:** Emergency exit light not working. Battery is dead and needs replacement immediately.
- **Location:** Emergency Exit - Stairwell A
- **Category:** Electrical
- **Priority:** Urgent

---

## High Priority (Fix This Week)

### 11. **Power Fluctuation**
- **Title:** Power fluctuation affecting lights in Office Block B
- **Description:** Lights flickering intermittently. Voltage seems unstable. Affecting work productivity.
- **Location:** Office Block B
- **Category:** Electrical
- **Priority:** High

### 12. **Electrical Panel Issues**
- **Title:** Electrical panel door lock broken
- **Description:** Main electrical panel door is stuck. Cannot properly close and lock.
- **Location:** Electrical Room
- **Category:** Electrical
- **Priority:** High

### 13. **Overloaded Power Strip**
- **Title:** Power strip overloaded in Reception
- **Description:** Too many devices connected. Strip getting hot. Risk of fire hazard.
- **Location:** Reception
- **Category:** Electrical
- **Priority:** High

### 14. **UPS Not Working**
- **Title:** UPS battery backup not working
- **Description:** Uninterruptible Power Supply showing error. Battery not charging. Need replacement.
- **Location:** IT Room
- **Category:** Electrical
- **Priority:** High

### 15. **Surge Damage**
- **Title:** Electrical surge damage to equipment
- **Description:** Lightning strike caused power surge. Multiple devices damaged. Need replacement.
- **Location:** Cabin 1
- **Category:** Electrical
- **Priority:** High

### 16. **Damaged Outlet in Wet Area**
- **Title:** Electrical outlet damaged in Bathroom
- **Description:** Outlet face plate is cracked and damaged. Water exposure risk. Needs replacement.
- **Location:** Bathroom - 2nd Floor
- **Category:** Electrical
- **Priority:** High

### 17. **Transformer Noise**
- **Title:** Electrical noise coming from transformer
- **Description:** Transformer making unusual humming/buzzing noise. May indicate failure soon.
- **Location:** Transformer Room
- **Category:** Electrical
- **Priority:** High

### 18. **No Power to Equipment**
- **Title:** Air conditioner not getting power
- **Description:** AC unit in Cabin 4 is dead. No power supply reaching the unit despite outlet working.
- **Location:** Cabin 4
- **Category:** Electrical
- **Priority:** High

---

## Routine Priority (Schedule Maintenance)

### 19. **Light Not Working**
- **Title:** Fluorescent light not working in Corridor 2
- **Description:** Overhead light tube is dead. Dark corridor creating safety hazard.
- **Location:** Corridor 2
- **Category:** Electrical
- **Priority:** Routine

### 20. **LED Display Issue**
- **Title:** LED display not lighting up in Lobby
- **Description:** LED info display is completely dark. Not responding to power. Needs repair.
- **Location:** Main Lobby
- **Category:** Electrical
- **Priority:** Routine

---

## How to Use These Examples

### For Testing:
1. Copy these examples to your database using the seed scripts
2. Use various priority levels to test filtering
3. Test real-time updates as you change issue status

### To Run Seed Script:
```bash
cd src
node seeds/electrical-issues.seed.js
```

### To Run All Issues (30 different issues):
```bash
cd src
node seeds/all-issues.seed.js
```

---

## Issue Templates by Scenario

### Scenario 1: Fire Hazard
- Power strip overloaded
- Burning smell from outlet
- Exposed wires
- Damaged outlets in wet areas

### Scenario 2: Complete Outage
- Circuit breaker tripped
- Power failure in section
- Backup generator not working
- Main power loss

### Scenario 3: Intermittent Issues
- Power fluctuation (flickering lights)
- Loose connections
- UPS failing
- Transformer noise

### Scenario 4: Equipment Damage
- Surge damage
- No power to AC/equipment
- Damaged power cords
- Electrical panel problems

### Scenario 5: Safety Issues
- Emergency lights not working
- Dangerous outlets (sparking)
- Ungrounded outlets
- Water-exposed electrical

---

## Priority Decision Guide

| Situation | Priority | Action |
|-----------|----------|--------|
| Life/safety threat | Critical | Immediate action, evacuate if needed |
| Business down | Critical | Immediate action required |
| Fire/shock hazard | Urgent | Fix same day |
| No power to area | High | Fix within 24 hours |
| Intermittent issues | High | Schedule within week |
| Cosmetic/routine | Routine | Schedule maintenance |

---

## Testing Workflow

1. **Create Issues** → Use seed data with various priorities
2. **Assign Technician** → Dashboard auto-assigns based on category
3. **Update Status** → Change from open → in-progress → resolved
4. **View Timeline** → See all progress updates
5. **Real-time Updates** → Dashboard refreshes every 5 seconds
6. **View Details** → Modal shows complete issue history

