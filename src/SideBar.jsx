import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'

const SideBar = () => {
    



    return (
   <>
    <nav className='navbar'>
        <Link className='item' to="/">Bejelenkezes</Link> {" "}
        <Link className='item' to="/products">Termekek</Link> {" "}
        <Link className='item' to="/orders">Rendelesek</Link>
      </nav>
   
   </>
  );
};

export default SideBar;



