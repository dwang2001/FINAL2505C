import React, { useEffect, useState, useContext } from 'react';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button }
    from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';


function MySchedules() {
    const [scheduleList, setScheduleList] = useState([]);

    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getSchedules = () => {
        http.get(`/user/${currentID}`)
        .then((res) => {
            var currentusername = res.data.name.trim();
            console.log("Current User Name: ", currentusername);
            
            // Retrieve schedules for the current user
            http.get('/schedule/myschedule', {
                params: {
                    currentusername: currentusername
                }
            })
            .then((res) => {
                setScheduleList(res.data);
            })
            .catch((error) => {
                console.error('Error fetching schedules:', error);
                // Handle error here (e.g., show error message to the user)
            });
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            // Handle error here (e.g., show error message to the user)
        });
    };
    
    const searchSchedules = () => {
        http.get(`/schedule?search=${search}`).then((res) => {
            setScheduleList(res.data);
        });
    };

    const currentID = localStorage.getItem("id");
    const navigate = useNavigate();
    useEffect(() => {

        http.get(`/user/${currentID}`,).then((res) => {
                  getSchedules();
        });
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchSchedules();
        }
    };
    const onClickSearch = () => {
        searchSchedules();
    }
    const onClickClear = () => {
        setSearch('');
        getSchedules();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 3 }}>
                Manage Schedules
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 2 }} />
                {
                    user && (
                        <Link to="/addschedule" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add New Schedule
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    scheduleList.map((schedule, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={schedule.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                Schedule's Status: {schedule.status}
                                                <br />Service : {schedule.service}
                                            </Typography>
                                            <Link to={`/editschedule/${schedule.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px', color: 'grey' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(schedule.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Scheduled Time:  {dayjs(schedule.datetime).format(global.datetimeFormat)}
                                            <br />Patient's Name : {schedule.patientname}
                                            <br />Nurse's Name : {schedule.nursename}
                                            <br />Doctor's Name : {schedule.doctorname}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}
export default MySchedules;