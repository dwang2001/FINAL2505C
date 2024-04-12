import React, { useEffect, useState } from 'react';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button }
  from '@mui/material';
import { AccessTime, Search, Clear, Edit, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Logs() {
  const [logList, setLogList] = useState([]);

  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getLogs = () => {
    http.get('/log').then((res) => {
      setLogList(res.data);
    });
  };

  const searchLogs = () => {
    http.get(`/log?search=${search}`).then((res) => {
      setLogList(res.data);
    });
  };
  
  const navigate = useNavigate();
  const currentID = localStorage.getItem("id");
  useEffect(() => {
      http.get(`/user/${currentID}`,).then((res) => {
          if (res.data.role === 'Admin') {
            getLogs();
          } else {
            navigate("/profilePage");
            alert("You are not authorized to view this page");   
          }

      });
  }, []);
 
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchLogs();
    }
  };
  const onClickSearch = () => {
    searchLogs();
  }
  const onClickClear = () => {
    setSearch('');
    getLogs();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 3}}>
        View User Logs
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
      </Box>

      <Grid container spacing={2}>
        {
          logList.map((log, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={log.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Type of Change: {log.typeofchange}
                        <br />Edited By: User {log.edittedBy}
                      </Typography>
                      <Link to={`/viewlog/${log.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' , color: 'grey'}}>
                          <Visibility />
                        </IconButton>
                      </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(log.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      User Edited: {log.name}
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
export default Logs;