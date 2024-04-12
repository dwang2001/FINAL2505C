const express = require('express');
const { validateToken} = require('../middlewares/auth');
const { Images } = require('../models'); // adjust the path according to your project structure
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Op } = require("sequelize");
require('dotenv').config();



// Set up multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
  });
  
  const upload = multer({ storage });
  
  router.post("/uploadimages", upload.any(), async (req, res) => {
    console.log(req.files); // log the uploaded files
    console.log(req.body); // log the body
    
    let data = req.body;
    
    // Map through all files and create a new image record for each
    const images = req.files.map(file => ({
      icnumber: data.icnumber,
      uploadDate: new Date(),
      fileName: file.filename,
      imageUrl: path.join('uploads', file.filename),
      comments: data.comments,
      userId: data.id // Assuming 'id' is the user's ID
    }));
  
    try {
      let result = await Images.bulkCreate(images);
      res.json(result);
    }
    catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  });



  router.get('/displayimages', async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition = [{
            userId: { [Op.eq]: search }
        }];
    }
    // You can add condition for other columns here // e.g. condition.columnName = value; 
    let list = await Images.findAll({
        where: condition, order: [['createdAt', 'DESC']]
    });
    res.json(list);
    
});

module.exports = router;