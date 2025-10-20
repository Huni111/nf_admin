import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase_config';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const DataBaseContext = createContext();

export const useDB = () => {
  const context = useContext(DataBaseContext);
  if (!context) {
    throw new Error('useDB must be used within a DataBaseProvider');
  }
  return context;
};

export const DataBaseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add/Update user's cart
  const addToCart = async (cartItems) => {
    if (!currentUser) {
      throw new Error('User must be logged in to add to cart');
    }

    setLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const cartData = {
        items: cartItems,
        updatedAt: serverTimestamp(),
        total: cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
      };

      // Check if user document exists
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Update existing user document
        await updateDoc(userDocRef, {
          cart: cartData,
          lastUpdated: serverTimestamp()
        });
      } else {
        // Create new user document with cart
        await setDoc(userDocRef, {
          email: currentUser.email,
          displayName: currentUser.displayName || 'User',
          cart: cartData,
          createdAt: serverTimestamp()
        });
      }

      setLoading(false);
      return { 
        success: true, 
        message: 'Cart updated successfully!'
      };
      
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Get user's cart
  const getCart = async () => {
    if (!currentUser) {
      throw new Error('User must be logged in to view cart');
    }

    setLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setLoading(false);
        return userData.cart || { items: [], total: 0 };
      } else {
        setLoading(false);
        return { items: [], total: 0 };
      }
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Clear user's cart
  const clearCart = async () => {
    if (!currentUser) {
      throw new Error('User must be logged in to clear cart');
    }

    setLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        cart: { items: [], total: 0, updatedAt: serverTimestamp() }
      });

      setLoading(false);
      return { 
        success: true, 
        message: 'Cart cleared successfully!'
      };
      
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Place order from cart (creates separate order document)
  const placeOrder = async (orderData) => {
    if (!currentUser) {
      throw new Error('User must be logged in to place order');
    }

    setLoading(true);
    setError(null);

    try {
      // Create order in separate orders collection
      const orderDoc = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName || 'User',
        items: orderData.items,
        total: orderData.total,
        status: 'completed',
        createdAt: serverTimestamp(),
        orderId: orderData.orderId
      };

      // Save to orders collection
      await setDoc(doc(db, 'orders', orderData.orderId), orderDoc);

      // Clear the user's cart after successful order
      await clearCart();

      setLoading(false);
      return { 
        success: true, 
        message: 'Order placed successfully!',
        orderId: orderData.orderId
      };
      
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Get user's orders from orders collection
  const getUserOrders = async () => {
    if (!currentUser) {
      throw new Error('User must be logged in to view orders');
    }

    setLoading(true);
    setError(null);

    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setLoading(false);
      return orders;
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const value = {
    // Cart functions (stored in user document)
    addToCart,
    getCart,
    clearCart,
    
    // Order functions (stored in orders collection)
    placeOrder,
    getUserOrders,
    
    // State
    loading,
    error,
    clearError: () => setError(null)
  };

  return (
    <DataBaseContext.Provider value={value}>
      {children}
    </DataBaseContext.Provider>
  );
};