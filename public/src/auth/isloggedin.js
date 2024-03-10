import React from 'react'

export const isLoggedIn = () => {
    // Check if the token exists in local storage
    const token = localStorage.getItem('_token');
    
    // Return true if token exists and is not expired
    return token !== null;
};