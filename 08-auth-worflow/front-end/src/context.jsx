import axios from 'axios';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import url from './utils/url.js';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const saveUser = (user) => {
    setUser(user);
  };

  const removeUser = () => {
    setUser(null);
  };

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/api/v1/users/showMe`, {
        withCredentials: true
      });
      saveUser(data.user);
    } catch (error) {
      removeUser();
    }

    setIsLoading(false);
  }, []);

  const logoutUser = async () => {
    try {
      await axios.delete(`${url}/api/v1/auth/logout`, {
        withCredentials: true
      });
      removeUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AppContext.Provider value={{ isLoading, saveUser, user, logoutUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);

export default AppProvider;
