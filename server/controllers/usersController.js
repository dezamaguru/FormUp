const { Users } = require('../models');
const bcrypt = require('bcrypt'); 

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateFcmToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: "Tokenul lipsește" });

  try {
    await Users.update({ fcmToken: token }, {
      where: { userId: req.userId }
    });
    res.status(200).json({ message: "Token salvat cu succes" });
  } catch (err) {
    console.error("Eroare la salvarea tokenului:", err);
    res.status(500).json({ message: "Eroare server" });
  }
};

const registerUser = async (req, res) => {
    const { lastName, firstName, email, password, type, program_studiu, an_studiu } = req.body;
    
        try {
            const hash = await bcrypt.hash(password, 10);
            await Users.create({
                lastName: lastName,
                firstName: firstName,
                email: email,
                password: hash,
                type: type,
                program_studiu: program_studiu,
                an_studiu : an_studiu
            });
            res.json({ message: "User created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, registerUser, updateFcmToken };