import React, { useState, useEffect, useRef } from 'react';
import './OTPModal.css';

const OTPModal = ({ 
  email, 
  showOTPModal, 
  setShowOTPModal, 
  API_URL,
  onVerificationSuccess 
}) => {
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const countdownRef = useRef(null);
  const inputRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  // Auto-focus input when OTP sent
  useEffect(() => {
    if (otpSent && inputRef.current && !verificationSuccess) {
      inputRef.current.focus();
    }
  }, [otpSent, verificationSuccess]);

  // Reset when modal closes
  useEffect(() => {
    if (!showOTPModal) {
      resetModal();
    }
  }, [showOTPModal]);

  const resetModal = () => {
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setCountdown(0);
    setOtpLoading(false);
    setVerificationSuccess(false);
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
  };

  const sendOTP = async () => {
    if (!email) {
      alert('Please enter your email first');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setVerificationSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
      setCountdown(60);
      setOtpError('');
    } catch (error) {
      setOtpError(error.message);
      console.log(error);
      
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const response = await fetch(`${API_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Show success message
      setVerificationSuccess(true);
      setOtpError('');
      
      // Call the success callback
      if (onVerificationSuccess) {
        console.log('Calling onVerificationSuccess callback');
        onVerificationSuccess();
      }
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowOTPModal(false);
      }, 2000);
      
    } catch (error) {
      setOtpError(error.message);
      setVerificationSuccess(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) {
      setOtpError(`Please wait ${countdown} seconds before resending OTP`);
      return;
    }
    await sendOTP();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === 6) {
      verifyOTP();
    }
  };

  const handleCloseModal = () => {
    setShowOTPModal(false);
  };

  if (!showOTPModal) return null;

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal-content">
        {verificationSuccess ? (
          <div className="verification-success-message">
            <div className="success-icon">✓</div>
            <h2 className="otp-modal-title">Email Verified!</h2>
            <p className="otp-modal-text">
              Your email has been successfully verified.
            </p>
            <p className="otp-modal-text">
              You can now proceed to the next section.
            </p>
            <button
              onClick={handleCloseModal}
              className="otp-modal-btn otp-modal-btn-primary"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <h2 className="otp-modal-title">Email Verification</h2>
            
            {!otpSent ? (
              <>
                <p className="otp-modal-text">
                  We'll send a 6-digit OTP to:<br />
                  <strong>{email}</strong>
                </p>
                <button
                  onClick={sendOTP}
                  disabled={otpLoading}
                  className={`otp-modal-btn otp-modal-btn-primary ${otpLoading ? 'loading' : ''}`}
                >
                  {otpLoading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </>
            ) : (
              <>
                <p className="otp-modal-text">
                  Enter the 6-digit OTP sent to:<br />
                  <strong>{email}</strong>
                </p>
                
                <div className="otp-input-container">
                  <input
                    ref={inputRef}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyPress={handleKeyPress}
                    placeholder="000000"
                    className="otp-input"
                    maxLength={6}
                    disabled={otpLoading}
                  />
                </div>

                {otpError && (
                  <div className="otp-error">
                    <span className="otp-error-icon">⚠</span>
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="otp-button-group">
                  <button
                    onClick={resendOTP}
                    disabled={countdown > 0 || otpLoading}
                    className={`otp-modal-btn otp-modal-btn-secondary ${countdown > 0 || otpLoading ? 'disabled' : ''}`}
                  >
                    {countdown > 0 ? `Resend (${countdown}s)` : 'Resend OTP'}
                  </button>
                  <button
                    onClick={verifyOTP}
                    disabled={otpLoading || otp.length !== 6}
                    className={`otp-modal-btn otp-modal-btn-primary ${otpLoading || otp.length !== 6 ? 'disabled' : ''}`}
                  >
                    {otpLoading ? (
                      <>
                        <span className="spinner"></span>
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                </div>
              </>
            )}

            <button
              onClick={handleCloseModal}
              className="otp-modal-close-btn"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPModal;