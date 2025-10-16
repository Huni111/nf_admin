import React, { useState, useEffect } from 'react';
import { useDB } from '../contexts/DataBaseContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Order.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUserOrders, error } = useDB();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, getUserOrders]);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    // If it's a Firestore timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // If it's a regular date string
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">Orders</h1>
        <div className="no-orders">
          Please log in to view your orders.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">Orders</h1>
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">Orders</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #: {order.id}</div>
                <div className="order-date">{formatDate(order.createdAt)}</div>
                <div className={`order-status status-${order.status || 'pending'}`}>
                  {order.status || 'pending'}
                </div>
              </div>

              <div className="order-items">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">${item.subtotal?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                Total: ${order.total?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;