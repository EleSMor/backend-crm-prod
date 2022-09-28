const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./auth');
const db = require('./db');
const cors = require('cors');
const app = express();

// Routes
const indexRoutes = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const adRoutes = require('./routes/ad.routes');
const requestRoutes = require('./routes/request.routes');
const contactRoutes = require('./routes/contact.routes');
const consultantRoutes = require('./routes/consultant.routes');
const zoneRoutes = require('./routes/zone.routes');
const mailsRoutes = require('./routes/mails.routes');

db.connect();

// Settings
const PORT = process.env.PORT || 3500;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    return next();
});

app.use(cors({
    origin: ['http://157.230.97.167', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'asd!WQe!"3d.asd0/)12/3Adcq',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 14 * 3600 * 1000,
    },
    store: MongoStore.create({ mongoUrl: db.DB_URL }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Consultant authentication validator
app.use((req, res, next) => {
    req.isAdmin = false;

    if (!req.isAuthenticated()) {
        return next();
    } else {
        req.isUser = true;
    }

    if (req.user && req.user.role === 'Admin') {
        req.isAdmin = true;
    }

    return next();
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/ads', adRoutes);
app.use('/requests', requestRoutes);
app.use('/contacts', contactRoutes);
app.use('/consultants', consultantRoutes);
app.use('/zones', zoneRoutes);
app.use('/mails', mailsRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})

module.exports = app;