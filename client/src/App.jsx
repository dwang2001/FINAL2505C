
import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Login from './pages/Login';
import Register from './pages/Register';
import Schedule from './pages/Schedules';
import Reset from './pages/Reset';
import http from './http';
import UserContext from './contexts/UserContext';
import ChangePassword from './pages/ChangePassword';
import Users from './pages/Users';
import EditUser from './pages/EditUser';
import AddSchedule from './pages/AddSchedule';
import EditSchedule from './pages/EditSchedule';
import Logs from './pages/Logs';
import ViewLog from './pages/ViewLog';
import Admin from './pages/Admin';
import Caregiver from './pages/Caregiver';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient';
import Upload from './pages/Upload';
import SafetyChecklist from './pages/SafetyChecklist';
import MedicalRecords from './pages/MedicalRecords';
import Nurse from './pages/Nurse';
import MySchedule from './pages/MySchedule';
import ProfilePage from './pages/ProfilePage';


function App() {
  let logoutTimer;

  const logoutUser = () => {
    localStorage.clear();
    window.location = "/";
    console.log("User logged out due to inactivity");
  };

  const startLogoutTimer = () => {
    logoutTimer = setTimeout(logoutUser, 300000);
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    startLogoutTimer();
  };

  // Event listeners for user activity
  document.addEventListener("mousemove", resetLogoutTimer);
  document.addEventListener("keypress", resetLogoutTimer);
  // Start the logout timer when the page loads
  startLogoutTimer();


  const [user, setUser] = useState(null);
  const [details, setDetails] = useState(null);




  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth')
        .then((res) => {
          setUser(res.data.user);
          console.log("User: ", res.data.user);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      http.get(`/role?search=${user.email}`)
        .then((res) => {
          setDetails(res.data[0]);
          console.log("details: ", res.data[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, details, setDetails }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <div className="toolbar">
                  <img src="logo.jpg" alt="Logo" className="logo" />
                  <span className="text">SavingLives Hospital</span>
                </div>

                <Box sx={{ flexGrow: 1 }}></Box>

                {user && details && (
                  <>

                    {details && details.role === 'Admin' && (
                      <>
                        <Link to="/profilepage"><Typography>Profile Page</Typography></Link>
                        <Link to="/users"><Typography>Users</Typography></Link>
                        <Link to="/logs"><Typography>Logs</Typography></Link>
                        <Link to="/schedule"><Typography>Schedule</Typography></Link>
                        <Link to="/records" ><Typography>Medical Records</Typography></Link>
                      </>
                    )}
                    {details && details.role === 'Nurse' && (
                      <>
                        <Link to="/profilepage"><Typography>Profile Page</Typography></Link>
                        <Link to="/safetychecklist" ><Typography>Safety Checklist</Typography></Link>
                        <Link to="/records" ><Typography>Medical Records</Typography></Link>
                        <Link to="/schedule"><Typography>Schedule</Typography></Link>
                        <Link to="/myschedule" ><Typography>My Schedule</Typography></Link>

                      </>
                    )}
                    {details && details.role === 'Doctor' && (
                      <>
                        <Link to="/profilepage"><Typography>Profile Page</Typography></Link>
                        <Link to="/safetychecklist" ><Typography>Safety Checklist</Typography></Link>
                        <Link to="/records" ><Typography>Medical Records</Typography></Link>
                        <Link to="/schedule"><Typography>Schedule</Typography></Link>
                        <Link to="/myschedule" ><Typography>My Schedule</Typography></Link>
                      </>
                    )}
                    {details && details.role === 'Patient' && (
                      <>
                        <Link to="/profilepage"><Typography>Profile Page</Typography></Link>
                        <Link to="/upload" ><Typography>Home Environment Records</Typography></Link>
                        <Link to="/safetychecklist" ><Typography>Safety Checklist</Typography></Link>
                        <Link to="/records" ><Typography>Medical Records</Typography></Link>
                        <Link to="/myschedule" ><Typography>My Schedule</Typography></Link>
                      </>
                    )}
                  </>
                )}

                {user && (
                  <>
                    <Link to="/changepassword"><Typography>Change Password</Typography></Link>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}

                {!user && (
                  <>
                    <Link to="/login"><Typography>Login</Typography></Link>
                    <Link to="/reset"><Typography>Reset Password</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Login />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/schedule"} element={<Schedule />} />
              <Route path={"/reset"} element={<Reset />} />
              <Route path={"/changepassword"} element={<ChangePassword />} />
              <Route path={"/users"} element={<Users />} />
              <Route path={"/edituser/:id"} element={<EditUser />} />
              <Route path={"/addschedule"} element={<AddSchedule />} />
              <Route path={"/editschedule/:id"} element={<EditSchedule />} />
              <Route path={"/myschedule"} element={<MySchedule />} />              
              <Route path={"/logs"} element={<Logs />} />
              <Route path={"/viewlog/:id"} element={<ViewLog />} />
              <Route path={"/admin"} element={<Admin />} />
              <Route path={"/caregiver"} element={<Caregiver />} />
              <Route path={"/doctor"} element={<Doctor />} />
              <Route path={"/nurse"} element={<Nurse />} />
              <Route path={"/patient"} element={<Patient />} />
              <Route path={"/upload"} element={<Upload />} />
              <Route path={"/safetychecklist"} element={<SafetyChecklist />} />
              <Route path={"/records"} element={<MedicalRecords />} />
              <Route path={"/profilepage"} element={<ProfilePage />} />


            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
