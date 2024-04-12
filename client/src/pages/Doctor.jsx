// Patient.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function Doctor() {
    const location = useLocation();
    const user = location.state.user;

    return (
        <div>
            <h1>Welcome {user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {/* Display other user details as needed */}
        </div>
    );
}

export default Doctor;