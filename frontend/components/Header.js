import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.welcome}>Hello, {user?.username || 'Trader'}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <LogOut color="#F87171" size={20} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#000',
    },
    welcome: {
        color: '#666',
        fontSize: 14,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#111',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
    },
});

export default Header;
