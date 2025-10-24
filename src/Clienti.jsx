import React, { useState } from 'react';
import '../styles/Clienti.css';
import { useAuth } from '../contexts/AuthContext';
import ClientRegistrationForm from './forms/Client';
import ClientsList from './lists/Clients';


const Clienti = () => {
  const [activeTab, setActiveTab] = useState('registration'); // 'registration' or 'list'

  return (
    <div className="clienti-container">
      {/* Tab Navigation */}
      <div className="clienti-tabs">
        <button 
          className={`tab-button ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveTab('registration')}
        >
          <span className="tab-icon">📝</span>
          Înregistrare Client Nou
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">📋</span>
          Lista Clienți
        </button>
      </div>

      {/* Tab Content */}
      <div className="clienti-content">
        {activeTab === 'registration' && (
          <div className="tab-panel">
            <ClientRegistrationForm />
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="tab-panel">
            <ClientsList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Clienti;