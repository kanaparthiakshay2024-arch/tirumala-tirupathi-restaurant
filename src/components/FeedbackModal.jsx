import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const FeedbackModal = ({ orderId, onClose, user }) => {
  const [foodQuality, setFoodQuality] = useState(5);
  const [taste, setTaste] = useState(5);
  const [hygiene, setHygiene] = useState(5);
  const [delivery, setDelivery] = useState(5);
  const [service, setService] = useState(5);
  const [overall, setOverall] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('tr_token');

    fetch('/api/reviews/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        order_id: orderId || null,
        food_quality: foodQuality,
        taste,
        hygiene,
        delivery,
        service,
        overall,
        comments
      })
    })
      .then(res => res.json())
      .then(() => {
        setSubmitted(true);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
        }, 2200);
      });
  };

  const StarRatingRow = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--maroon-header)' }}>{label}</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= value ? 'var(--gold-primary)' : 'none'}
            color="var(--gold-primary)"
            onClick={() => onChange(star)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '30px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <CheckCircle2 size={50} style={{ color: 'var(--green-btn)', margin: '0 auto 15px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem' }}>
              Thank You for Your Feedback!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Your valuable suggestions help us serve you better with divine Satvik hospitality.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--gold-primary)' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem', marginTop: '6px' }}>
                Thank You for Dining with Tirupati Restaurant!
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Your feedback helps us serve you better. Please rate your experience and share your valuable suggestions.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <StarRatingRow label="Food Quality" value={foodQuality} onChange={setFoodQuality} />
              <StarRatingRow label="Taste & Authenticity" value={taste} onChange={setTaste} />
              <StarRatingRow label="Hygiene & Satvik Purity" value={hygiene} onChange={setHygiene} />
              <StarRatingRow label="Delivery Timeliness" value={delivery} onChange={setDelivery} />
              <StarRatingRow label="Customer Service" value={service} onChange={setService} />
              <StarRatingRow label="Overall Dining Experience" value={overall} onChange={setOverall} />

              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Suggestions or Comments (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share your thoughts with our culinary team..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-green"
                style={{ width: '100%', justifyContent: 'center', marginTop: '18px', padding: '10px' }}
              >
                Submit Feedback
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
