import React, { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from '../contexts/AuthContext';

const Clienti = ({ onLogin }) => {


   const { signup, login, logout, currentUser, error, loading } = useAuth();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  });

  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (setter) => (e, type) => {
    const { id, value } = e.target;
    setter(prev => ({
      ...prev,
      [id]: value
    }));

    
  };

   const handleLoginSubmit = async (e) => {
  e.preventDefault();
  
  // Basic validation
  if (!userInfo.email || !userInfo.password) {
    alert('Please enter both email and password');
    return;
  }

  try {
  
    await login(userInfo.email, userInfo.password);
 
    
    setUserInfo({ email: '', password: '' });
    
    console.log('Login successful!');
  } catch (error) {
  
    if (error.code === 'auth/invalid-email') {
      alert('Invalid email address');
    } else if (error.code === 'auth/user-not-found') {
      alert('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password');
    } else if (error.code === 'auth/too-many-requests') {
      alert('Too many failed attempts. Please try again later.');
    } else {
      alert(`Login failed: ${error.message}`);
    }
    
    console.error('Login error:', error);
  }
};

  const handleLogoutSubmit = async (e) => {
  e.preventDefault();
  
  try {
    await logout();
    
    console.log('Logout successful!');
  
  } catch (error) {

    alert(`Logout failed: ${error.message}`);
    console.error('Logout error:', error);
  }
};

  const handleRegisterSubmit = async(e) => { // Separate handler for register
    e.preventDefault();

    try{
      signup( registerInfo.email, registerInfo.password, registerInfo.name, );
      setRegisterInfo({
        name: "",
        email: "",
        password: ""
      })
    }catch(error){
      console.log(error.message)
      throw error;
    }
    
  };

  return (
    <>
    <div className="login-root">
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <h2>Bejelentkezes</h2>
        <label htmlFor="email" className="login-label">Email:</label>
        <input
          type="email"
          id="email"
          className="login-input"
          value={userInfo.email}
          onChange={handleChange(setUserInfo)}
          required
        />
        <label htmlFor="password" className="login-label">Password:</label>
        <input
          type="password"
          id="password"
          className="login-input"
          value={userInfo.password}
          onChange={handleChange(setUserInfo)}
          required
        />
        <button type="submit" className="login-button">Log In</button>
      </form>

      

      
    </div>
            <button type="submit" className="login-button" onClick={handleLogoutSubmit}>Log Out</button>


    <div className="login-root">
      <form className="login-form" onSubmit={handleRegisterSubmit}>
        <h2>Regisztralj</h2>
        <label htmlFor="email" className="login-label">Nev:</label>
        <input
          type="text"
          id="name"
          className="login-input"
          value={registerInfo.name}
          onChange={handleChange(setRegisterInfo)}
          required
        />
        <label htmlFor="email" className="login-label">Email:</label>
        <input
          type="email"
          id="email"
          className="login-input"
          value={registerInfo.email}
          onChange={handleChange(setRegisterInfo)}
          required
        />
        <label htmlFor="password" className="login-label">Password:</label>
        <input
          type="password"
          id="password"
          className="login-input"
          value={registerInfo.password}
          onChange={handleChange(setRegisterInfo)}
          required
        />
        <button type="submit" className="login-button">Log In</button>
      </form>

      
    </div>
    
    </>
  );
};

export default Clienti;
