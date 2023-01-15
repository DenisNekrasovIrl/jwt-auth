const {Schema, model} = require('mongoose');


const refreshUserModel = new Schema({
    email: {type: String, required: true},
    refreshLink: {type: String, required: true},
    checked: {type: Boolean, default: false}
})



module.exports = model('refreshUserModel', refreshUserModel)