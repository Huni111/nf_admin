import React, { useState } from 'react';
import '../styles/ProductCard.css';
import { useAuth } from '../contexts/AuthContext'
import { useDB } from '../contexts/DataBaseContext';

const Products = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation technology for immersive audio experience. Perfect for travel, work, or relaxation.",
      price: 99.99,
      image: "https://i.imgur.com/Q1M8SrN.jpeg"
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health monitoring, GPS, and long battery life. Track your fitness goals and stay connected on the go.",
      price: 199.99,
      image: "https://i.imgur.com/Q1M8SrN.jpeg"
    }
  ]);

  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1
  });

  const { currentUser } = useAuth();
  const { placeOrder } = useDB();

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * (quantities[product.id] || 0));
    }, 0);
  };

  const handlePlaceOrder = async() => {
    // Check if user is logged in
    if (!currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    const total = calculateTotal();
    
    if (total === 0) {
      alert("Please add at least one product to your order.");
      return;
    }

    const orderDetails = {
      // User Information from Firebase Auth
      user: {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'User',
      },
      // Order Items (only include items with quantity > 0)
      items: products.map(product => ({
        productId: product.id,
        productName: product.name,
        quantity: quantities[product.id] || 0,
        unitPrice: product.price,
        subtotal: product.price * (quantities[product.id] || 0)
      })).filter(item => item.quantity > 0),
      // Order Summary - Only total now
      orderSummary: {
        total: total
      },
      // Metadata
      timestamp: new Date().toISOString(),
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };

    // Here you would typically send this data to your backend/Firestore
    console.log('Order Details:', orderDetails);

    try {
    // Use the context function to save to Firestore
    const result = await placeOrder(orderDetails);
    
    alert(`Order placed successfully!\nOrder ID: ${result.orderId}\nTotal: $${orderDetails.orderSummary.total.toFixed(2)}`);
    
    // Reset quantities after order
    setQuantities({ 1: 0, 2: 0 });
  } catch (error) {
    alert(`Error placing order: ${error.message}`);
  }
      
    // Reset quantities after order
    setQuantities({ 1: 0, 2: 0 });
  };

  const hasItemsInCart = calculateTotal() > 0;

  return (
    <div className="sidebar">
      <h1>Products</h1>
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-title">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-price">${product.price.toFixed(2)}</div>
            
            {/* Quantity Controls */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '15px',
              marginBottom: '15px'
            }}>
              <button 
                style={{
                  width: '35px',
                  height: '35px',
                  border: '1px solid #007bff',
                  background: 'white',
                  color: '#007bff',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleQuantityChange(product.id, -1)}
                disabled={quantities[product.id] <= 0}
              >
                -
              </button>
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                minWidth: '30px',
                textAlign: 'center'
              }}>
                {quantities[product.id] || 0}
              </span>
              <button 
                style={{
                  width: '35px',
                  height: '35px',
                  border: '1px solid #007bff',
                  background: 'white',
                  color: '#007bff',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleQuantityChange(product.id, 1)}
              >
                +
              </button>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              fontSize: '1rem',
              color: '#666'
            }}>
              Subtotal: ${(product.price * (quantities[product.id] || 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Single Order Summary and Button */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="order-total">
          Total: ${calculateTotal().toFixed(2)}
        </div>
        <button 
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={!hasItemsInCart}
          style={{
            opacity: hasItemsInCart ? 1 : 0.6,
            cursor: hasItemsInCart ? 'pointer' : 'not-allowed'
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Products;