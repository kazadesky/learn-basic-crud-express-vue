const express = require('express');
const router = express.Router();

const registerController = require('../controllers/RegisterController');
const loginController = require('../controllers/LoginController');
const userController = require('../controllers/UserController');

const { validateRegister, validateLogin } = require('../utils/validators/auth');
const verifyToken = require('../middlewares/auth');
const { validateUser } = require('../utils/validators/user');

// User Registration
router.post('/register', validateRegister, registerController.register);

// User Login
router.post('/login', validateLogin, loginController.login);

// Get All Users (Admin)
router.get('/admin/users', verifyToken, userController.findUsers);

// Create new user (Admin)
router.post('/admin/users', verifyToken, validateUser, userController.createUser);

// Find user by ID (Admin)
router.get('/admin/users/:id', verifyToken, userController.findUserById);

// Update user (Admin)
router.patch('/admin/users/:id', verifyToken, validateUser, userController.updateUser);

// Delete user (Admin)
router.delete('/admin/users/:id', verifyToken, userController.deleteUser);

module.exports = router;
