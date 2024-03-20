const { promisify } = require('util');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');


// Json Web Token 

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// general function for sending response

const createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);

    // using hhtpOnly cookie to send JWT

    let cookieOption = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOption.secure = true;
    }

    res.cookie('jwt', token, cookieOption)

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

// Controller for Signing Up User.

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 201, res);
});

// Controller for Loging In User.

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exists
    if (!email || !password) {
        return next(new AppError(400, 'please provide email and password!'));
    }

    // Check if user exists 
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new AppError(401, 'Incorrect email or password'));
    }

    //Checking if the password is correct
    const isCorrect = await user.correctPassword(password, user.password);

    if (!isCorrect) {
        return next(new AppError(401, 'Incorrect email or password'));
    }

    // Send the jwt to the client
    createSendToken(user, 200, res);

})

exports.protect = catchAsync(async (req, res, next) => {

    let token;
    // get token check if it exisits
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    console.log(token);
    if (!token) {
        return next(new AppError(401, `you are not logged in! please login first`))
    }

    // token verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError(401, 'User belongs to this token no longer exists'));
    }

    req.user = freshUser;
    next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // check if posted current password is correct
    const isCorrect = await user.correctPassword(req.body.passwordCurrent, user.password);

    if (!isCorrect) {
        return next(new AppError(400, 'Your current password is maching.'))
    }

    // if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    // log user in, send jwt
    createSendToken(user, 200, res);
});