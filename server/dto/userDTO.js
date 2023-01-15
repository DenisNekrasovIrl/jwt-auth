class UserDTO{
    id;
    email;
    constructor(user){
        this.id = user._id;
        this.email = user.email;
    }
}

module.exports = UserDTO;