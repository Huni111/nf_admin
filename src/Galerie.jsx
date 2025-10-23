import React, { useState, useEffect } from 'react';
import '../styles/ProductCard.css';
import { useAuth } from '../contexts/AuthContext';
import { useDB } from '../contexts/DataBaseContext';

const Galerie = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { currentUser } = useAuth();
  const { getCart, placeOrder, clearCart, loading } = useDB();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!currentUser) return;
    
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      items: cart.items,
      total: cart.total,
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      const result = await placeOrder(orderData);
      alert(`Order placed successfully!\nOrder ID: ${result.orderId}\nTotal: $${cart.total.toFixed(2)}`);
      
      // Reload cart to reflect cleared state
      await loadCart();
    } catch (error) {
      alert(`Error placing order: ${error.message}`);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCart({ items: [], total: 0 });
      alert("Cart cleared successfully!");
    } catch (error) {
      alert(`Error clearing cart: ${error.message}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="sidebar">
        <h1>Your Cart</h1>
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <h1>Your Cart</h1>
      
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="products-container">
            {cart.items.map((item, index) => (
              <div key={index} className="product-card">
                <h3 className="product-title">{item.productName}</h3>
                <div className="product-price">${item.unitPrice.toFixed(2)}</div>
                <div style={{ textAlign: 'center', fontSize: '1rem', color: '#666' }}>
                  Quantity: {item.quantity}
                </div>
                <div style={{ textAlign: 'center', fontSize: '1rem', color: '#666' }}>
                  Subtotal: ${item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-total">
              Total: ${cart.total.toFixed(2)}
            </div>
            <button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button 
              className="clear-cart-btn"
              onClick={handleClearCart}
              style={{
                marginTop: '10px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Galerie;