import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext.js';
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import moment from 'moment';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../http.js'; // adjust the path to your http.js file
import { Box } from '@mui/material';
import http from '../http.js';

function MedicalRecords() {
  const location = useLocation();
  
  
  const { user, details } = useContext(UserContext);
  const navigate = useNavigate();



  if (!user) {
    // handle the case when user is null, for example, return a loading state or redirect to login
    return <div>Loading...</div>;
  }

  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf',
    onDrop: (acceptedFiles) => {
      const pdfFiles = acceptedFiles.filter(file => file.name.endsWith('.pdf'));
  if (pdfFiles.length !== acceptedFiles.length) {
    alert('Only PDF files are accepted. Non-PDF files will not be saved into our database.');
  }
  setFiles(prevFiles => [...prevFiles, ...pdfFiles.map(file => Object.assign(file, {
    preview: URL.createObjectURL(file),
    uploadedAt: new Date(),
    approved: false,
    comment: ''
      }))]);
    }
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    http.get('http://localhost:3001/records/displayimages')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSave = async () => {
    const data = new FormData();
    
    console.log('user id:', user.id)
    files.forEach((file, index) => {
      data.append('file' + index, file);
      data.append('id' + index, user.id);
      data.append('comments' + index, file.comment);
      data.append('icnumber' + index, user.icnumber); // Replace with actual IC number
    });
    
    console.log('user:',user)
    data.append('id', user.id);
  
    try {
      const response = await fetch('http://localhost:3001/records/uploadimages', {
        method: 'POST',
        body: data,
      });
  
      if (response.status === 200) {
        console.log('Data saved successfully');
        alert('Image saved successfully!')
        setFiles([]);
        
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleCommentChange = (index, event) => {
    const newFiles = [...files];
    newFiles[index].comment = event.target.value;
    setFiles(newFiles);
  };

  const handleApprovalChange = (index) => {
    const newFiles = [...files];
    newFiles[index].approved = !newFiles[index].approved;
    setFiles(newFiles);
  };
 
  const [loading, setLoading] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    http.get('http://localhost:3001/records/displayimages')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => console.error('Error:', error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleRefresh = () => {
    fetchImages();
    alert("Table updated!")
  };
  
  return (
    <div>
      
      <h1>Medical Records</h1>
      
      <Box border={1} borderColor="grey.500" borderRadius={2} p={2}>
  
  <div {...getRootProps()}>
  <h3>Please upload your medical records (in pdf) for viewing by the medical team.</h3>
    <input {...getInputProps()} />
    <h3 style={{ color: 'blue', textDecoration: 'underline' }}>Click here to upload files</h3>
  </div>
  <Table>
    <TableBody>
      {files.map((file, index) => (
        <TableRow key={file.name}>
          <TableCell>{file.name}</TableCell>
          <TableCell>{moment(file.uploadedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
          <TableCell>
            <Button onClick={() => handleApprovalChange(index)}>
              {file.approved ? 'Approved' : 'Not Approved'}
            </Button>
          </TableCell>
          <TableCell>
            <TextField
              value={file.comment}
              onChange={(event) => handleCommentChange(index, event)}
              placeholder="Enter your comment here"
            />
          </TableCell>
          <TableCell>
            <a href={file.preview} target="_blank" rel="noopener noreferrer">View Image</a>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <Button onClick={handleSave} style={{border: '1px solid #000', backgroundColor: '#2f78c5'}}>Save</Button>
</Box>
      <br>
      </br>
      <br>
      </br>
      <h2>Display all uploaded medical records</h2>
      <Button onClick={handleRefresh} style={{border: '1px solid #000', backgroundColor: '#2f78c5'}}>Refresh</Button>
      <TableContainer component={Paper} style={{ marginTop: '20px',marginBottom: '70px' }}>
      <Table>
  <TableHead>
    <TableRow>
      <TableCell>Name</TableCell>
      <TableCell>Uploaded At</TableCell>
      <TableCell>Image</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {images.map((image, index) => (
      <TableRow key={index}>
        <TableCell>{image.fileName}</TableCell>
        <TableCell>{moment(image.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
        <TableCell>
          <a href={`http://localhost:3001/${image.imageUrl}`} target="_blank" rel="noopener noreferrer">
            {`http://localhost:3001/${image.imageUrl}`}
          </a>
</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
    </div>
  );
}

export default MedicalRecords;