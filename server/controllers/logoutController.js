const { Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogout = async (req, res) => {  
    // On client, also delete the acces token 
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(204); // Succesfull but no content to send back
    }
    const refreshToken = cookies.jwt;

    //Is refresh token in database?
    const foundUser = await Users.findOne({ where: { token: refreshToken } });
    if(!foundUser) {
        res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None'});
        return res.sendStatus(204);
    }

    //delete refresh token from db
    foundUser.token = null;
    await foundUser.save();

    res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None'}); //secure: true - only works on https
    res.sendStatus(204);
}

module.exports = { handleLogout };