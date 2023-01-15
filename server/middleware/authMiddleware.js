const APIError = require("../errors/errors");
const TokenService = require("../service/tokenService");

module.exports = function(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        throw APIError.UnauthorizatedError();
    }
    const accessToken = token.split(' ')[1];
    if (!accessToken) {
        throw APIError.UnauthorizatedError();
    }
    const user = TokenService.validationAccessToken(accessToken);
    if(!user){
        throw APIError.UnauthorizatedError();
    }
    next();
}