import React, { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from '../contexts/AuthContext';
import ClientRegistrationForm from './forms/Client';
import   ClientsList from './lists/Clients';
 './lists/Clients';

const Clienti = () => {




  return(
    <>
    <ClientRegistrationForm />
    <ClientsList />
    </>
  )






  };




 

export default Clienti;
