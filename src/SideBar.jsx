import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'

const SideBar = () => {
    



    return (
   <>
    <nav className='navbar'>
        <Link className='item' to="/">Clienți</Link> {" "}
        <Link className='item' to="/products">Comenzi</Link> {" "}
        <Link className='item' to="/orders">Produse</Link>
        <Link className='item' to="/cart">Galerie</Link>
      </nav>
   
   </>
  );
};

export default SideBar;



