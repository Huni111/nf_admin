import React, { useState } from 'react';
import '../styles/ProductCard.css';
import { useAuth } from '../contexts/AuthContext'
import { useDB } from '../contexts/DataBaseContext';

const Comenzi = () => {
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
    1: 0,
    2: 0
  });

  const { currentUser } = useAuth();
  const { addToCart } = useDB();

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please log in to add items to cart.");
      return;
    }

    // Filter out items with quantity 0
    const cartItems = products
      .map(product => ({
        productId: product.id,
        productName: product.name,
        quantity: quantities[product.id] || 0,
        unitPrice: product.price,
        subtotal: product.price * (quantities[product.id] || 0)
      }))
      .filter(item => item.quantity > 0);

    if (cartItems.length === 0) {
      alert("Please add at least one product to your cart.");
      return;
    }

    try {
      await addToCart(cartItems);
      alert("Items added to cart successfully!");
      
      // Reset quantities after adding to cart
      setQuantities({ 1: 0, 2: 0 });
    } catch (error) {
      alert(`Error adding to cart: ${error.message}`);
    }
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * (quantities[product.id] || 0));
    }, 0);
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

      {/* Cart Summary and Add to Cart Button */}
      <div className="order-summary">
        <h3>Cart Summary</h3>
        <div className="order-total">
          Total: ${calculateTotal().toFixed(2)}
        </div>
        <button 
          className="place-order-btn"
          onClick={handleAddToCart}
          disabled={!hasItemsInCart}
          style={{
            opacity: hasItemsInCart ? 1 : 0.6,
            cursor: hasItemsInCart ? 'pointer' : 'not-allowed'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Comenzi;