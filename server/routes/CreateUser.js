const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const JwtSecret = process.env.JWT_SECRET_KEY;

router.post("/createuser", [
    body('email', 'Invalid Email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })]
    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt); 

        try {

            const existingUser = await User.findOne({ email: existingUser.email});
            if(existingUser) {
                return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
            }

            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePassword,
                location: req.body.location
            })

            res.json({ success: true });

        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

router.post("/loginuser", [
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        let email = req.body.email;
        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Try to login with valid credentials" })
            }
            
            const passwordCompare = await bcrypt.compare(req.body.password,userData.password);
            if (!passwordCompare) {
                return res.status(400).json({ errors: "Try to login with valid credentials" })
            }
            
            const data =  {
                user: {
                    id: userData.id
                }
            }

            const authToken = jwt.sign(data, JwtSecret);

            return res.json({ success: true,  authToken: authToken});

        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

module.exports = router;