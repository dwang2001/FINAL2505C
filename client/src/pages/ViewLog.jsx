import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@mui/material';
import { useRoles } from '../dropdowns/Roles';
import { toast } from 'react-toastify';


function ViewLog() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [log, setLog] = useState({
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
        typeofchange: '',
        edittedBy: ''
    });

    const [loading, setLoading] = useState(true);
    const currentID = localStorage.getItem("id");

    useEffect(() => {

        http.get(`/user/${currentID}`,).then((res) => {
            if (res.data.role === 'Admin') {
                console.log(res.data);
            } else {
                navigate("/profilePage");
                alert("You are not authorized to view this page");
            }
        });
    }, []);

    useEffect(() => {
        http.get(`/log/${id}`)
            .then((res) => {
                setLog(res.data);
                setLoading(false);
            });
    }, [id]);


    const formik = useFormik({

        initialValues: log,
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
            typeofchange: yup.string().trim().required('Type of Change is required').oneOf(['Create', 'Update', 'Delete'], "Type of Change must be one of: Create, Update, Delete"),
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
            data.docemail = data.docemail.trim();
            data.nurseemail = data.nurseemail.trim();
            data.typeofchange = data.typeofchange.trim();
            data.edittedBy = data.edittedBy.trim();
            http.put(`/log/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    alert("Log Updated Successfully");
                    navigate("/logs");
                })
                .catch((error) => {
                    console.error("Error updating log:", error);
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

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteLog = () => {
        http.delete(`/log/${id}`)
            .then((res) => {
                console.log(res.data);
                alert("Log Deleted Successfully");
                navigate("/logs");
            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                View Log Details
            </Typography>
            {
                !loading && (
                    <Box component="text" sx={{ maxWidth: '500px' }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Type of Change"
                            name="typeofchange"
                            value={formik.values.typeofchange}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.typeofchange && Boolean(formik.errors.typeofchange)}
                            helperText={formik.touched.typeofchange && formik.errors.typeofchange}
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Editted By"
                            name="edittedBy"
                            value={formik.values.edittedBy}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.edittedBy && Boolean(formik.errors.edittedBy)}
                            helperText={formik.touched.edittedBy && formik.errors.edittedBy}
                            InputProps={{ readOnly: true }}
                        />
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            fullWidth
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
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
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                )}
        </Box>
    );
}
export default ViewLog;