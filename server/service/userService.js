const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const TokenService = require("./tokenService");
const UserDTO = require("../dto/userDTO");
const APIError = require("../errors/errors");
const sendActivation = require('./emailService');
const config = require("../config");
const refreshUserModel = require("../models/refreshUserModel");
const emailService = require("./emailService");
const tokenModel = require("../models/tokenModel");
class UserService {
    static async registration(email, password) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw APIError.RegistrationError();
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const user = await userModel.create({ email, password: hashPassword, activationLink });
        const userDTO = new UserDTO(user);
        const tokens = TokenService.generateToken(userDTO);
        await TokenService.saveRefreshToken(userDTO.id, tokens.refreshToken);
        await sendActivation(email, `${config.SERVER_URL}/activate/${activationLink}`);
        return { userDTO, tokens };
    }

    static async login(email, password) {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw APIError.RegistrationError();
        }
        const hashPassword = bcrypt.compareSync(password, user.password);
        if (!hashPassword) {
            throw APIError.UnauthorizatedError();
        }
        const userDTO = new UserDTO(user);
        const tokens = TokenService.generateToken(userDTO);
        await TokenService.saveRefreshToken(userDTO.id, tokens.refreshToken);
        return { userDTO, tokens };
    }

    static async logout(refreshToken) {
        const token = await TokenService.deleteToken(refreshToken);
        return token;
    }

    static async activate(activationLink) {
        const user = await userModel.findOne({ activationLink });
        if (!user) {
            throw new APIError.RegistrationError();
        }
        user.isActivate = true;
        return await user.save();
    }

    static async refresh(email) {
        const user = userModel.findOne({ email });
        if (!user) {
            throw APIError.RegistrationError();
        }
        const refreshLink = uuid.v4();
        await refreshUserModel.create({ email, refreshLink });
        await emailService(email, `${config.SERVER_URL}/refresh/${refreshLink}`, refreshLink);
    }
    static async refreshPassword(refreshLink) {
        const refreshUser = await refreshUserModel.findOne({ refreshLink });
        if (!refreshUser) {
            throw APIError.RegistrationError();
        }
        refreshUser.checked = true;
        await refreshUser.save();
    }
    static async getNewPassword(refreshLink, password) {
        const refreshUser = await refreshUserModel.findOne({ refreshLink });
        if (!refreshUser || !refreshUser.checked) {
            throw APIError.RegistrationError();
        }
        const user = await userModel.findOne({ email: refreshUser.email });
        if (!user) {
            throw APIError.RegistrationError();
        }
        const hashPassword = await bcrypt.hash(password, 5);
        user.password = hashPassword;
        await refreshUserModel.deleteOne({ refreshLink });
        const newUser = await user.save();
        return newUser;
    }

    static async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw APIError.RegistrationError('Отсутствует токен обновления');
        }

        const userData = TokenService.validationRefreshToken(refreshToken);
        const tokenInDB = await TokenService.findTokenInDB(refreshToken);

        if (!userData || !tokenInDB) {
            throw APIError.RegistrationError();
        }

        const user = await userModel.findById(userData.id);
        const userDTO = new UserDTO(user);

        const tokens = TokenService.generateToken(userDTO);

        await TokenService.saveRefreshToken(userDTO.id, tokens.refreshToken);
        return { userDTO, tokens };
    }
}

module.exports = UserService;