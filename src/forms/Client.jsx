import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/CompanyRegistrationForm.css";

const ClientRegistrationForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Add success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // User type
    isAdmin: false,
    
    // Company information
    companyName: "",
    cui: "",
    registrationNumber: "",
    socialAddress: "",
    deliveryAddress: "",
    
    // Contact information
    contactName: "",
    contactPosition: "",
    phoneNumber: "",
    email: "",
    
    // Account credentials
    password: "",
    confirmPassword: "",
    
    // Billing information
    iban: "",
    bank: "",
    vatPayer: false,
    
    // Collaboration type
    collaborationType: "",
    otherCollaborationDetails: "",
    
    // Communication preferences
    preferredChannel: "email",
    preferredLanguage: "română",
    
    // Terms and agreements
    termsAccepted: false,
    gdprAccepted: false,

    // Additional fields for admin users
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      canManageUsers: false
    }
  });
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("permissions.")) {
      const permissionField = name.split(".")[1];
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [permissionField]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields - DIFFERENT VALIDATION FOR ADMIN VS CLIENT
    if (!formData.isAdmin) {
      // Company validation only for non-admin users
      if (!formData.companyName) newErrors.companyName = "Denumirea companiei este obligatorie";
      if (!formData.cui) newErrors.cui = "CUI-ul este obligatoriu";
      if (!formData.socialAddress) newErrors.socialAddress = "Adresa sediului social este obligatorie";
      if (!formData.collaborationType) newErrors.collaborationType = "Selectați tipul de colaborare";
    }
    
    // Common validation for both admin and client
    if (!formData.contactName) newErrors.contactName = "Numele persoanei de contact este obligatoriu";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Numărul de telefon este obligatoriu";
    if (!formData.email) newErrors.email = "Email-ul este obligatoriu";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Adresa de email este invalidă";
    
    // Validate password fields
    if (!formData.password) newErrors.password = "Parola este obligatorie";
    else if (formData.password.length < 8) newErrors.password = "Parola trebuie să conțină cel puțin 8 caractere";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmarea parolei este obligatorie";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Parolele nu coincid";
    
    if (formData.collaborationType === "other" && !formData.otherCollaborationDetails) {
      newErrors.otherCollaborationDetails = "Detaliați tipul de colaborare dorit";
    }
    
    if (!formData.termsAccepted) newErrors.termsAccepted = "Trebuie să acceptați termenii și condițiile";
    if (!formData.gdprAccepted) newErrors.gdprAccepted = "Trebuie să acceptați prelucrarea datelor personale";
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup(formData);
      
      // Set success state
      setIsSuccess(true);
      
      // Clear the form
      setFormData({
        isAdmin: false,
        companyName: "",
        cui: "",
        registrationNumber: "",
        socialAddress: "",
        deliveryAddress: "",
        contactName: "",
        contactPosition: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        iban: "",
        bank: "",
        vatPayer: false,
        collaborationType: "",
        otherCollaborationDetails: "",
        preferredChannel: "email",
        preferredLanguage: "română",
        termsAccepted: false,
        gdprAccepted: false,
        permissions: {
          canView: true,
          canEdit: false,
          canDelete: false,
          canManageUsers: false
        }
      });
      
      setErrors({});
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Acest email este deja înregistrat.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Parola este prea slabă. Vă rugăm să alegeți o parolă mai puternică.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Adresa de email este invalidă.";
      }
      
      setErrors({
        form: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="company-registration-container">
      <h1>Înregistrare {formData.isAdmin ? "Utilizator Administrator" : "Companie"}</h1>
      
      {/* Success Message */}
      {isSuccess && (
        <div className="success-message">
          <h3>✅ Înregistrare reușită!</h3>
          <p>
            {formData.isAdmin 
              ? "Utilizatorul administrator a fost înregistrat cu succes în sistem." 
              : "Compania a fost înregistrată cu succes! Veți fi contactat în curând de echipa noastră."}
          </p>
        </div>
      )}
      
      <p className="registration-intro">
        {formData.isAdmin 
          ? "Completează formularul pentru a înregistra un nou utilizator administrator în sistem."
          : "Completați formularul de mai jos pentru a crea un cont business și pentru a beneficia de ofertele noastre dedicate companiilor."}
      </p>
      
      {errors.form && <div className="error-message form-error">{errors.form}</div>}
      
      <form onSubmit={handleSubmit} className="company-registration-form">
        {/* User Type Toggle */}
        <section className="form-section">
          <h2>Tip Înregistrare</h2>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <label htmlFor="isAdmin">Înregistrare ca Utilizator Administrator</label>
            <small>
              {formData.isAdmin 
                ? "Acest utilizator va avea drepturi complete în sistem și nu va fi asociat unei companii." 
                : "Înregistrare standard pentru companii (clienți business)."}
            </small>
          </div>
        </section>

        {/* Company Information Section - HIDDEN WHEN ADMIN */}
        {!formData.isAdmin && (
          <section className="form-section">
            <h2>Informații despre firmă</h2>
            
            <div className="form-group">
              <label htmlFor="companyName">Denumirea companiei *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? "error" : ""}
              />
              {errors.companyName && <div className="error-message">{errors.companyName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cui">Codul unic de înregistrare (CUI) *</label>
              <input
                type="text"
                id="cui"
                name="cui"
                value={formData.cui}
                onChange={handleChange}
                className={errors.cui ? "error" : ""}
              />
              {errors.cui && <div className="error-message">{errors.cui}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="registrationNumber">Nr. de înregistrare la Registrul Comerțului</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
              <small>Opțional, dar util</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="socialAddress">Adresa sediului social *</label>
              <textarea
                id="socialAddress"
                name="socialAddress"
                value={formData.socialAddress}
                onChange={handleChange}
                className={errors.socialAddress ? "error" : ""}
              />
              {errors.socialAddress && <div className="error-message">{errors.socialAddress}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="deliveryAddress">Adresa punctului de livrare</label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
              />
              <small>Completați doar dacă diferă de adresa sediului social</small>
            </div>
          </section>
        )}
        
        {/* Contact Information Section - ALWAYS VISIBLE */}
        <section className="form-section">
          <h2>Informații de contact</h2>
          
          <div className="form-group">
            <label htmlFor="contactName">
              {formData.isAdmin ? "Nume complet *" : "Nume persoană de contact *"}
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className={errors.contactName ? "error" : ""}
            />
            {errors.contactName && <div className="error-message">{errors.contactName}</div>}
          </div>
          
          {!formData.isAdmin && (
            <div className="form-group">
              <label htmlFor="contactPosition">Funcția în companie</label>
              <input
                type="text"
                id="contactPosition"
                name="contactPosition"
                value={formData.contactPosition}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Număr de telefon *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? "error" : ""}
            />
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Adresă de e-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
        </section>
        
        {/* Account Credentials Section - ALWAYS VISIBLE */}
        <section className="form-section">
          <h2>Date autentificare cont</h2>
          
          <div className="form-group">
            <label htmlFor="password">Parolă *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              <button 
                type="button" 
                className="toggle-password-button" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ascunde parola" : "Afișează parola"}
              >
                {showPassword ? "Ascunde" : "Afișează"}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
            <small>Parola trebuie să conțină minim 8 caractere</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmare parolă *</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
              />
              <button 
                type="button" 
                className="toggle-password-button" 
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Ascunde parola" : "Afișează parola"}
              >
                {showConfirmPassword ? "Ascunde" : "Afișează"}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
        </section>
        
        {/* Billing Information Section - HIDDEN WHEN ADMIN */}
        {!formData.isAdmin && (
          <section className="form-section">
            <h2>Date pentru facturare</h2>
            
            <div className="form-group">
              <label htmlFor="iban">Cont bancar (IBAN)</label>
              <input
                type="text"
                id="iban"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bank">Banca</label>
              <input
                type="text"
                id="bank"
                name="bank"
                value={formData.bank}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="vatPayer"
                name="vatPayer"
                checked={formData.vatPayer}
                onChange={handleChange}
              />
              <label htmlFor="vatPayer">Firma este plătitoare de TVA</label>
            </div>
          </section>
        )}
        
        {/* Collaboration Type Section - HIDDEN WHEN ADMIN */}
        {!formData.isAdmin && (
          <section className="form-section">
            <h2>Tipul colaborării dorite *</h2>
            
            <div className="collaboration-options">
              <div className="radio-group">
                <input
                  type="radio"
                  id="collaborationTypeReseller"
                  name="collaborationType"
                  value="reseller"
                  checked={formData.collaborationType === "reseller"}
                  onChange={handleChange}
                />
                <label htmlFor="collaborationTypeReseller">Revânzător / Magazin fizic</label>
              </div>
              
              <div className="radio-group">
                <input
                  type="radio"
                  id="collaborationTypeOnline"
                  name="collaborationType"
                  value="online"
                  checked={formData.collaborationType === "online"}
                  onChange={handleChange}
                />
                <label htmlFor="collaborationTypeOnline">Comerț online</label>
              </div>
              
              <div className="radio-group">
                <input
                  type="radio"
                  id="collaborationTypeDistributor"
                  name="collaborationType"
                  value="distributor"
                  checked={formData.collaborationType === "distributor"}
                  onChange={handleChange}
                />
                <label htmlFor="collaborationTypeDistributor">Distribuitor</label>
              </div>
              
              <div className="radio-group">
                <input
                  type="radio"
                  id="collaborationTypeCustomization"
                  name="collaborationType"
                  value="customization"
                  checked={formData.collaborationType === "customization"}
                  onChange={handleChange}
                />
                <label htmlFor="collaborationTypeCustomization">Personalizare / comenzi speciale</label>
              </div>
              
              <div className="radio-group">
                <input
                  type="radio"
                  id="collaborationTypeOther"
                  name="collaborationType"
                  value="other"
                  checked={formData.collaborationType === "other"}
                  onChange={handleChange}
                />
                <label htmlFor="collaborationTypeOther">Alt tip de colaborare</label>
              </div>
              
              {formData.collaborationType === "other" && (
                <div className="form-group">
                  <label htmlFor="otherCollaborationDetails">Specificați tipul de colaborare *</label>
                  <textarea
                    id="otherCollaborationDetails"
                    name="otherCollaborationDetails"
                    value={formData.otherCollaborationDetails}
                    onChange={handleChange}
                    className={errors.otherCollaborationDetails ? "error" : ""}
                  />
                  {errors.otherCollaborationDetails && (
                    <div className="error-message">{errors.otherCollaborationDetails}</div>
                  )}
                </div>
              )}
              
              {errors.collaborationType && <div className="error-message">{errors.collaborationType}</div>}
            </div>
          </section>
        )}
        
        {/* Communication Preferences Section - HIDDEN WHEN ADMIN */}
        {!formData.isAdmin && (
          <section className="form-section">
            <h2>Preferințe de comunicare</h2>
            
            <div className="form-group">
              <label htmlFor="preferredChannel">Canal preferat</label>
              <select
                id="preferredChannel"
                name="preferredChannel"
                value={formData.preferredChannel}
                onChange={handleChange}
              >
                <option value="email">Email</option>
                <option value="phone">Telefon</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="preferredLanguage">Limba preferată</label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="română">Română</option>
                <option value="engleză">Engleză</option>
                <option value="maghiară">Maghiară</option>
              </select>
            </div>
          </section>
        )}

        {/* Permissions Section - VISIBLE ONLY WHEN ADMIN */}
        {formData.isAdmin && (
          <section className="form-section">
            <h2>Permisiuni Administrator</h2>
            
            <div className="permissions-grid">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="canView"
                  name="permissions.canView"
                  checked={formData.permissions.canView}
                  onChange={handleChange}
                />
                <label htmlFor="canView">Vizualizare date</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="canEdit"
                  name="permissions.canEdit"
                  checked={formData.permissions.canEdit}
                  onChange={handleChange}
                />
                <label htmlFor="canEdit">Editare date</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="canDelete"
                  name="permissions.canDelete"
                  checked={formData.permissions.canDelete}
                  onChange={handleChange}
                />
                <label htmlFor="canDelete">Ștergere date</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="canManageUsers"
                  name="permissions.canManageUsers"
                  checked={formData.permissions.canManageUsers}
                  onChange={handleChange}
                />
                <label htmlFor="canManageUsers">Gestionare utilizatori</label>
              </div>
            </div>
          </section>
        )}
        
        {/* Terms and Conditions Section - ALWAYS VISIBLE */}
        <section className="form-section terms-section">
          <h2>Termeni și condiții</h2>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className={errors.termsAccepted ? "error" : ""}
            />
            <label htmlFor="termsAccepted">
              Accept <a href="/terms" target="_blank" rel="noopener noreferrer">Termenii și condițiile</a> *
            </label>
            {errors.termsAccepted && <div className="error-message">{errors.termsAccepted}</div>}
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="gdprAccepted"
              name="gdprAccepted"
              checked={formData.gdprAccepted}
              onChange={handleChange}
              className={errors.gdprAccepted ? "error" : ""}
            />
            <label htmlFor="gdprAccepted">
              Sunt de acord cu <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">prelucrarea datelor personale (GDPR)</a> *
            </label>
            {errors.gdprAccepted && <div className="error-message">{errors.gdprAccepted}</div>}
          </div>
        </section>
        
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Se procesează..." : formData.isAdmin ? "Înregistrează utilizatorul" : "Înregistrează compania"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientRegistrationForm;