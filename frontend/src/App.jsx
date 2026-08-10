import React, { useState, useEffect } from 'react';
import './App.css';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ||
  (typeof window !== 'undefined' && window.location.port === '30000'
    ? `http://${window.location.hostname}:30500`
    : 'http://localhost:5000');



function App() {
  const [cakes, setCakes] = useState([]);
  const [ratings, setRatings] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [basket, setBasket] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem('cake_user') || '{}');
  const [customerName, setCustomerName] = useState(savedUser.customerName || '');
  const [customerEmail, setCustomerEmail] = useState(savedUser.customerEmail || '');

  const [checkoutMsg, setCheckoutMsg] = useState('');
  const [notifications, setNotifications] = useState([]);
  
  // Rating Modal state
  const [ratingModal, setRatingModal] = useState({ open: false, cakeId: '', cakeName: '', score: 5, comment: '' });

  const handleClearUser = () => {
    localStorage.removeItem('cake_user');
    setCustomerName('');
    setCustomerEmail('');
  };

  // 1. Fetch cakes from API Gateway
  const fetchCakes = async () => {
    try {
      let url = `${GATEWAY_URL}/api/cakes`;
      let params = [];
      if (categoryFilter) params.push(`category=${categoryFilter}`);
      if (searchQuery) params.push(`name=${encodeURIComponent(searchQuery)}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setCakes(json.data);
        json.data.forEach(cake => fetchRatingSummary(cake._id));
      }
    } catch (err) {
      console.error('Error fetching cakes:', err);
    }
  };

  // 2. Fetch rating summary for a cake
  const fetchRatingSummary = async (cakeId) => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/ratings/cake/${cakeId}/summary`);
      const json = await res.json();
      if (json.success) {
        setRatings(prev => ({
          ...prev,
          [cakeId]: { averageRating: json.averageRating, totalReviews: json.totalReviews }
        }));
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  // 3. Fetch notifications history
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/notifications`);
      const json = await res.json();
      if (json.success && json.data) {
        setNotifications(json.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchCakes();
    fetchNotifications();
  }, [categoryFilter, searchQuery]);

  // Basket Management
  const addToBasket = (cake) => {
    setBasket(prev => {
      const existing = prev.find(item => item.cakeId === cake._id);
      if (existing) {
        return prev.map(item =>
          item.cakeId === cake._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { cakeId: cake._id, name: cake.name, price: cake.price, quantity: 1 }];
    });
  };

  const removeFromBasket = (cakeId) => {
    setBasket(prev => prev.filter(item => item.cakeId !== cakeId));
  };

  const calculateTotal = () => {
    return basket.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };


  // Handle Checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (basket.length === 0) return alert('Your basket is empty!');
    if (!customerName || !customerEmail) return alert('Please enter name and email!');

    // Persist in localStorage
    localStorage.setItem('cake_user', JSON.stringify({ customerName, customerEmail }));

    try {
      // 1. Add items to backend basket
      const customerId = 'cust_' + Date.now();
      for (const item of basket) {
        await fetch(`${GATEWAY_URL}/api/basket/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId,
            cakeId: item.cakeId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })
        });
      }

      // 2. Complete Checkout
      const checkoutRes = await fetch(`${GATEWAY_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, customerName, customerEmail })
      });
      const checkoutJson = await checkoutRes.json();

      if (checkoutJson.success) {
        setCheckoutMsg(`🎉 Order #${checkoutJson.data._id.substring(0, 8)} Completed! Notification sent to ${customerEmail}.`);
        setBasket([]);
        fetchNotifications();
      } else {
        alert(checkoutJson.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed. Make sure API Gateway is running on port 5000!');
    }
  };


  // Submit Rating
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${GATEWAY_URL}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cakeId: ratingModal.cakeId,
          customerName: customerName || 'Anonymous',
          ratingScore: Number(ratingModal.score),
          comment: ratingModal.comment
        })
      });
      const json = await res.json();
      if (json.success) {
        alert('Thank you! Rating submitted.');
        fetchRatingSummary(ratingModal.cakeId);
        setRatingModal({ open: false, cakeId: '', cakeName: '', score: 5, comment: '' });
      }
    } catch (err) {
      console.error('Rating error:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="navbar">
        <h1 className="logo">🎂 Cake Delight</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {customerEmail && (
            <div className="user-badge" style={{ fontSize: '13px', background: '#e8f5e9', color: '#2e7d32', padding: '6px 12px', borderRadius: '16px' }}>
              👤 {customerName || 'User'} ({customerEmail})
              <button 
                onClick={handleClearUser} 
                style={{ marginLeft: '8px', border: 'none', background: 'none', color: '#c62828', cursor: 'pointer', fontWeight: 'bold' }}
                title="Change User"
              >
                ✕ Change
              </button>
            </div>
          )}
          <div className="cart-badge">
            🛒 Cart: <strong>{basket.reduce((sum, i) => sum + i.quantity, 0)} items</strong> (${calculateTotal()})
          </div>
        </div>
      </header>


      {/* Main Grid Layout */}
      <div className="main-content">
        
        {/* Left Column: Catalog */}
        <div className="catalog-section">
          
          {/* Search & Filter Bar */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="category-buttons">
              {['', 'Chocolate', 'Velvet', 'Fruit'].map(cat => (
                <button
                  key={cat}
                  className={`btn-category ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === '' ? 'All Cakes' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cakes Grid */}
          <div className="cakes-grid">
            {cakes.length === 0 ? (
              <p className="no-cakes">No cakes found. (Make sure API Gateway port 5000 is running!)</p>
            ) : (
              cakes.map(cake => {
                const r = ratings[cake._id] || { averageRating: 0, totalReviews: 0 };
                return (
                  <div key={cake._id} className="cake-card">
                    <img src={cake.imageUrl} alt={cake.name} className="cake-img" />
                    <div className="cake-info">
                      <span className="category-tag">{cake.category}</span>
                      <h3 className="cake-title">{cake.name}</h3>
                      <p className="cake-desc">{cake.description}</p>
                      
                      <div className="rating-row">
                        <span className="stars">⭐ {r.averageRating > 0 ? r.averageRating : 'New'}</span>
                        <span className="reviews-count">({r.totalReviews} reviews)</span>
                        <button
                          className="btn-rate"
                          onClick={() => setRatingModal({ open: true, cakeId: cake._id, cakeName: cake.name, score: 5, comment: '' })}
                        >
                          + Rate
                        </button>
                      </div>

                      <div className="card-footer">
                        <span className="price">${cake.price.toFixed(2)}</span>
                        <button className="btn-add" onClick={() => addToBasket(cake)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Cart & Notifications */}
        <div className="sidebar-section">
          
          {/* Shopping Cart Box */}
          <div className="sidebar-box">
            <h2>🛒 Shopping Cart</h2>
            {basket.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <div className="cart-list">
                {basket.map(item => (
                  <div key={item.cakeId} className="cart-item">
                    <div>
                      <strong>{item.name}</strong>
                      <div>${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <button className="btn-remove" onClick={() => removeFromBasket(item.cakeId)}>✕</button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total Amount:</span>
                  <strong>${calculateTotal()}</strong>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="checkout-form">
                  <h3>Checkout Details</h3>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-checkout">Complete Checkout</button>
                </form>
              </div>
            )}

            {checkoutMsg && <div className="success-banner">{checkoutMsg}</div>}
          </div>

          {/* Notifications Box */}
          <div className="sidebar-box">
            <h2>🔔 Order Notifications</h2>
            {(() => {
              const userNotifications = customerEmail
                ? notifications.filter(n => n.customerEmail && n.customerEmail.toLowerCase() === customerEmail.toLowerCase())
                : notifications;

              if (userNotifications.length === 0) {
                return <p className="empty-cart">{customerEmail ? `No notifications for ${customerEmail}` : 'No notifications yet.'}</p>;
              }

              return (
                <div className="notifications-list">
                  {userNotifications.slice(0, 5).map(n => (
                    <div key={n._id} className="notification-card">
                      <span className="badge-sent">{n.status}</span>
                      <p><strong>Order #{n.orderId.substring(0, 8)}</strong></p>
                      <small>{n.message}</small>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>


        </div>
      </div>

      {/* Simple Rating Modal */}
      {ratingModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rate {ratingModal.cakeName}</h3>
            <form onSubmit={handleRatingSubmit}>
              <label>Star Rating (1 to 5):</label>
              <select
                value={ratingModal.score}
                onChange={(e) => setRatingModal({ ...ratingModal, score: Number(e.target.value) })}
              >
                <option value="5">5 ⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">4 ⭐⭐⭐⭐ (Very Good)</option>
                <option value="3">3 ⭐⭐⭐ (Good)</option>
                <option value="2">2 ⭐⭐ (Fair)</option>
                <option value="1">1 ⭐ (Poor)</option>
              </select>

              <label>Review Comment:</label>
              <textarea
                placeholder="Write a short review..."
                value={ratingModal.comment}
                onChange={(e) => setRatingModal({ ...ratingModal, comment: e.target.value })}
                rows="3"
              />

              <div className="modal-actions">
                <button type="submit" className="btn-add">Submit Rating</button>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => setRatingModal({ open: false, cakeId: '', cakeName: '', score: 5, comment: '' })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
