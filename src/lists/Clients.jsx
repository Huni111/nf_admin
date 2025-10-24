import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase_config';
import '../../styles/ClientsList.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch clients from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Query only company users (not admins)
        const q = query(
          collection(db, 'users'), 
          where('userType', '==', 'company')
        );
        
        const querySnapshot = await getDocs(q);
        const clientsData = [];
        
        querySnapshot.forEach((doc) => {
          clientsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setClients(clientsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Eroare la încărcarea listei de clienți.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cui?.includes(searchTerm)
  );

  // Open modal with client details
  const handleClientClick = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ro-RO');
  };

  // Prevent row click when clicking on buttons/links
  const handleRowClick = (client, e) => {
    // Don't open modal if user clicked on a button or link
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    handleClientClick(client);
  };

  if (loading) {
    return (
      <div className="clients-container">
        <div className="loading">Se încarcă lista de clienți...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1>Lista Clienți</h1>
        <div className="clients-stats">
          <span className="total-clients">Total clienți: {clients.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Caută după nume companie, contact, email sau CUI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <span className="search-results">
            {filteredClients.length} rezultate
          </span>
        )}
      </div>

      {/* Clients Table */}
      <div className="clients-table-container">
        {filteredClients.length === 0 ? (
          <div className="no-clients">
            {searchTerm ? 'Nu s-au găsit clienți care să corespundă căutării.' : 'Nu există clienți înregistrați.'}
          </div>
        ) : (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Companie</th>
                <th>Persoană de Contact</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>CUI</th>
                <th>Tip Colaborare</th>
                <th>Data Înregistrării</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className="client-row"
                  onClick={(e) => handleRowClick(client, e)}
                >
                  <td>
                    <div className="company-info">
                      <strong>{client.companyName || 'N/A'}</strong>
                      {client.vatPayer && <span className="vat-badge">TVA</span>}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="contact-name">{client.contactName}</div>
                      {client.contactPosition && (
                        <div className="contact-position">{client.contactPosition}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${client.email}`} className="email-link" onClick={(e) => e.stopPropagation()}>
                      {client.email}
                    </a>
                  </td>
                  <td>
                    <a href={`tel:${client.phoneNumber}`} className="phone-link" onClick={(e) => e.stopPropagation()}>
                      {client.phoneNumber}
                    </a>
                  </td>
                  <td>
                    <code className="cui-code">{client.cui || 'N/A'}</code>
                  </td>
                  <td>
                    <span className={`collaboration-badge ${client.collaborationType}`}>
                      {client.collaborationType === 'reseller' && 'Revânzător'}
                      {client.collaborationType === 'online' && 'Online'}
                      {client.collaborationType === 'distributor' && 'Distribuitor'}
                      {client.collaborationType === 'customization' && 'Personalizare'}
                      {client.collaborationType === 'other' && 'Alt tip'}
                      {!client.collaborationType && 'N/A'}
                    </span>
                  </td>
                  <td>{formatDate(client.createdAt)}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClientClick(client);
                      }}
                      className="details-button"
                    >
                      Detalii
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Client Details Modal */}
      {isModalOpen && selectedClient && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalii Client - {selectedClient.companyName || selectedClient.contactName}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {/* Company Information */}
              <section className="details-section">
                <h3>Informații Companie</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Denumire Companie:</label>
                    <span>{selectedClient.companyName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>CUI:</label>
                    <span>{selectedClient.cui || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nr. Înregistrare:</label>
                    <span>{selectedClient.registrationNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Adresă Sediu Social:</label>
                    <span>{selectedClient.socialAddress || 'N/A'}</span>
                  </div>
                  {selectedClient.deliveryAddress && (
                    <div className="detail-item full-width">
                      <label>Adresă Livrare:</label>
                      <span>{selectedClient.deliveryAddress}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Plătitor TVA:</label>
                    <span className={selectedClient.vatPayer ? 'status-active' : 'status-inactive'}>
                      {selectedClient.vatPayer ? 'Da' : 'Nu'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="details-section">
                <h3>Informații Contact</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Nume Contact:</label>
                    <span>{selectedClient.contactName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Funcție:</label>
                    <span>{selectedClient.contactPosition || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Telefon:</label>
                    <a href={`tel:${selectedClient.phoneNumber}`} className="phone-link">
                      {selectedClient.phoneNumber}
                    </a>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <a href={`mailto:${selectedClient.email}`} className="email-link">
                      {selectedClient.email}
                    </a>
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              {(selectedClient.iban || selectedClient.bank) && (
                <section className="details-section">
                  <h3>Informații Facturare</h3>
                  <div className="details-grid">
                    {selectedClient.iban && (
                      <div className="detail-item">
                        <label>IBAN:</label>
                        <span className="iban">{selectedClient.iban}</span>
                      </div>
                    )}
                    {selectedClient.bank && (
                      <div className="detail-item">
                        <label>Bancă:</label>
                        <span>{selectedClient.bank}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Collaboration Details */}
              <section className="details-section">
                <h3>Detalii Colaborare</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Tip Colaborare:</label>
                    <span className={`collaboration-badge ${selectedClient.collaborationType}`}>
                      {selectedClient.collaborationType === 'reseller' && 'Revânzător / Magazin fizic'}
                      {selectedClient.collaborationType === 'online' && 'Comerț online'}
                      {selectedClient.collaborationType === 'distributor' && 'Distribuitor'}
                      {selectedClient.collaborationType === 'customization' && 'Personalizare / comenzi speciale'}
                      {selectedClient.collaborationType === 'other' && 'Alt tip de colaborare'}
                      {!selectedClient.collaborationType && 'N/A'}
                    </span>
                  </div>
                  {selectedClient.otherCollaborationDetails && (
                    <div className="detail-item full-width">
                      <label>Detalii Colaborare:</label>
                      <span>{selectedClient.otherCollaborationDetails}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Communication Preferences */}
              <section className="details-section">
                <h3>Preferințe Comunicare</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Canal Preferat:</label>
                    <span>
                      {selectedClient.preferredChannel === 'email' && 'Email'}
                      {selectedClient.preferredChannel === 'phone' && 'Telefon'}
                      {selectedClient.preferredChannel === 'whatsapp' && 'WhatsApp'}
                      {!selectedClient.preferredChannel && 'Email (implicit)'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Limbă Preferată:</label>
                    <span>{selectedClient.preferredLanguage || 'Română'}</span>
                  </div>
                </div>
              </section>

              {/* System Information */}
              <section className="details-section">
                <h3>Informații Sistem</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>ID Utilizator:</label>
                    <code className="user-id">{selectedClient.id}</code>
                  </div>
                  <div className="detail-item">
                    <label>Data Înregistrării:</label>
                    <span>{formatDate(selectedClient.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tip Utilizator:</label>
                    <span className="user-type-badge">{selectedClient.userType}</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="modal-footer">
              <button onClick={handleCloseModal} className="close-modal-button">
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;