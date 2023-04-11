const { body } = require("express-validator");
const User = require("../models/user");

exports.signupValidator = [
    body("email")
        .isEmail()
        .withMessage("Please enter your valid email address")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if(userDoc) return Promise.reject("Email address already exists");
            });
        })
        .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body('firstname').trim().not().isEmpty(),
    body('lastname').trim().not().isEmpty(),
];