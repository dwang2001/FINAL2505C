import React, { useEffect, useState } from 'react';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button }
  from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';


function Services() {
  const [serviceList, setServiceList] = useState([]);

  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getServices = () => {
    http.get('/service').then((res) => {
      setServiceList(res.data);
    });
  };

  const searchServices = () => {
    http.get(`/service?search=${search}`).then((res) => {
      setServiceList(res.data);
    });
  };
  
  useEffect(() => {
    getServices();
  }, []);
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchServices();
    }
  };
  const onClickSearch = () => {
    searchServices();
  }
  const onClickClear = () => {
    setSearch('');
    getServices();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 3}}>
        Manage Services
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
        <Link to="/addServices" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add New Service
          </Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
        {
          serviceList.map((service, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={service.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Service's ID: {service.id}
                      </Typography>
                      <Link to={`/editservice/${service.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' , color: 'grey'}}>
                          <Edit />
                        </IconButton>
                      </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(service.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      Service's Name : {service.name}
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
export default Services;