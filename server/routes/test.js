const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
require('dotenv').config();

// Generate random password
const randomPassword = Math.random().toString(36).slice(-8);

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().max(100).required('Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email('Email must be a valid Email').max(100).required('Email is required'),
        fullPassword: yup.string().trim().min(8, 'Password must be atleast 8 characters').max(100, 'Password must be atmost 50 characters').required('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
        role: yup.string().trim().required('Role is required').oneOf(['Admin', 'Doctor', 'Nurse', 'Patient', 'Caregiver'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        phonenumber: yup.string().trim().max(8).required('Phone is required'),
        address: yup.string().trim().max(100).required('Address is required'),
        icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }
        data.caregivername = data.caregivername ? data.caregivername : '';
        data.caregiveremail = data.caregiveremail ? data.caregiveremail : '';
        data.medicalCondition = data.medicalCondition ? data.medicalCondition : '';
        // Hash passowrd
        data.fullPassword = await bcrypt.hash(data.fullPassword, 10);
        // Create user
        let result = await User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        fullPassword: yup.string().trim().min(8).max(50).required().matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
            "password at least 1 letter and 1 number"),

    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        let match = await bcrypt.compare(data.fullPassword, user.fullPassword);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });

    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.get("/auth", (req, res) => {
    if (req.user) {
        let userInfo = {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name
        };
        res.json({
            user: userInfo
        });
    } else {
        res.status(400).json({ error: 'User information not available' });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { id: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here // e.g. condition.columnName = value; 
    let list = await User.findAll({
        where: condition, order: [['createdAt', 'DESC']]
    });
    res.json(list);

});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    // Check id not found 
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json(user);
});

router.get("/:role", async (req, res) => {
    let role = req.params.role;
    let user = await User.findByPk(role);
    // Check id not found 
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json(user);
});



router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().max(100).required('Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email('Email must be a valid Email').max(100).required('Email is required'),
        fullPassword: yup.string().trim().min(8, 'Password must be atleast 8 characters').max(100, 'Password must be atmost 50 characters').required('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
        role: yup.string().trim().required('Role is required').oneOf(['Admin', 'Doctor', 'Nurse', 'Patient', 'Caregiver'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        phonenumber: yup.string().trim().max(8).required('Phone is required'),
        address: yup.string().trim().max(100).required('Address is required'),
        icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User record was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update User with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check if user with id exists
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    // Check if request user id matches the user's id
    /*let userId = req.user.id;
    if (userId !== user.id) {
        res.sendStatus(403);
        return;
    }*/

    let num = await User.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "User was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete user with id ${id}.`
        });
    }
});


module.exports = router;
