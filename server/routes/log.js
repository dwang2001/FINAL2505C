const express = require('express');
const router = express.Router();
const { Log } = require('../models');
const yup = require("yup");
const { Op } = require("sequelize");
const { validateToken, adminOnly } = require('../middlewares/auth');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { type } = require('os');

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            {typeofchange: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here // e.g. condition.columnName = value; 
    let list = await Log.findAll({
        where: condition, order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let log = await Log.findByPk(id);
    // Check id not found 
    if (!log) {
        res.sendStatus(404);
        return;
    }
    res.json(log);
});


router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    const uuid = uuidv4();
    // Convert UUID to a hash using SHA-1
    const hash = crypto.createHash('sha1').update(uuid).digest('hex');
    // Convert hash to a number
    const number = parseInt(hash, 16) % Number.MAX_SAFE_INTEGER % 1000;
    data.id = number;
    console.log(data.id)
    

    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().max(100).required('Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email('Email must be a valid Email').max(100).required('Email is required'),
        fullPassword: yup.string().trim().min(8, 'Password must be atleast 8 characters').max(100, 'Password must be atmost 50 characters').required('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
        role: yup.string().trim().required('Role is required').oneOf(['Admin', 'Doctor', 'Nurse', 'Patient', 'Caregiver'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        phonenumber: yup.string().trim().max(8).required('Phone is required'),
        address: yup.string().trim().max(100).required('Address is required'),
        icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
        typeofchange: yup.string().trim().required('Type of Change is required').oneOf(['Create', 'Update', 'Delete'], "Type of Change must be one of: Create, Update, Delete"),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Log.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

module.exports = router;


