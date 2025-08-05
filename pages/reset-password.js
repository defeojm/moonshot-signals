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
  const [passwordErrors, setPasswordErrors] = useState([]);
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
      const response = await fetch(`${config.API_URL}/auth/verify-reset-token?token=${token}`);
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
      const response = await fetch(`${config.API_URL}/auth/reset-password`, {
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
        <style jsx global>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
        
        {/* Background Elements */}
        <div style={styles.bgElements}>
          <div style={styles.bgCircle1}></div>
          <div style={styles.bgCircle2}></div>
        </div>

        {/* Navigation Bar */}
        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <Link href="/" style={styles.logo}>MoonShot Signals</Link>
            <div style={styles.navLinks}>
              <Link href="/" style={styles.navLink}>Home</Link>
              <Link href="/login" style={styles.navLink}>Login</Link>
            </div>
          </div>
        </nav>

        <div style={styles.loadingCard}>
          <div style={styles.loadingDot}></div>
          <p style={styles.loadingText}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div style={styles.container}>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Background Elements */}
        <div style={styles.bgElements}>
          <div style={styles.bgCircle1}></div>
          <div style={styles.bgCircle2}></div>
        </div>

        {/* Navigation Bar */}
        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <Link href="/" style={styles.logo}>MoonShot Signals</Link>
            <div style={styles.navLinks}>
              <Link href="/" style={styles.navLink}>Home</Link>
              <Link href="/login" style={styles.navLink}>Login</Link>
            </div>
          </div>
        </nav>

        <div style={styles.formCard}>
          <div style={styles.iconWrapper}>
            <span style={styles.errorIcon}>⚠️</span>
          </div>
          <h1 style={styles.title}>Invalid Link</h1>
          <div style={styles.errorMessage}>
            {error}
          </div>
          <Link href="/forgot-password" style={styles.linkButton}>
            Request New Reset Link
          </Link>
          <Link href="/login" style={styles.altLink}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes checkmark {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Background Elements */}
      <div style={styles.bgElements}>
        <div style={styles.bgCircle1}></div>
        <div style={styles.bgCircle2}></div>
      </div>

      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>MoonShot Signals</Link>
          <div style={styles.navLinks}>
            <Link href="/" style={styles.navLink}>Home</Link>
            <Link href="/login" style={styles.navLink}>Login</Link>
          </div>
        </div>
      </nav>

      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h1 style={styles.title}>Create New Password</h1>
          <p style={styles.subtitle}>Choose a strong password to protect your account</p>
        </div>
        
        {message && (
          <div style={styles.successMessage}>
            <span style={styles.successIcon}>✓</span>
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
                  <span style={styles.checkIcon}>{password.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters
                </li>
                <li style={/[A-Z]/.test(password) ? styles.requirementMet : styles.requirement}>
                  <span style={styles.checkIcon}>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                  One uppercase letter
                </li>
                <li style={/[a-z]/.test(password) ? styles.requirementMet : styles.requirement}>
                  <span style={styles.checkIcon}>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                  One lowercase letter
                </li>
                <li style={/[0-9]/.test(password) ? styles.requirementMet : styles.requirement}>
                  <span style={styles.checkIcon}>{/[0-9]/.test(password) ? '✓' : '○'}</span>
                  One number
                </li>
                <li style={/[@$!%*?&]/.test(password) ? styles.requirementMet : styles.requirement}>
                  <span style={styles.checkIcon}>{/[@$!%*?&]/.test(password) ? '✓' : '○'}</span>
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
              style={{
                ...styles.input,
                ...(confirmPassword && password !== confirmPassword ? styles.inputError : {})
              }}
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
            style={{
              ...styles.submitButton,
              ...(loading || passwordErrors.length > 0 || password !== confirmPassword ? styles.buttonDisabled : {})
            }}
            disabled={loading || passwordErrors.length > 0 || password !== confirmPassword}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.loadingDot}></span>
                Resetting Password...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div style={styles.bottomLinks}>
          <Link href="/login" style={styles.bottomLink}>
            Back to Login
          </Link>
          <span style={styles.separator}>•</span>
          <Link href="/signup" style={styles.bottomLink}>
            Create Account
          </Link>
        </div>
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
    backgroundColor: '#0a0e27',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Background elements
  bgElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  
  bgCircle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
    top: '-300px',
    right: '-300px',
    animation: 'pulse 8s ease-in-out infinite',
  },
  
  bgCircle2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(94, 158, 255, 0.1) 0%, transparent 70%)',
    bottom: '-250px',
    left: '-250px',
    animation: 'pulse 10s ease-in-out infinite',
  },
  
  // Navigation
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a3456',
    zIndex: 1000,
  },
  
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #64ffda 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  
  navLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontWeight: '500',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  formCard: {
    backgroundColor: 'rgba(21, 25, 53, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid #2a3456',
    borderRadius: '16px',
    padding: '3rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.6s ease-out',
    position: 'relative',
    zIndex: 1,
  },
  
  loadingCard: {
    backgroundColor: 'rgba(21, 25, 53, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid #2a3456',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    zIndex: 1,
  },
  
  loadingDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#64ffda',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  
  loadingText: {
    color: '#8892b0',
    fontSize: '1rem',
  },
  
  formHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  
  iconWrapper: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  
  errorIcon: {
    fontSize: '3rem',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.75rem',
    letterSpacing: '-1px',
  },
  
  subtitle: {
    fontSize: '1.125rem',
    color: '#8892b0',
    lineHeight: '1.6',
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
    letterSpacing: '0.5px',
  },
  
  input: {
    background: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
    '&:focus': {
      borderColor: '#5e9eff',
      backgroundColor: '#1e2444',
    },
    '&::placeholder': {
      color: '#5a6378',
    }
  },
  
  inputError: {
    borderColor: '#ff5e5e',
  },
  
  submitButton: {
    background: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.4)',
    }
  },
  
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
    }
  },
  
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  
  successMessage: {
    background: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid #64ffda',
    borderRadius: '8px',
    padding: '1rem',
    color: '#64ffda',
    marginBottom: '1.5rem',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    animation: 'fadeIn 0.3s ease-out',
  },
  
  successIcon: {
    fontSize: '1.25rem',
    animation: 'checkmark 0.4s ease-out',
  },
  
  errorMessage: {
    background: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    padding: '1rem',
    color: '#ff5e5e',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'fadeIn 0.3s ease-out',
  },
  
  requirements: {
    marginTop: '0.75rem',
    padding: '1rem',
    background: 'rgba(30, 36, 68, 0.5)',
    borderRadius: '8px',
    border: '1px solid #2a3456',
  },
  
  requirementsTitle: {
    fontSize: '0.75rem',
    color: '#8892b0',
    marginBottom: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  requirementsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  requirement: {
    fontSize: '0.875rem',
    color: '#5a6378',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.3s',
  },
  
  requirementMet: {
    fontSize: '0.875rem',
    color: '#64ffda',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '500',
    animation: 'checkmark 0.3s ease-out',
  },
  
  checkIcon: {
    fontSize: '0.875rem',
    width: '20px',
    textAlign: 'center',
  },
  
  errorText: {
    color: '#ff5e5e',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    fontWeight: '500',
  },
  
  linkButton: {
    display: 'block',
    textAlign: 'center',
    background: '#5e9eff',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    marginTop: '1.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(94, 158, 255, 0.4)',
    }
  },
  
  altLink: {
    display: 'block',
    textAlign: 'center',
    color: '#8892b0',
    textDecoration: 'none',
    marginTop: '1rem',
    fontSize: '0.875rem',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  bottomLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #2a3456',
  },
  
  bottomLink: {
    color: '#8892b0',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.3s',
    fontWeight: '500',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  separator: {
    color: '#5a6378',
    fontSize: '0.875rem',
  },
};