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
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/refresh', require('./routes/refresh'));
app.use('/users', require('./routes/users'));
app.use('/logout', require('./routes/logout'));

db.sequelize.sync().then(() => {
    app.listen(3500, () => {
        console.log("Server running on port 3500...")
    });
})