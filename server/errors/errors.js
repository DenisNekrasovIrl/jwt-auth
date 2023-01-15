class APIError extends Error{
    status;
    arrayMessage;
    constructor(status, message, arrayMessage){
        super(message);
        this.message = message;
        this.status = status;
        this.errors = arrayMessage;
    }
    static UnauthorizatedError(){
        throw new APIError(401,"Пользователь не авторизован");
    }
    static RegistrationError(message = 'Регистрация не удалась', array = []){
        throw new APIError(403, message, array)
    }
}

module.exports = APIError;