//for environment variables
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// --------handling uncaughtException---------

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!, Shutting down...');
    console.log(err.name, err.message);    
    process.exit(1);
});


dotenv.config();

const db = require('./db');

const GlobalErrorHandler = require('./src/controllers/ErrorController');

const AuthRouter = require('./src/routes/AuthRoutes');
const UserRouter = require('./src/routes/UserRoutes');
const AppError = require('./src/utils/AppError');

const app = express();
app.use(cors());
db();


app.use(express.json());
app.use(cookieParser());

app.use((req,res,next) => {
    // console.log(req.cookies);
    next();
})

// Mounting Auth Router
app.use('/api', AuthRouter);
app.use('/api', UserRouter)

// handling non-initialized route
app.all('*', (req, res, next) => {
    next(new AppError(404, "wrong route!"));
});

app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
})


// ---------handling promise rejection------------ 

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION, Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});