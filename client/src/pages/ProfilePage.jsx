import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';



function ProfilePage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        fullPassword: '',
        role: '',
        phonenumber: '',
        address: '',
        icnumber: '',
        caregivername: '',
        caregiveremail: '',
        medicalCondition: '',
        docemail: '',
        nurseemail: '',
    });

    const [loading, setLoading] = useState(true);
    const currentID = localStorage.getItem("id");

    useEffect(() => {

        http.get(`/user/${currentID}`,).then((res) => {
            setUser(res.data);
            setLoading(false);
        });
    }, []);



    const formik = useFormik({

        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim().max(100).required('Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim().lowercase().email('Email must be a valid Email').max(100).required('Email is required'),
            fullPassword: yup.string().trim().min(8, 'Password must be atleast 8 characters').max(100, 'Password must be atmost 50 characters').required('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
            role: yup.string().trim().required('Role is required').oneOf(['Admin', 'Doctor', 'Nurse', 'Patient', 'Caregiver'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
            phonenumber: yup.string().trim().max(8).required('Phone is required'),
            address: yup.string().trim().max(100).required('Address is required'),
            icnumber: yup.string().trim().max(100).required('NRIC is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Nric must contain at least 1 letter and 1 number"),
            caregivername: yup.string().trim().max(100).matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , .").nullable(),
            caregiveremail: yup.string().trim().lowercase().email('Caregiver Email must be a valid Email').max(100).nullable(),
            medicalCondition: yup.string().trim().max(1000).nullable(),

        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.fullPassword = data.fullPassword.trim();
            data.role = data.role.trim();
            data.phonenumber = data.phonenumber.trim();
            data.address = data.address.trim();
            data.icnumber = data.icnumber.trim();
            data.caregivername = data.caregivername.trim();
            data.caregiveremail = data.caregiveremail.trim();
            data.medicalCondition = data.medicalCondition.trim();
            data.edittedBy = currentID;
            data.typeofchange = 'Update';
            http.put(`/user/${currentID}`, data)
                .then((res) => {
                    alert("User Updated Successfully");
                    navigate("/users");
                })
                .catch((error) => {
                    alert("Error updating user");
                });
                data.userID = currentID;
            http.post('/log', data)
                .then((res) => {
                    alert("Log Created Successfully");
                })
                .catch((error) => {
                    alert("Error creating log");
                });

        }
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteUser = () => {
        http.delete(`/user/${id}`)
            .then((res) => {
                console.user(res.data);
                alert("User Deleted Successfully");
                navigate("/users");
            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                View Profile Page
            </Typography>
            {
                !loading && (
                    <Box component="form" sx={{ maxWidth: '500px' }}
                        onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Phone Number"
                            name="phonenumber"
                            value={formik.values.phonenumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phonenumber && Boolean(formik.errors.phonenumber)}
                            helperText={formik.touched.phonenumber && formik.errors.phonenumber}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="IC Number"
                            name="icnumber"
                            value={formik.values.icnumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.icnumber && Boolean(formik.errors.icnumber)}
                            helperText={formik.touched.icnumber && formik.errors.icnumber}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Caregiver Name"
                            name="caregivername"
                            value={formik.values.caregivername}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.caregivername && Boolean(formik.errors.caregivername)}
                            helperText={formik.touched.caregivername && formik.errors.caregivername}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Caregiver Email"
                            name="caregiveremail"
                            value={formik.values.caregiveremail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.caregiveremail && Boolean(formik.errors.caregiveremail)}
                            helperText={formik.touched.caregiveremail && formik.errors.caregiveremail}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Medical Condition"
                            name="medicalCondition"
                            value={formik.values.medicalCondition}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.medicalCondition && Boolean(formik.errors.medicalCondition)}
                            helperText={formik.touched.medicalCondition && formik.errors.medicalCondition}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                        </Box>
                    </Box>

                )}
        </Box>
    );
}
export default ProfilePage;