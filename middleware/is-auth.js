const jwt = require('jsonwebtoken');
const { throwError } = require('../utils/helpers');

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader) throwError("Not authenticated");

    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "secret");

    } catch (error) {
        throw error;
    }

    if(!decodedToken) throwError("Not Authenticated");
    req.userId = decodedToken.userId;
    next();
};