const jwt = require('jsonwebtoken')
const jwtConfig = require('../configs/jwt.config')

function verifyToken (req,res, next){


    console.log("je passse par le middleware")
    next();
}
module.exports = verifyToken;