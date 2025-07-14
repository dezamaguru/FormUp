const bcrypt = require('bcrypt');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../server');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 'message': 'Email and password are required' });
    }

    const foundUser = await Users.findOne({ where: { email: email } });

    if (!foundUser) {
        return res.status(401).json({ "message": "User not found in database" }); //Unauthorized
    }
    // evalueate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        const type = foundUser.type;
        //create JWTs
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'email': foundUser.email,
                    'type': foundUser.type,
                    'userId': foundUser.userId,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            //change expire time to 15m later
            { expiresIn: '5m' }
        );
        const refreshToken = jwt.sign(
            {
                'email': foundUser.email,
                'type': foundUser.type,
                'userId': foundUser.userId,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '10m' }
        );

        //salevaza token in redis (cheie: token , valoare: userId)
        await redisClient.set(accessToken, foundUser.userId, {EX: 360}); //5 minute
        await redisClient.set(refreshToken, foundUser.userId, { EX: 86400  }); // 1 day

        //send token to user as a cookie 
        //set cookie as httpOnly so it is no available to javascript
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 /* 1 day */ });
        res.json({ type, accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };