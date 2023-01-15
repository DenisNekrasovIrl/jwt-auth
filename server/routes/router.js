const Router = require('express');
const UserController = require('../controllers/userController');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware')
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    UserController.registration); //Регистрация
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh); //Восстановление пароля
router.post('/changePassword', UserController.getNewPassword); //Восстановление пароля
router.get('/activate/:id', UserController.activate); //Активация аккаунта
router.get('/refresh/:link', UserController.refreshPassword); //Восстановление пароля
router.get('/users', authMiddleware, UserController.getUsers); //Получение всех пользователей
router.get('/refreshToken', UserController.refreshToken);

module.exports = router;