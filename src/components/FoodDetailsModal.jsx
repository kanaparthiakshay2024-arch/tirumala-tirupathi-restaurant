import React, { useState, useEffect } from 'react';
import { X, Star, ThumbsUp, Sparkles, Flame, ShieldAlert, Plus, Check } from 'lucide-react';

const FoodDetailsModal = ({ item, onClose, onAddToCart, user }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(item.image_url);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(item.reviews || []);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (item.id) {
      fetch(`/api/menu/items/${item.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.reviews) setReviewsList(data.reviews);
        })
        .catch(err => console.log('Fetch item reviews error:', err));
    }
  }, [item.id]);

  const handleLikeReview = (reviewId) => {
    fetch(`/api/reviews/${reviewId}/like`, { method: 'POST' })
      .then(() => {
        setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r));
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    const token = localStorage.getItem('tr_token');

    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        menu_item_id: item.id,
        rating: newRating,
        comment: newComment
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmittingReview(false);
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          setReviewsList(prev => [{
            id: Date.now(),
            user_name: user.name,
            rating: newRating,
            comment: newComment,
            likes_count: 0
          }, ...prev]);
          setNewComment('');
        }
      });
  };

  // Gallery photos generator for multi-photo display
  const photos = [
    item.image_url || '/bhojanam.jpg',
    '/bhojanam.jpg',
    '/laddu.jpg',
    '/dosa.jpg'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '25px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'var(--maroon-header)',
            color: 'var(--gold-primary)',
            border: '1px solid var(--gold-primary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '25px' }}>
          {/* Photos Column */}
          <div>
            <div style={{
              width: '100%',
              height: '270px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
              marginBottom: '12px'
            }}>
              <img src={selectedPhoto} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Thumbnail Gallery */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {photos.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPhoto(p)}
                  style={{
                    width: '60px',
                    height: '50px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: selectedPhoto === p ? '2px solid var(--gold-primary)' : '1px solid #CCC',
                    cursor: 'pointer',
                    opacity: selectedPhoto === p ? 1 : 0.6
                  }}
                >
                  <img src={p} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="veg-badge"><span className="veg-dot"></span> 100% Pure Veg</span>
              <span style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={15} fill="var(--gold-primary)" /> {item.rating || 4.8} ({item.total_ratings || 150} Reviews)
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.75rem', fontWeight: 800 }}>
              {item.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green-btn)' }}>
                ₹{item.offer_price || item.price}
              </span>
              {item.offer_price && (
                <span style={{ fontSize: '1.1rem', color: '#888', textDecoration: 'line-through' }}>
                  ₹{item.price}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-dark)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '16px' }}>
              {item.description}
            </p>

            {/* Worship Significance Alert if Naivedyam */}
            {item.worship_significance && (
              <div style={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                borderLeft: '4px solid var(--gold-primary)',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '0.86rem'
              }}>
                <strong style={{ color: 'var(--maroon-header)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} style={{ color: 'var(--gold-dark)' }} /> Sacred Worship Significance:
                </strong>
                <p style={{ marginTop: '4px', color: 'var(--text-dark)' }}>{item.worship_significance}</p>
              </div>
            )}

            {/* Detailed Metadata Grid */}
            <div style={{
              backgroundColor: 'var(--bg-cream-dark)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.84rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <div>
                <strong style={{ color: 'var(--maroon-header)' }}>🌿 Ingredients:</strong>
                <div>{item.ingredients || 'Steamed Rice, Pure Ghee, Spices'}</div>
              </div>
              <div>
                <strong style={{ color: 'var(--maroon-header)' }}>⚠️ Allergens:</strong>
                <div>{item.allergens || 'None'}</div>
              </div>
              <div>
                <strong style={{ color: 'var(--maroon-header)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={13} /> Calories:
                </strong>
                <div>{item.calories || 320} kcal</div>
              </div>
              <div>
                <strong style={{ color: 'var(--maroon-header)' }}>🍳 Style:</strong>
                <div>{item.preparation_style || 'Traditional Temple Satvik'}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(item);
                onClose();
              }}
              className="btn-primary-green"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1.05rem' }}
            >
              <Plus size={18} /> Add {item.name} to Cart
            </button>
          </div>
        </div>

        {/* Customer Reviews & Rating Submission */}
        <div style={{ marginTop: '30px', borderTop: '2px solid var(--gold-primary)', paddingTop: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem', marginBottom: '15px' }}>
            Customer Reviews & Ratings
          </h3>

          {/* Submit Review Form */}
          <form onSubmit={handleSubmitReview} style={{
            backgroundColor: 'var(--wood-card-bg)',
            border: '1px solid var(--gold-dark)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Write Your Review & Rating</div>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= newRating ? 'var(--gold-primary)' : 'none'}
                  color="var(--gold-primary)"
                  onClick={() => setNewRating(star)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            <textarea
              rows={2}
              placeholder={user ? "Share your dining experience, taste, and quality..." : "Please login to write a review"}
              value={newComment}
              disabled={!user}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #CCC',
                marginBottom: '10px',
                fontFamily: 'inherit'
              }}
            />

            <button
              type="submit"
              disabled={!user || submittingReview}
              className="btn-maroon"
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              Submit Review
            </button>
          </form>

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviewsList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to review this dish!</p>
            ) : (
              reviewsList.map(r => (
                <div key={r.id} style={{
                  borderBottom: '1px solid #E0D6C3',
                  paddingBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--maroon-header)', fontSize: '0.92rem' }}>{r.user_name}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--gold-dark)', fontSize: '0.85rem' }}>
                      <Star size={13} fill="var(--gold-primary)" color="var(--gold-primary)" /> {r.rating} / 5
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', margin: '4px 0' }}>{r.comment}</p>
                  <button
                    onClick={() => handleLikeReview(r.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ThumbsUp size={12} /> Helpful ({r.likes_count || 0})
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsModal;
