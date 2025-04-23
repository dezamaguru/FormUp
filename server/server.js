const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

app.use(credentials);

app.use(cors(corsOptions)); 

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

const db = require('./models')

// Routes
app.use('/login', require('./routes/loginRoute'));
app.use('/register', require('./routes/registerRoute'));
app.use('/refresh', require('./routes/refreshRoute'));
app.use('/users', require('./routes/usersRoute'));
app.use('/logout', require('./routes/logoutRoute'));
app.use('/cereri', require('./routes/cereriRoute'));
app.use('/adeverinte', require('./routes/adeverinteRoute'));

// db.sequelize.sync().then(() => {
//     app.listen(3500, () => {
//         console.log("Server running on port 3500...")
//     });
// })

db.sequelize.sync({ alter: true }).then(() => { // Adaugă { alter: true }
    app.listen(3500, () => {
        console.log("Server running on port 3500...");
    });
}).catch((err) => {
    console.error("Eroare la sincronizarea bazei de date:", err);
});