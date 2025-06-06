const { Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../server');

const handleLogout = async (req, res) => {
    // On client, also delete the acces token 
    const cookies = req.cookies;
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.split(' ')[1];
    const refreshToken = cookies.jwt;

    if (accessToken) {
        await redisClient.del(accessToken); // Șterge tokenul JWT
    }

    // if (!cookies?.jwt) {
    //     return res.sendStatus(204); // Succesfull but no content to send back
    // }

    //Is refresh token in database?

    if (refreshToken) {
        await redisClient.del(refreshToken);// elimina refreshToken-ul din redis

        // const foundUser = await Users.findOne({ where: { token: refreshToken } });
        // if (!foundUser) {
        //     res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None' });
        //     return res.sendStatus(204);
        // }

        //delete refresh token from db
        // foundUser.token = null;
        // await foundUser.save();

    }

    //res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None' }); //secure: true - only works on https
    res.sendStatus(204); //no content
}

module.exports = { handleLogout };