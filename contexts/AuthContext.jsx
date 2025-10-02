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
  
  // Safety check: make sure the hook is used inside the AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const AuthProvider = ({ children }) => {

     const [currentUser, setCurrentUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     
     
     const signup = async (email, password, displayName = '') => {
    try {
      setError(null); // Clear any previous errors
        console.log(email)
        console.log(password)
        console.log(displayName)
      // Create the user account with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
      // If a display name was provided, update the user's profile
      if (displayName) {
        await updateProfile(user, { displayName });
      }


      await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName, // Use the provided display name
      createdAt: new Date(), // Track when the user was created
      // You can add any other user-related fields here in the future
    });
      
      // Return the user object
      return userCredential.user;
      
    } catch (err) {
      setError(err.message); // Store the error
      throw err; // Re-throw so the component can handle it too
    }
  };


  const login = async (email, password) => {
    try {
      setError(null); // Clear any previous errors
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Return the user object
      return userCredential.user;
      
    } catch (err) {
      setError(err.message); // Store the error
      throw err; // Re-throw so the component can handle it too
    }
  };



   const logout = async () => {
    try {
      setError(null); // Clear any previous errors
      
      // Sign out from Firebase
      await signOut(auth);
      
    } catch (err) {
      setError(err.message); // Store the error
      throw err; // Re-throw so the component can handle it too
    }
  };

  useEffect(() => {
    
    // onAuthStateChanged returns an "unsubscribe" function
    // This listener fires whenever the user logs in, logs out, or the page loads
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update currentUser (null if logged out, user object if logged in)
      setLoading(false);    // We're done checking, so set loading to false
    });

    // Cleanup function: unsubscribe when component unmounts
    // This prevents memory leaks
    return unsubscribe;
    
  }, []); 


  const value = {
    currentUser,  
    signup,       
    login,       
    logout,       
    error,       
    loading,     
  };



  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}