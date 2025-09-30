import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css'

const Login = () => {

    const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  });
    

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userInfo.email, userInfo.password);
  };



    return (
   <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={userInfo.email}
        onChange={handleChange}
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={userInfo.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;



