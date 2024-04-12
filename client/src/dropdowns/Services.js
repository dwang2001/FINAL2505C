import http from '../http';

import { useState, useEffect } from 'react';

export const useServices = () => {
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const response = await http.get('/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return services;
};