import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  name: '',
  role: '',
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');
  const storedName = localStorage.getItem('name');
  const storedRole = localStorage.getItem('role');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    name: storedName,
    role: storedRole
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  let initialName;
  let initialRole;
  if (tokenData) {
    initialToken = tokenData.token;
    initialName = tokenData.name;
    initialRole = tokenData.role;
  }

  const [token, setToken] = useState(initialToken);
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setName(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('name');
    localStorage.removeItem('role');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    window.location.hash = '/';
  }, []);

  const loginHandler = (token, expirationTime, name, role) => {
    setName(name);
    setToken(token);
    setRole(role);
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    role: role,
    name: name,
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
