const { Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../server');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    //console.log(cookies.jwt);

    const refreshToken = cookies.jwt;
    //const foundUser = await Users.findOne({ where: { token: refreshToken } });

    const exists = await redisClient.exists(refreshToken);
    if (!exists) {
        return res.status(403).json({ message: 'Refresh token expired or revoked' });
    }

    // if (!foundUser) {
    //     return res.status(403).json({ "message": "User not found" }); //Forbidden
    // }

    // evalueate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            // if (err || foundUser.email !== decoded.email) {
            //     return res.sendStatus(403); //Forbidden
            // }

            if (err) return res.sendStatus(403);

            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'email': decoded.email,
                        'type': decoded.type,
                        'userId': decoded.userId,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' /* set to 15m later */ }
            );

            // Salvăm accessToken în Redis din nou
            redisClient.set(accessToken, decoded.userId, { EX: 300 });

            res.json({
                accessToken,
                type: decoded.type
            });
        }
    );

}

module.exports = { handleRefreshToken };