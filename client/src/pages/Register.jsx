import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, TextField, Button, MenuItem,Grid} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import Datetime from 'react-datetime';
import Date from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../dropdowns/Roles';






function Register() {
    const navigate = useNavigate();
    const [setRoles] = useState([]);
    const roles = ['Admin', 'Doctor', 'Nurse', 'Patient', 'Caregiver'];

    const fetchRoles = async () => {
        try {
            const response = await http.get('/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const currentID = localStorage.getItem("id");
    useEffect(() => {
        http.get(`/user/${currentID}`,).then((res) => {
            if (res.data.role === 'Admin') {
                fetchRoles();
            } else {
                navigate("/profilePage");
                alert("You are not authorized to view this page");
            }

        });
    }, []);


    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const formik = useFormik({
        initialValues: {
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
        },
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
            data.typeofchange = 'Create';
            http.post('/user/register', data)
                .then((res) => {
                    console.log(res.data);
                    alert('User registered successfully');
                    navigate("/users");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                    console.log(err.response);
                });

            http.post('/log', data)
                .then((res) => {
                    console.log("Change logged successfully:", res.data);
                })
                .catch((error) => {
                    console.error("Error logging change:", error);
                });

        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1 className="welcome-message">Please fill up the relevant fields to sign up</h1>
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
                    label="Password"
                    name="fullPassword"
                    value={formik.values.fullPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullPassword && Boolean(formik.errors.fullPassword)}
                    helperText={formik.touched.fullPassword && formik.errors.fullPassword}
                />

                <TextField
                    fullWidth
                    select
                    margin="dense"
                    autoComplete="off"
                    multiline
                    minRows={2}
                    label="Role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                >

                    {roles.map(role => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                </TextField>
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
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}
                        type="submit">
                        Register
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
