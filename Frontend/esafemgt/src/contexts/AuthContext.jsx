// Authentication Context (simplified)
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // employee or admin

  useEffect(() => {
    const employeeToken = localStorage.getItem('employeeToken');
    const adminToken = localStorage.getItem('adminToken');

    if (employeeToken) {
      setIsAuthenticated(true);
      setUserType('employee');
    } else if (adminToken) {
      setIsAuthenticated(true);
      setUserType('admin');
    }
  }, []);

  const login = (token, userType) => {
    localStorage.setItem(userType + 'Token', token);
    setIsAuthenticated(true);
    setUserType(userType);
  };

  const logout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default AuthContext;
