import React, { useState, useEffect } from 'react';
import { Checkbox, Typography, Box, Paper, Button } from '@mui/material';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext.js';
import { useLocation } from 'react-router-dom';

import http from '../http.js';


function SafetyChecklist() {
  const location = useLocation();
  
  
  const { user, details } = useContext(UserContext);
  
  const defaultChecklist = [
    { text: 'Are pathways clear and wide enough for easy mobility, especially for individuals using wheelchairs or walkers?', checked: false, category: 'Accessibility:' },
    { text: 'Are doorways widened or modified to accommodate mobility aids?', checked: false, category: 'Accessibility:' },
    { text: 'Are grab bars installed near the toilet and in the shower or bathtub to assist with sitting, standing, and balance?', checked: false, category: 'Bathroom Safety:' },      
    { text: 'Is there a shower bench or chair available for individuals who have difficulty standing for long periods?', checked: false, category: 'Bathroom Safety:' },
    { text: 'Are non-slip mats placed inside and outside the bathtub or shower to prevent slips and falls?', checked: false, category: 'Bathroom Safety:' },    
    { text: 'Is the bed at an appropriate height to facilitate getting in and out easily?', checked: false, category: 'Bedroom Safety:' },
    { text: 'Are bedside tables equipped with reachable essentials, such as medications and water?', checked: false, category: 'Bedroom Safety:' },
    { text: 'Are medications stored at a reachable height and in an organized manner for easy access?', checked: false, category: 'Medication Management:' },
    { text: 'Are pill organizers or reminder systems used to ensure medications are taken on time?', checked: false, category: 'Medication Management:' },
    { text: 'Are all areas well-lit, with light switches placed at reachable heights?', checked: false, category: 'General Safety:' },
    { text: 'Are electrical cords and cables secured to prevent tripping hazards?', checked: false, category: 'General Safety:' },
    { text: 'Are emergency contact information and medical records readily available in case of emergencies?', checked: false, category: 'General Safety:' },
  ];

  const storedChecklist = localStorage.getItem('checklist');
  const initialChecklist = storedChecklist ? JSON.parse(storedChecklist) : defaultChecklist;

  const [checklist, setChecklist] = useState(initialChecklist);

  useEffect(() => {
    localStorage.setItem('checklist', JSON.stringify(checklist));
  }, [checklist]);

  const handleCheckChange = (itemToChange) => {
    const newChecklist = [...checklist];
    const index = newChecklist.findIndex(item => item.text === itemToChange.text);
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };

  const handleSave = async () => {
    try {
      const checklistJson = JSON.stringify(checklist);
      const response = await http.post('http://localhost:3001/checklist/save', { userId: user.id, name: user.name, checklist: checklistJson });
      if (response.status === 200) {
        console.log('Checklist saved successfully');
        alert('Checklist saved successfully!')
      } else {
        console.log('Failed to save checklist');
      }
    } catch (error) {
      console.error('Failed to save checklist:', error);
    }
  };

  // Group checklist items by category
  const categories = checklist.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      style={{ marginBottom: '150px' }} // Increase space beneath the form
    >
      
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ marginTop: '50px', marginBottom: '20px' }}>
        Safety Checklist
      </Typography>
      <Typography variant="body1" component="p" gutterBottom align="center" style={{ marginBottom: '10px' }}>
        Please go through the checklist below and check off the items that are in place. Then submit the form for our review.
      </Typography>
      
      <Button 
      variant="contained" 
      color="primary" 
      onClick={handleSave}
      style={{ 
        position: 'absolute', 
        top: '50px', 
        right: '60px', 
        backgroundColor: 'blue', 
        color: 'white' 
      }}
    >
      Submit
    </Button>
 
      <Box
        component={Paper}
        p={2}
        style={{ minWidth: '60%', maxWidth: '90%', width: '900px', margin: '0 auto' }}
      >
        {Object.entries(categories).map(([category, items]) => (
          <Table key={category}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h6">{category}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={item.checked}
                    onChange={() => handleCheckChange(item)}
                  />
                </TableCell>
                <TableCell>{item.checked ? '✔ ' : ''}{item.text}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        ))}
      </Box>
    </Box>
  );

}

export default SafetyChecklist;