import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase_config';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy } from 'firebase/firestore';


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

  
  
  // We'll add our database functions here later
   const placeOrder = async (orderData) => {
    console.log('Placing order for user:', currentUser?.email);
    console.log('Order data:', orderData);
    
    setLoading(true);
    setError(null);

    try {
      // Use the orderId from Products component as the document ID
      const orderDoc = {
        // User information (from Products component)
        userId: orderData.user.uid,
        userEmail: orderData.user.email,
        userDisplayName: orderData.user.displayName,
        
        // Order items (from Products component)
        items: orderData.items,
        
        // Order summary (from Products component)
        total: orderData.orderSummary.total,
        
        // Metadata
        status: 'pending',
        createdAt: serverTimestamp(),
        
        // Keep the timestamp from Products component too
        clientTimestamp: orderData.timestamp
      };

      // Use setDoc with the specific orderId as document ID
      await setDoc(doc(db, 'orders', orderData.orderId), orderDoc);
      
      setLoading(false);
      return { 
        success: true, 
        message: 'Order placed successfully!',
        orderId: orderData.orderId // Return the same ID we used
      };
      
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };


  const getUserOrders = async () => {
    if (!currentUser) {
      throw new Error('User must be logged in to view orders');
    }

    setLoading(true);
    setError(null);

    try {
      // Query orders where userId matches current user's UID
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

      // orders.sort((a, b) => {
      //   const getTime = (order) => {
      //     if (!order.createdAt) return 0;
      //     if (order.createdAt.toDate) {
      //       return order.createdAt.toDate().getTime();
      //     }
      //     return new Date(order.createdAt).getTime();
      //   };
      //   return getTime(b) - getTime(a);
      // });


      setLoading(false);
      return orders;
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };




  // 4. Value that will be available to all components
  const value = {
    placeOrder,
    loading,
    error,
    getUserOrders,
    clearError: () => setError(null)
  };

  return (
    <DataBaseContext.Provider value={value}>
      {children}
    </DataBaseContext.Provider>
  );
};