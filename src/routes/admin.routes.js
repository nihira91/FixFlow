const express=require('express');
const router=express.Router();
const{
    getAllEmployees,
    getAllTechnicians,
    deleteUser,
    assignTechnician,
    getAllIssuesAdmin

}=require('./controllers/admin.Controller');

const { adminAuth } = require('../middlewares/auth.middleware');


router.get('/employees', adminAuth, getAllEmployees);
router.get('/technicians', adminAuth, getAllTechnicians);
router.delete('/user/:id', adminAuth, deleteUser);
router.put('/assign-technician/:issueId', adminAuth, assignTechnician);
router.get('/issues', adminAuth, getAllIssuesAdmin);

module.exports = router;
