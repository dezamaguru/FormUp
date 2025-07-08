const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");


const getOneUser = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { userId: req.userId }
    });
    console.log("User:", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = page * pageSize;
    const limit = pageSize;

    const { rows: users, count } = await Users.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ data: users, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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

const deleteFcmToken = async (req, res) => {
  try {
    await Users.update({ fcmToken: null }, {
      where: { userId: req.userId }
    });
    res.status(200).json({ message: "Token FCM șters cu succes" });
  } catch (err) {
    console.error("Eroare la ștergerea tokenului FCM:", err);
    res.status(500).json({ message: "Eroare server" });
  }
}

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
      an_studiu: an_studiu
    });
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findUserByEmail = async (req, res) => {
  try {
    const { partial } = req.query;
    if (!partial || partial.length < 2) {
      return res.status(400).json({ message: "Căutarea este prea scurtă." });
    }

    const students = await Users.findAll({
      where: {
        email: {
          [Op.like]: `%${partial}%`
        },
        type: 'student'
      },
      attributes: ['userId', 'email', 'firstName', 'lastName']
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Eroare server", error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [updated] = await Users.update(req.body, {
      where: { userId: id }
    });

    if (updated) {
      const updatedUser = await Users.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      return res.status(200).json(updatedUser);
    }

    res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
  } catch (err) {
    res.status(500).json({ message: 'Eroare la actualizare', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await Users.destroy({ where: { userId: id } });
  res.status(200).json({ message: "User deleted" });
}

module.exports = {
  getAllUsers, registerUser, updateFcmToken,
  deleteFcmToken, getOneUser, findUserByEmail,
  updateUser, deleteUser
};