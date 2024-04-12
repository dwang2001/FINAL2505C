const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken} = require('../middlewares/auth');
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
require('dotenv').config();

// Generate random password
const randomPassword = Math.random().toString(36).slice(-8);


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
        phonenumber: yup.string().trim().max(8, 'Phone Number must be atmost 8 characters').required('Phone is required'),
        address: yup.string().trim().max(100).required('Address is required'),
        icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
        caregivername: yup.string().trim().max(100).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        caregiveremail: yup.string().trim().lowercase().email('Caregiver Email must be a valid Email').max(100).required('Caregiver Email is required'),
        medicalCondition: yup.string().trim().max(1000).required('Medical Condition is required'),
       

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




module.exports = router;
