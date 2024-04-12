const express = require('express');
const router = express.Router();

const { User } = require('../models');
const { Op } = require("sequelize");
require('dotenv').config();

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    try{
        if (search) {
            condition[Op.or] = [
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        // You can add condition for other columns here // e.g. condition.columnName = value; 
        let list = await User.findAll({
            where: condition, order: [['createdAt', 'DESC']]
        });
        res.json(list);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


router.get("/info/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    try{
        if (search) {
            condition.email = { [Op.like]: `%${search}%` };
        }
        // You can add condition for other columns here // e.g. condition.columnName = value; 
        let user = await User.findOne({
            where: condition,
            attributes: ['role'], // Only select the 'role' column
            order: [['createdAt', 'DESC']]
        });
        if (user) {
            res.json(user.role);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/username/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    try{
        if (search) {
            condition.email = { [Op.like]: `%${search}%` };
        }
        // You can add condition for other columns here // e.g. condition.columnName = value; 
        let user = await User.findOne({
            where: condition,
            attributes: ['name'], // Only select the 'role' column
            order: [['createdAt', 'DESC']]
        });
        if (user) {
            res.json(user.role);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
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
        role: yup.string().trim().required('Role is required').oneOf(['Admin', 'Doctor', 'Nurse', 'Patient', 'Caregiver'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        phonenumber: yup.string().trim().max(8, 'Phone Number must be atmost 8 characters').required('Phone is required'),
        address: yup.string().trim().max(100).required('Address is required'),
        icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
        caregivername: yup.string().trim().max(100).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        caregiveremail: yup.string().trim().lowercase().email('Caregiver Email must be a valid Email').max(100).required('Caregiver Email is required'),
        medicalCondition: yup.string().trim().max(1000).required('Medical Condition is required'),
        docemail: yup.string().trim().lowercase().email('Doctor Email must be a valid Email').max(100).required('Doctor Email is required'),
        nurseemail: yup.string().trim().lowercase().email('Nurse Email must be a valid Email').max(100).required('Nurse Email is required'),

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