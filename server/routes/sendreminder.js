const express = require('express');
const router = express.Router();
const { Schedule } = require('../models');
const yup = require("yup");
const { validateToken, adminOnly } = require('../middlewares/auth');
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const { User } = require('../models');
const { schedule } = require('node-cron');

router.get("/", async (req, res) => {
    try {
        // Fetch all schedules from the database
        const schedules = await Schedule.findAll();

        // Extract datetime values from the schedules
        const datetimeList = schedules.map(schedule => new Date(schedule.datetime));
        const patientnameList = schedules.map(schedule => schedule.patientname);
        const nursenameList = schedules.map(schedule => schedule.nursename);
        const doctornameList = schedules.map(schedule => schedule.doctorname);
        const servicenamelist = schedules.map(schedule => schedule.service);
        const remindersentList = schedules.map(schedule => schedule.remindersent);
        const idList = schedules.map(schedule => schedule.id);
        console.log(datetimeList, patientnameList, nursenameList, doctornameList)
        // Iterate over the datetime list
        for (let i = 0; i < datetimeList.length; i++) {
            const datetime = datetimeList[i];
            const patientname = patientnameList[i];
            const nursename = nursenameList[i];
            const doctorname = doctornameList[i];
            const servicename = servicenamelist[i];
            const remindersent = remindersentList[i];
            const id = idList[i];

            var emailCCList = []
            // Check if the datetime matches the current datetime
            console.log(datetime.getTime() - new Date().getTime() >= 0 && datetime.getTime() - new Date().getTime() <= 86400000)
            if (datetime.getTime() - new Date().getTime() >= 0 && datetime.getTime() - new Date().getTime() <= 86400000) {

                try {
                    if (remindersent === "Yes") {
                        console.log("Reminder already sent");
                        continue;
                    }

                    const options = {
                        year: 'numeric', month: 'short', day: '2-digit',
                        hour: '2-digit', minute: '2-digit',hour12: true
                      };
                    var readableDate = datetime.toLocaleString('en-US',options);
                    // get the email of the user
                    console.log(patientname)
                    const user = await User.findOne({ where: { name: patientname } });
                    var useremail = user.email;
                    console.log(useremail);
                    // get the email of the caregiver
                    var caregiveremail = user.caregiveremail;
                    emailCCList.push(caregiveremail);
                    // get the email of the nurse
                    const nurseuser = await User.findOne({ where: { name: nursename } });   
                    var nurseemail = nurseuser.email;   
                    emailCCList.push(nurseemail);  
                    // get the email of the doctor
                    const doctoruser = await User.findOne({ where: { name: doctorname } });
                    var docemail = doctoruser.email;                    
                    emailCCList.push(docemail);
                    console.log(emailCCList);
                    // Send email with nodemailer
                    const mailOptions = {
                        from: 'gerhard.goldner60@ethereal.email',
                        to: useremail,
                        subject: `SavingLives Hospital - Service Appointment Reminder for ${patientname}`,
                        text: `You have a service appointment tommorow on ${readableDate}.
                        The service is ${servicename}. Please be on time.`,
                        cc: emailCCList
                    };
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        auth: {
                            user: 'gerhard.goldner60@ethereal.email',
                            pass: 'Kst4rEHC9381mzckYj'
                        }
                    });
                    await transporter.sendMail(mailOptions);
                    console.log("Email sent successfully");
                    // Update the remindersent field in the database
                    await Schedule.update({ remindersent: "Yes" }, { where: { id: id } });
                } catch (error) {
                    console.error('Error sending email:', error)
                }

            }
        }
    } catch (error) {
        console.error("Error fetching datetime list:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;