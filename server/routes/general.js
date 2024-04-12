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



router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition.icnumber = search;
    }
    let list = await User.findAll({
        where: condition, order: [['createdAt', 'DESC']]
    });
    res.json(list);
});


router.post('/reset-password', async (req, res) => {
    try {
      const { email, randomPassword } = req.body; // Destructure email and randomPassword from req.body
      
      console.log(randomPassword);
      // Send email with nodemailer
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: 'atislearning@outlook.com', // Your Outlook email address
          pass: 'Et6utno6%', // Your Outlook email password
        },
      });
  

      const mailOptions = {
        from: 'atislearning@outlook.com',
        to: email, // Use the email from req.body
        subject: 'SavingLives Hospital - Password Reset for DischargeEase App',
        text: `Your password has been reset to ${randomPassword}. Please login in using this temporary password to change your password.`
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'An error occurred while sending email.' });
    }
});

router.get("/searchid", async (req, res) => {
    let condition = {};
    let email = req.query.email;
    if (email) {
      condition = [{
        email: { [Op.like]: `%${email}%` }
      }];
    }
    let list = await User.findAll({
      where: condition, order: [['createdAt', 'DESC']]
    });
    res.json(list);
  });


// PUT endpoint to update password

router.put("/reset/:id", async (req, res) => {
    let id = req.params.id;
    console.log('id:', id);
    let user = await User.findByPk(id);
    console.log('user:', user);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    console.log('req.body:', data);
    
    try {
        data.tempPassword = await bcrypt.hash(data.tempPassword, 10);
        console.log('data.password:', data.tempPassword);
        
        // Call update on the user instance
        let num = await user.update({ tempPassword: data.tempPassword });
        console.log('num:', num);
        // ...
    } catch (err) {
        console.log('error:', err);
        res.status(400).json({ errors: err.errors });
    }
});


// PUT endpoint to update password

router.put("/change/:id", async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
      res.sendStatus(404);
      return;
    }
  
    let data = req.body;
    
    try {
      data.fullPassword = await bcrypt.hash(data.fullPassword, 10);
       
      // Call update on the user instance
      let num = await user.update({ fullPassword: data.fullPassword, tempPassword: null});
      // ...
    } catch (err) {
      console.log('error:', err);
      res.status(400).json({ errors: err.errors });
    }
  });



module.exports = router;
