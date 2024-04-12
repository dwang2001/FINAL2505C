import React from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState, useEffect } from 'react';
import http from '../http';
import { useNavigate } from 'react-router-dom';


function AddSchedule() {
    const navigate = useNavigate();

    const [servicedatetime, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const [setServices] = useState([]);

    const services = ['Medication Counseling', 'Caregiver Training', 'Home Safety Assessments'];

    const fetchServices = async () => {
        try {
            const response = await http.get('/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    const currentID = localStorage.getItem("id");
    useEffect(() => {
        http.get(`/user/${currentID}`).then((res) => {
            if (res.data.role === 'Doctor' || res.data.role === 'Admin') {
                fetchServices();
            } else {
                navigate("/profilePage");
                alert("You are not authorized to view this page");
            }
        });
    }, []);


    const formik = useFormik({
        initialValues: {
            patientname: '',
            nursename: '',
            doctorname: '',
            datetime: dayjs().add(1, 'day').minute(0),
            service: '',
        },
        validationSchema: yup.object({
            patientname: yup.string().trim().max(100).required('Patient Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            nursename: yup.string().trim().max(100).required('Nurse Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            doctorname: yup.string().trim().max(100).required('Doctor Name is required').matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            datetime: yup.date().typeError('Invalid Date Time').required('Date Time is required'),
            service: yup.string().trim().required('Service is required').oneOf(['Medication Counseling', 'Caregiver Training', 'Home Safety Assessments'], "Role must be one of: Admin, Doctor, Nurse, Patient, Caregiver"),
        }),
        onSubmit: (data) => {
            var dataToSubmit = { ...data };
            if (data.nursename === 'Random Nurse') {

                http.get(`/user`,).then((res) => {
                    let nurseList = res.data.filter(user => user.role === 'Nurse');
                    let randomNurse = nurseList[Math.floor(Math.random() * nurseList.length)];
                    data.nursename = randomNurse.name.trim();
                    dataToSubmit.patientname = data.patientname.trim();
                    dataToSubmit.nursename = data.nursename.trim();
                    dataToSubmit.doctorname = data.doctorname.trim();
                    dataToSubmit.service = data.service.trim();
                    dataToSubmit.datetime = data.datetime.format('YYYY-MM-DD HH:mm:ss');
                    dataToSubmit.status = 'Allocated';
                    http.post('/schedule/allocate', dataToSubmit)
                        .then((res) => {
                            console.log(res.data);
                            alert('Service Allocated successfully');
                            navigate("/schedule");
                        })
                        .catch(function (err) {
                            toast.error(`${err.response.data.message}`);
                            console.log(err.response);
                        });
                }
                )
            } else {
                dataToSubmit.patientname = data.patientname.trim();
                dataToSubmit.nursename = data.nursename.trim();
                dataToSubmit.doctorname = data.doctorname.trim();
                dataToSubmit.service = data.service.trim();
                dataToSubmit.datetime = data.datetime.format('YYYY-MM-DD HH:mm:ss');
                dataToSubmit.status = 'Allocated';
                http.post('/schedule/allocate', dataToSubmit)
                    .then((res) => {
                        console.log(res.data);
                        alert('Service Allocated successfully');
                        navigate("/schedule");
                    })
                    .catch(function (err) {
                        toast.error(`${err.response.data.message}`);
                        console.log(err.response);
                    });

            }
        }
    });

    return (
        <Box sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1 className="welcome-message">Please fill up the relevant fields to Allocate a Service</h1>
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
                <TextField
                    fullWidth
                    select
                    margin="dense"
                    autoComplete="off"
                    multiline
                    minRows={2}
                    label="Service"
                    name="service"
                    value={formik.values.service}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.service && Boolean(formik.errors.service)}
                    helperText={formik.touched.service && formik.errors.service}
                >
                    {services.map(service => (
                        <MenuItem key={service} value={service}>{service}</MenuItem>
                    ))}
                </TextField>
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

                <Box sx={{ mt: 2 }}>
                    <Button fullWidth variant="contained" type="submit">
                        Allocate
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddSchedule;
