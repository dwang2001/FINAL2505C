import http from '../http';

import { useState, useEffect } from 'react';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);

    const fetchRoles = async () => {
        try {
            const response = await http.get('/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return roles;
};