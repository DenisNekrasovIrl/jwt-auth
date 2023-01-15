const {Schema, model} = require('mongoose');


const tokenModel = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'userSchema'},
    refreshToken: {type: String, required: true}
})

module.exports = model('tokenModel', tokenModel);