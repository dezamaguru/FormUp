const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../server');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    //console.log(authHeader); //Bearer token
    const token = authHeader.split(' ')[1];
    // jwt.verify(
    //     token,
    //     process.env.ACCESS_TOKEN_SECRET,
    //     (err, decoded) => {
    //         if (err) {
    //             return res.status(403).json({ message: 'Invalid or expired token' }); //Forbidden => received token is no right
    //         } 
    //         console.log('Decoded token:', decoded); 
    //         // req.email = decoded.email;
    //         // req.type = decoded.type;
    //         req.email = decoded.UserInfo.email;
    //         req.type = decoded.UserInfo.type;
    //         req.userId = decoded.UserInfo.userId;
    //         next();
    //     }
    // );

    //verifica daca exista token ul in redis
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const exists = (async () => { await redisClient.exists(token); })();

        if (!exists) {
            return res.status(403).json({ message: 'Token expired or revoked' });
        };

        req.email = decoded.UserInfo.email;
        req.type = decoded.UserInfo.type;
        req.userId = decoded.UserInfo.userId;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyJWT;