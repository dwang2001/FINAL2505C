import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';


function Patient() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const validationSchema = yup.object({
      name: yup.string().trim().max(100).required('Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
      email: yup.string().trim().lowercase().email('Email must be a valid Email').max(100).required('Email is required'),
      fullPassword: yup.string().trim().min(8, 'Password must be atleast 8 characters').max(100, 'Password must be atmost 50 characters').required('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
      phonenumber: yup.string().trim().max(8, 'Phone Number must be atmost 8 characters').required('Phone is required'),
      address: yup.string().trim().max(100).required('Address is required'),
      icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
      caregivername: yup.string().trim().max(100).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
      caregiveremail: yup.string().trim().lowercase().email('Caregiver Email must be a valid Email').max(100).required('Caregiver Email is required'),
        
    });

    // Function to handle file upload
    const handleFileUpload = (event) => {
      setFile(event.target.files[0]);
      };

    const handleSubmit = async (values) => {

        
      http.put(`/patient/${values.id}`, values)
      .then((res) => {
          console.log(res.data);
          toast.success("User Updated Successfully");
         alert("User details updated successfully!");
      })
      .catch((error) => {
          console.error("Error updating user:", error);
      });
    http.post('/log', values)
      .then((res) => {
          console.log("Change logged successfully:", res.data);
      })
      .catch((error) => {
          console.error("Error logging change:", error);
      });
  };


    return (
        <div>
            <h1>Welcome {user.name}</h1>
            <Formik
                initialValues={user}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Box display="flex" justifyContent="flex-end" mt={2} mb={3}>
                            <Button type="submit" sx={{ backgroundColor: 'blue', border: '2px solid black' }}>Save Changes</Button>
                        </Box>
                        <Table sx={{ backgroundColor: '#FDFEFE', mb: 6 }}>
                        
                            <TableBody>
                              <TableRow>
                                    
                               <TableCell>User ID</TableCell>
                                    <TableCell>
                                        <Field name="id" type="text" disabled/>
                                        {errors.id && touched.id ? <div>{errors.id}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>
                                        <Field name="name" type="text" />
                                        {errors.name && touched.name ? <div>{errors.name}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>
                                        <Field name="email" type="email" />
                                        {errors.email && touched.email ? <div>{errors.email}</div> : null}
                                    </TableCell>
                                </TableRow>
                                
                                <TableRow>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>
                                        <Field name="phonenumber" type="text" />
                                        {errors.phonenumber && touched.phonenumber ? <div>{errors.phonenumber}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Address</TableCell>
                                    <TableCell>
                                        <Field name="address" type="text" />
                                        {errors.address && touched.address ? <div>{errors.address}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>NRIC</TableCell>
                                    <TableCell>
                                        <Field name="icnumber" type="text" />
                                        {errors.icnumber && touched.icnumber ? <div>{errors.icnumber}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Caregiver Name</TableCell>
                                    <TableCell>
                                        <Field name="caregivername" type="text" />
                                        {errors.caregivername && touched.caregivername ? <div>{errors.caregivername}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Caregiver Email</TableCell>
                                    <TableCell>
                                        <Field name="caregiveremail" type="email" />
                                        {errors.caregiveremail && touched.caregiveremail ? <div>{errors.caregiveremail}</div> : null}
                                    </TableCell>
                                </TableRow>
                          
                                
                                <TableRow>
                                    <TableCell>Role</TableCell>
                                    <TableCell>
                                        <Field name="role" type="text" disabled />
                                        {errors.role && touched.role ? <div>{errors.role}</div> : null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Medical Issue</TableCell>
                                    <TableCell>
                                        <Field name="medicalCondition" type="text" disabled />
                                        {errors.role && touched.role ? <div>{errors.role}</div> : null}
                                    </TableCell>
                                </TableRow>
                                {/* Add more rows as needed for other user details */}
                            </TableBody>
                        </Table>
                        
                    </Form>

                    
                )}
            </Formik>
        </div>
        
    );
}

export default Patient;