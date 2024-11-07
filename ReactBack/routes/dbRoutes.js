const { Router } = require('express');   
const { createUser, deleteUser, updateUser, getAllUsers, searchUsers } = require('../controllers/dbController.js');

const router = Router();

router.post('/create', createUser);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);

module.exports = router;