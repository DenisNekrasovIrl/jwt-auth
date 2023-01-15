const UserService = require("../service/userService")
const { validationResult } = require('express-validator');
const APIError = require("../errors/errors");
const userModel = require("../models/userModel");
class UserController {
    static async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(APIError.RegistrationError(errors));
            }
            const { email, password } = req.body;
            const { userDTO, tokens} = await UserService.registration(email, password);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({email:userDTO.email, accessToken:tokens.accessToken});
        } catch (e) {
            next(e)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { userDTO, tokens } = await UserService.login(email, password);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({email: userDTO.email, accessToken: tokens.accessToken});
        } catch (e) {
            next(e);
        }
    }

    static async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({message: token})
        } catch (e) {
            next(e);
        }
    }

    static async refresh(req, res, next) {
        try {
            const { email } = req.body;
            await UserService.refresh(email);
            res.json({ email });
        } catch (e) {
            next(e);
        }
    }

    static async activate(req, res, next) {
        try {
            const link = req.params.id;
            await UserService.activate(link);
            return res.redirect('http://localhost:3000');
        } catch (e) {
            next(e);
        }
    }

    static async refreshPassword(req, res, next) {
        try {
            const refreshLink = req.params.link;
            await UserService.refreshPassword(refreshLink);
            res.redirect('http://localhost:3000/refresh');
        } catch (e) {
            next(e);
        }
    }

    static async getNewPassword(req, res, next) {
        try {
            const { refreshLink, password } = req.body;
            const newUser = await UserService.getNewPassword(refreshLink, password);
            return res.json({newUser});
        } catch (e) {
            next(e);
        }
    }

    static async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const { tokens, userDTO } = await UserService.refreshToken(refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({...userDTO, accessToken: tokens.accessToken});
        } catch (e) {
            next(e);
        }
    }

    static async getUsers(req, res, next) {
        try {
            const users = await userModel.find();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = UserController;