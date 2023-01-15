const jwt = require('jsonwebtoken');
const config = require('../config');
const tokenModel = require('../models/tokenModel');
class TokenService {
    static generateToken(payload) {
        const accessToken = jwt.sign({ id: payload.id, email: payload.email }, config.JWT_ACCESS_TOKEN, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ id: payload.id, email: payload.email }, config.JWT_REFRESH_TOKEN, { expiresIn: '120s' });
        return {
            accessToken,
            refreshToken
        }
    }
    static async saveRefreshToken(id, refreshToken) {
        const token = await tokenModel.findOne({ user: id });
        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }
        await tokenModel.create({ user: id, refreshToken });
    }

    static async deleteToken(refreshToken) {
        const token = await tokenModel.deleteOne({ refreshToken });
        return token;
    }
    static validationAccessToken(accessToken) {
        const validationToken = jwt.verify(accessToken, config.JWT_ACCESS_TOKEN);
        return validationToken;
    }
    static validationRefreshToken(refreshToken) {
        const validationToken = jwt.verify(refreshToken, config.JWT_REFRESH_TOKEN);
        return validationToken;
    }
    static async findTokenInDB(refreshToken) {
        try {
            const token = await tokenModel.findOne({ refreshToken });
            return token;
        } catch (e) {
            return null;
        }

    }
}
module.exports = TokenService;