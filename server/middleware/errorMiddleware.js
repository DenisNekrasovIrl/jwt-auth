const APIError = require("../errors/errors");

module.exports = function(err, req, res, next){
    if(err instanceof APIError){
        return res.json({status: err.status, message: err.message});
    }
    return res.status(500).json({message: err.message});
}