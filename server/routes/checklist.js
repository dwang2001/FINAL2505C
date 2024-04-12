const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Checklist, User } = require('../models');

const app = express();
router.use(bodyParser.json());

router.post('/save', async (req, res) => {
    try {
      const { userId, name, checklist } = req.body;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const newChecklist = await Checklist.create({ name, checklist });
        await user.addChecklist(newChecklist);
      res.status(200).json(newChecklist);
    } catch (error) {
      console.error('Failed to create checklist:', error);
      res.status(500).json({ error: 'Failed to create checklist' });
    }
  });

  
  module.exports = router;