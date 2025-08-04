import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import config from '../utils/config';

// Add getServerSideProps to prevent static generation
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Get token safely
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token);
    }
  }, [router.isReady, router.query.token]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/verify-reset-token?token=${token}`);
      const data = await response.json();
      
      if (data.valid) {
        setValidToken(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
        setValidToken(false);
      }
    } catch (err) {
      setError('Failed to verify reset link.');
    } finally {
      setVerifying(false);
    }
  };

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    if (!/[@$!%*?&]/.test(pwd)) errors.push('One special character (@$!%*?&)');
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <p>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div style={styles.container}>
        <div style={styles.formCard}>
          <h1 style={styles.title}>Invalid Link</h1>
          <div style={styles.errorMessage}>
            {error}
          </div>
          <Link href="/forgot-password" style={styles.linkButton}>
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Create New Password</h1>
        
        {message && (
          <div style={styles.successMessage}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              style={styles.input}
              placeholder="Enter new password"
              required
              disabled={loading}
            />
            
            <div style={styles.requirements}>
              <p style={styles.requirementsTitle}>Password must contain:</p>
              <ul style={styles.requirementsList}>
                <li style={password.length >= 8 ? styles.requirementMet : styles.requirement}>
                  At least 8 characters
                </li>
                <li style={/[A-Z]/.test(password) ? styles.requirementMet : styles.requirement}>
                  One uppercase letter
                </li>
                <li style={/[a-z]/.test(password) ? styles.requirementMet : styles.requirement}>
                  One lowercase letter
                </li>
                <li style={/[0-9]/.test(password) ? styles.requirementMet : styles.requirement}>
                  One number
                </li>
                <li style={/[@$!%*?&]/.test(password) ? styles.requirementMet : styles.requirement}>
                  One special character (@$!%*?&)
                </li>
              </ul>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
            {confirmPassword && password !== confirmPassword && (
              <span style={styles.errorText}>Passwords do not match</span>
            )}
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading || passwordErrors.length > 0 || password !== confirmPassword}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0e27',
    padding: '2rem',
  },
  formCard: {
    background: '#151935',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '3rem',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  loadingCard: {
    background: '#151935',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '3rem',
    textAlign: 'center',
    color: '#8892b0',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#8892b0',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  input: {
    background: '#0a0e27',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  submitButton: {
    background: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    marginTop: '1rem',
  },
  successMessage: {
    background: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid #64ffda',
    borderRadius: '6px',
    padding: '1rem',
    color: '#64ffda',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  errorMessage: {
    background: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '6px',
    padding: '1rem',
    color: '#ff5e5e',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  requirements: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: '#0a0e27',
    borderRadius: '6px',
  },
  requirementsTitle: {
    fontSize: '0.75rem',
    color: '#8892b0',
    marginBottom: '0.5rem',
  },
  requirementsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  requirement: {
    fontSize: '0.75rem',
    color: '#8892b0',
    padding: '0.25rem 0',
  },
  requirementMet: {
    fontSize: '0.75rem',
    color: '#64ffda',
    padding: '0.25rem 0',
  },
  errorText: {
    color: '#ff5e5e',
    fontSize: '0.75rem',
  },
  linkButton: {
    display: 'block',
    textAlign: 'center',
    background: '#5e9eff',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    textDecoration: 'none',
    marginTop: '1rem',
  },
};