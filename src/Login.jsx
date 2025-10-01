import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  });

  const [registerInfo, setRegisterInfo] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userInfo.email, userInfo.password);
  };

  return (
    <>
    <div className="login-root">
      <form className="login-form" onSubmit={handleSubmit}>
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

    <div className="login-root">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Regisztralj</h2>
        <label htmlFor="email" className="login-label">Nev:</label>
        <input
          type="name"
          id="name"
          className="login-input"
          value={registerInfo.email}
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

export default Login;
