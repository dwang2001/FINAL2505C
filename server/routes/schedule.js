const express = require('express');
const router = express.Router();
const { Schedule } = require('../models');
const yup = require("yup");
const { validateToken, adminOnly } = require('../middlewares/auth');
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const { User } = require('../models');


router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { id: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
            { service: { [Op.like]: `%${search}%` } },
            { patientname: { [Op.like]: `%${search}%` } },
            { nursename: { [Op.like]: `%${search}%` } },
            { doctorname: { [Op.like]: `%${search}%` } },
        ];
    }
    let minDate = req.query.minDate;
    let maxDate = req.query.maxDate;
    if (minDate && maxDate) {
        condition.eventDate = {
            [Op.between]: [minDate, maxDate]
        };
    }
    else if (minDate) {
        condition.eventDate = {
            [Op.gte]: minDate
        };
    }
    else if (maxDate) {
        condition.eventDate = {
            [Op.lte]: maxDate
        };
    }
    // You can add condition for other columns here // e.g. condition.columnName = value; 
    let list = await Schedule.findAll({
        where: condition, order: [['datetime', 'ASC']]
    });
    res.json(list);
});

router.get("/myschedule", async (req, res) => {
        let currentusername = req.query.currentusername; // Retrieve current username from query parameters
        let condition = {};
        let search = req.query.search;
        if (search) {
            // Construct search condition
            condition[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { status: { [Op.like]: `%${search}%` } },
                { service: { [Op.like]: `%${search}%` } },
                { patientname: { [Op.like]: `%${search}%` } },
                { nursename: { [Op.like]: `%${search}%` } },
                { doctorname: { [Op.like]: `%${search}%` } },
            ];
        }
        let minDate = req.query.minDate;
        let maxDate = req.query.maxDate;
        if (minDate && maxDate) {
            // Construct date range condition
            condition.eventDate = {
                [Op.between]: [minDate, maxDate]
            };
        }
        else if (minDate) {
            condition.eventDate = {
                [Op.gte]: minDate
            };
        }
        else if (maxDate) {
            condition.eventDate = {
                [Op.lte]: maxDate
            };
        }
    
        // Fetch schedules where current username matches either patientname, nursename, or doctorname
        let list = await Schedule.findAll({
            where: {
                [Op.or]: [
                    { patientname: currentusername },
                    { nursename: currentusername },
                    { doctorname: currentusername },
                    condition, 
                ]
            },
            order: [['datetime', 'ASC']],
            logging: console.log // Log the generated SQL query
        });
        res.json(list);
    });

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let schedule = await Schedule.findByPk(id);
    // Check id not found 
    if (!schedule) {
        res.sendStatus(404);
        return;
    }
    res.json(schedule);
});



router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let schedule = await Schedule.findByPk(id);
    if (!schedule) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        patientname: yup.string().trim().max(100).required('Patient Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        nursename: yup.string().trim().max(100).required('NurseName is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        doctorname: yup.string().trim().max(100).required('Doctor Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        datetime: yup.date().required('Date is required'),
        service: yup.string().trim().required('Service is required').oneOf(['Medication Counseling', 'Caregiver Training', 'Home Safety Assessments'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        status: yup.string().trim().required('Status is required').oneOf(['Allocated', 'Completed', 'Cancelled'], "Status must be one of: Allocated, Completed, Cancelled"),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Schedule.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Schedule record was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Schedule with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check if Schedule with id exists
    let schedule = await Schedule.findByPk(id);
    if (!schedule) {
        res.sendStatus(404);
        return;
    }

    // Check if request Schedule id matches the Schedule's id
    /*let userId = req.Schedule.id;
    if (userId !== Schedule.id) {
        res.sendStatus(403);
        return;
    }*/

    let num = await Schedule.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Schedule was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Schedule with id ${id}.`
        });
    }
});

router.post("/allocate", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    // Validate request body
    let validationSchema = yup.object({
        patientname: yup.string().trim().max(100).required('Patient Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        nursename: yup.string().trim().max(100).required('Nurse Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        doctorname: yup.string().trim().max(100).required('Doctor Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
        datetime: yup.date().required('Date is required'),
        service: yup.string().trim().required('Service is required').oneOf(['Medication Counseling', 'Caregiver Training', 'Home Safety Assessments'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        status: yup.string().trim().required('Status is required').oneOf(['Allocated', 'Completed', 'Cancelled'], "Status must be one of: Allocated, Completed, Cancelled"),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Schedule.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});




  
module.exports = router;
