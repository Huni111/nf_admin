import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,  
  signInWithEmailAndPassword,      
  signOut,                         
  onAuthStateChanged,            
  updateProfile               
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase_config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated signup function to handle your form data
  const signup = async (formData) => {
    try {
      setError(null);
      
      const { 
        email, 
        password, 
        contactName, 
        isAdmin,
        companyName,
        cui,
        registrationNumber,
        socialAddress,
        deliveryAddress,
        contactPosition,
        phoneNumber,
        iban,
        bank,
        vatPayer,
        collaborationType,
        otherCollaborationDetails,
        preferredChannel,
        preferredLanguage,
        permissions
      } = formData;

      console.log('Creating user with email:', email);
      console.log('User type:', isAdmin ? 'Admin' : 'Company');

      // Create the user account with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with contact name
      if (contactName) {
        await updateProfile(user, { 
          displayName: contactName 
        });
      }

      // Prepare user data for Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: contactName,
        userType: isAdmin ? 'admin' : 'company',
        createdAt: new Date(),
        // Common fields for both admin and company
        contactName,
        phoneNumber,
        // Company-specific fields (only for company users)
        ...(!isAdmin && {
          companyName,
          cui,
          registrationNumber,
          socialAddress,
          deliveryAddress,
          contactPosition,
          iban,
          bank,
          vatPayer,
          collaborationType,
          otherCollaborationDetails,
          preferredChannel,
          preferredLanguage
        }),
        // Admin-specific fields (only for admin users)
        ...(isAdmin && {
          permissions: permissions || {
            canView: true,
            canEdit: false,
            canDelete: false,
            canManageUsers: false
          }
        })
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      console.log('User created successfully:', user.uid);
      return user;

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Function to update user profile with additional data
  const updateUserProfile = async (additionalData) => {
    try {
      setError(null);
      const user = auth.currentUser;
      
      if (user) {
        // Update Firestore document
        await setDoc(doc(db, 'users', user.uid), additionalData, { merge: true });
        return true;
      }
      throw new Error('No user logged in');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Function to get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,  
    signup,       
    login,       
    logout,       
    updateUserProfile,
    getUserData,
    error,       
    loading,     
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};