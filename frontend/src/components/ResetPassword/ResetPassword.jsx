import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css'

const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const ResetPassword = () => {
    const location = useLocation();
    const email = location.state?.email;
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleResetPassword = async () => {
        if (!code || !newPassword) {
            showToast('Please enter both code and new password', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Password reset successful!', 'success');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                showToast(data.error || 'Failed to reset password. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            {/* Toast Notification at the top */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' ? (
                            <svg viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M16.6666 5L7.49992 14.1667L3.33325 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                </div>
            )}

            <div className="reset-password-card">
                <h1 className="reset-password-title">Reset Password</h1>
                <div className="reset-password-form">
                    <input
                        className="reset-password-input"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength="6"
                    />
                    <input
                        className="reset-password-input"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button 
                        className="reset-password-button"
                        onClick={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
