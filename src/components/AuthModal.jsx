import React, { useState } from 'react';
import { X, Lock, Phone, Mail, User, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [step, setStep] = useState(1); // 1 = Mobile + OTP, 2 = Email + Password

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) return setErrorMsg('Full Name is required');
    if (!mobile || mobile.length < 10) return setErrorMsg('Valid 10-digit mobile number is required');

    setLoading(true);
    fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setOtpSent(true);
          alert(`OTP sent to +91 ${mobile}. (Demo OTP is: ${data.demo_otp || '123456'})`);
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Network error sending OTP');
      });
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp) return setErrorMsg('Enter the 6-digit OTP code');

    setLoading(true);
    fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setOtpVerified(true);
          setStep(2); // Move to Step 2
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Error verifying OTP');
      });
  };

  // Step 2 Complete Registration
  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) return setErrorMsg('Email Address is mandatory');
    if (!password) return setErrorMsg('Password is mandatory');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match');

    setLoading(true);
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, mobile, email, password, dob, gender
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          localStorage.setItem('tr_token', data.token);
          onLoginSuccess(data.user, data.token);
          onClose();
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Registration failed');
      });
  };

  // Login Handle
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier || !loginPassword) return setErrorMsg('Please enter Email/Mobile and Password');

    setLoading(true);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          localStorage.setItem('tr_token', data.token);
          onLoginSuccess(data.user, data.token);
          onClose();
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Login failed');
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '30px' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'var(--maroon-header)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid var(--gold-primary)' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.5rem', marginTop: '8px' }}>
            {isLoginMode ? 'Welcome Back Devotee' : 'Register New Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Tirupati Restaurant • Pure South Indian Satvik Dining
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            color: '#C62828',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '0.84rem'
          }}>
            {errorMsg}
          </div>
        )}

        {isLoginMode ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                Email Address or Mobile Number
              </label>
              <input
                type="text"
                required
                placeholder="Enter Email or Mobile"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary-green" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Logging in...' : 'Login to Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.85rem' }}>
              Don't have an account?{' '}
              <span
                onClick={() => { setIsLoginMode(false); setStep(1); }}
                style={{ color: 'var(--gold-dark)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign Up via 2-Step OTP
              </span>
            </div>
          </form>
        ) : (
          /* 2-STEP REGISTRATION FORM */
          <div>
            {/* Step Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '4px 12px',
                borderRadius: '15px',
                backgroundColor: step === 1 ? 'var(--gold-primary)' : 'var(--bg-cream-dark)',
                color: step === 1 ? '#380910' : '#888',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                Step 1: Mobile & OTP
              </div>
              <ArrowRight size={14} />
              <div style={{
                padding: '4px 12px',
                borderRadius: '15px',
                backgroundColor: step === 2 ? 'var(--gold-primary)' : 'var(--bg-cream-dark)',
                color: step === 2 ? '#380910' : '#888',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                Step 2: Email & Password
              </div>
            </div>

            {step === 1 ? (
              /* STEP 1: MOBILE & OTP */
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                        Mobile Number (+91)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-Digit Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                      />
                    </div>

                    <button type="submit" disabled={loading} className="btn-maroon" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ backgroundColor: '#E8F5E9', padding: '10px', borderRadius: '6px', fontSize: '0.82rem', color: '#1B5E20' }}>
                      OTP has been sent to +91 {mobile}. (Demo OTP: 123456)
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }}
                      />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary-green" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      {loading ? 'Verifying...' : 'Verify OTP & Continue to Step 2'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* STEP 2: EMAIL & PASSWORD (MANDATORY) */
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                    Email Address (Mandatory) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                    />
                  </div>
                </div>

                {/* Optional Fields: DOB & Gender */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Date of Birth (Optional)
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Gender (Optional)
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary-green" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <span
                onClick={() => setIsLoginMode(true)}
                style={{ color: 'var(--gold-dark)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Log In Instead
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
