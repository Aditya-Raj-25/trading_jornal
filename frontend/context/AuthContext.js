import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const storedUser = await storage.getItem('user');
            const token = await storage.getItem('token');
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load user state', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData, token) => {
        setUser(userData);
        await storage.setItem('user', JSON.stringify(userData));
        await storage.setItem('token', token);
    };

    const logout = async () => {
        setUser(null);
        await storage.deleteItem('user');
        await storage.deleteItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
