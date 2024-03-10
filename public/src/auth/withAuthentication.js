import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function withAuthentication(WrappedComponent) {
  return function WithAuthentication(props) {
    const navigate = useNavigate();

    useEffect(() => {
      const verifyUser = async () => {
        const cookie = localStorage.getItem('_token');

        if (!cookie) {
          navigate('/login');
        } else {
          try {
            const response = await axios.post(
              `https://recipe-management-4886.onrender.com`,
              { token: cookie },
              { withCredentials: true }
            );

            const { data } = response;

            if (!data.status) {
              localStorage.removeItem('_token');
              navigate('/login');
            }
          } catch (error) {
            console.error("Error verifying user:", error);
          }
        }
      };

      verifyUser();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
}

export default withAuthentication;
