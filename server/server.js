const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
app.use(credentials);
app.use(cors(corsOptions)); 
app.use(express.json());

app.use(bodyParser.json());

//Redis
const client = redis.createClient({url: 'redis://127.0.0.1:6379'})
client.on('error', err => console.log('Redis client Error', err));

(async () => {
  await client.connect();
})();

// client.set("Web", "Js");
// console.log(client.get("Web"));

module.exports = client; 

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
app.use('/solicitari', require('./routes/solicitariRoute'));
app.use('/adeverinte', require('./routes/adeverinteRoute'));
app.use('/inbox', require('./routes/conversatiiRoute'));
app.use('/firebase', require('./routes/FirebaseRoute'));

db.sequelize.sync().then(() => {    
    app.listen(3500, () => {
        console.log("Server running on port 3500...")
    });
})

// db.sequelize.sync({ alter: true }).then(() => { // Adaugă { alter: true }
//     app.listen(3500, () => {
//         console.log("Server running on port 3500...");
//     });
// }).catch((err) => {
//     console.error("Eroare la sincronizarea bazei de date:", err);
// });