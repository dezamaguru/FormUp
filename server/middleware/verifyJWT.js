const jwt = require('jsonwebtoken');
require('dotenv').config();

const veirfyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    //console.log(authHeader); //Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' }); //Forbidden => received token is no right
            } 
            // req.email = decoded.email;
            // req.type = decoded.type;
            req.email = decoded.UserInfo.email;
            req.type = decoded.UserInfo.type;
            next();
        }
    );
};

module.exports = veirfyJWT;