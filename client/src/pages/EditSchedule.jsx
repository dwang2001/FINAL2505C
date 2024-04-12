import React, { useState, useEffect } from 'react';
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
import { useServices } from '../dropdowns/Services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControl } from '@mui/material';
import dayjs from 'dayjs';
import global from '../global';
import { MenuItem, Select, FormHelperText, InputLabel, Grid } from '@mui/material';


function EditSchedule() {

    const { id } = useParams();
    const [servicedatetime, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState({
        patientname: '',
        nursename: '',
        doctorname: '',
        datetime: '',
        service: '',
        status: '',
    });

    const [loading, setLoading] = useState(true);

    const currentID = localStorage.getItem("id");
    useEffect(() => {
        http.get(`/user/${currentID}`).then((res) => {
            if (res.data.role === 'Doctor' || res.data.role === 'Admin'|| res.data.role === 'Nurse') {
                http.get(`/schedule/${id}`).then((res) => {
                    console.log(res.data);
                    var currentDataDate = res.data.datetime;
                    console.log(currentDataDate);
                    // Parse datetime string using Day.js
                    var dayjsObject = dayjs(currentDataDate, 'YYYY-MM-DD HH:mm:ss').add(8, 'hour');
                    console.log(dayjsObject); // Log the parsed Day.js object
                    res.data.datetime = dayjsObject; // Assign the parsed Day.js object to the datetime property
                    setSchedule(res.data);
                    setLoading(false);
                });
            } else {
                navigate("/profilePage");
                alert("You are not authorized to view this page");
            }

        });
    }, []);

    const formik = useFormik({

        initialValues: schedule,
        enableReinitialize: true,
        validationSchema: yup.object({
            patientname: yup.string().trim().max(100).required('Patient Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            nursename: yup.string().trim().max(100).required('Nurse Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            doctorname: yup.string().trim().max(100).required('Doctor Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            datetime: yup.date().required('Date is required'),
            service: yup.string().trim().required('Service is required').oneOf(['Medication Counseling', 'Caregiver Training', 'Home Safety Assessments'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
            status: yup.string().trim().required('Status is required').oneOf(['Allocated', 'Completed', 'Cancelled'], "Status must be one of: Allocated, Completed, Cancelled"),
        }),
        onSubmit: (data) => {
            data.patientname = data.patientname.trim();
            data.nursename = data.nursename.trim();
            data.doctorname = data.doctorname.trim();
            data.datetime = data.datetime.format('YYYY-MM-DD HH:mm:ss');
            data.service = data.service.trim();
            data.status = data.status.trim();
            http.put(`/schedule/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    alert("Schedule Updated Successfully");
                    navigate("/schedule");
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

    const deleteSchedule = () => {
        http.delete(`/schedule/${id}`)
            .then((res) => {
                console.log(res.data);
                alert("Schedule Deleted Successfully");
                navigate("/schedule");
            });
    }

    return (
        <Box sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
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
                            label="Patient Name"
                            name="patientname"
                            value={formik.values.patientname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.patientname && Boolean(formik.errors.patientname)}
                            helperText={formik.touched.patientname && formik.errors.patientname}

                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Nurse Name"
                            name="nursename"
                            value={formik.values.nursename}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nursename && Boolean(formik.errors.nursename)}
                            helperText={formik.touched.nursename && formik.errors.nursename}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Doctor Name"
                            name="doctorname"
                            value={formik.values.doctorname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.doctorname && Boolean(formik.errors.doctorname)}
                            helperText={formik.touched.doctorname && formik.errors.doctorname}
                        />
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker format="DD/MM/YYYY hh:mm A"
                                        label="Select Date Time"
                                        name="datetime"
                                        value={formik.values.datetime}
                                        onChange={(datetime) => formik.setFieldValue('datetime', datetime)}
                                        onBlur={() => formik.setFieldTouched('datetime', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.datetime && Boolean(formik.errors.datetime),
                                                helperText: formik.touched.datetime && formik.errors.datetime
                                            }
                                        }} />
                                </LocalizationProvider>
                            </FormControl>
                        </Box>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense"
                                error={formik.touched.service && Boolean(formik.errors.service)}>
                                <InputLabel>Service</InputLabel>
                                <Select label="Service"
                                    name="service"
                                    value={formik.values.service}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value={'Medication Counseling'}>Medication Counseling</MenuItem>
                                    <MenuItem value={'Caregiver Training'}>Caregiver Training</MenuItem>
                                    <MenuItem value={'Home Safety Assessments'}>Home Safety Assessments</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.service && formik.errors.service}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense"
                                error={formik.touched.service && Boolean(formik.errors.status)}>
                                <InputLabel>Status</InputLabel>
                                <Select label="Status"
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value={'Allocated'}>Allocated</MenuItem>
                                    <MenuItem value={'Completed'}>Completed</MenuItem>
                                    <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>


                )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Schedule
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this schedule?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteSchedule}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default EditSchedule;