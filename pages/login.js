import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import config from '../utils/config';

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Debug logging to see what URLs are being constructed
      console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('config.API_URL:', config.API_URL);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || config.API_URL;
      const loginUrl = `${baseUrl}/auth/login`; // FIXED: Added /api/ prefix
      
      console.log('Login URL being used:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Added for CORS
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(100, 255, 218, 0.5); }
          50% { box-shadow: 0 0 40px rgba(100, 255, 218, 0.8), 0 0 60px rgba(100, 255, 218, 0.6); }
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
            <Link href="/signup" style={styles.signupButton}>Get Started</Link>
          </div>
        </div>
      </nav>

      <div style={styles.loginBox}>
        <div style={styles.loginHeader}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Trade with confidence using our proven signals</p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.forgotPasswordContainer}>
            <Link href="/forgot-password" style={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }} 
            disabled={loading}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.loadingDot}></span>
                Logging in...
              </span>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <Link href="/signup" style={styles.altButton}>
          Create New Account
        </Link>
        
        <p style={styles.bottomText}>
          By logging in, you agree to our{' '}
          <Link href="/terms" style={styles.linkText}>Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" style={styles.linkText}>Privacy Policy</Link>
        </p>
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
  
  signupButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'inline-block',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.3)',
    }
  },
  
  // Login Box
  loginBox: {
    backgroundColor: 'rgba(21, 25, 53, 0.9)',
    backdropFilter: 'blur(20px)',
    padding: '3rem',
    borderRadius: '16px',
    border: '1px solid #2a3456',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.6s ease-out',
    position: 'relative',
    zIndex: 1,
  },
  
  loginHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
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
    gap: '1.25rem',
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  label: {
    fontSize: '0.875rem',
    color: '#8892b0',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  
  input: {
    padding: '0.875rem 1rem',
    backgroundColor: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    '&:focus': {
      borderColor: '#5e9eff',
      backgroundColor: '#1e2444',
    },
    '&::placeholder': {
      color: '#5a6378',
    }
  },
  
  button: {
    padding: '1rem',
    backgroundColor: '#5e9eff',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: '#4a8af4',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(94, 158, 255, 0.4)',
    }
  },
  
  buttonDisabled: {
    opacity: 0.7,
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
  
  loadingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  
  error: {
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    padding: '1rem',
    borderRadius: '8px',
    color: '#ff5e5e',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'fadeIn 0.3s ease-out',
  },
  
  forgotPasswordContainer: {
    textAlign: 'right',
    marginTop: '-0.5rem',
  },
  
  forgotPasswordLink: {
    color: '#5e9eff',
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'color 0.3s',
    cursor: 'pointer',
    fontWeight: '500',
    '&:hover': {
      color: '#64ffda',
      textDecoration: 'underline',
    }
  },
  
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '2rem 0',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#2a3456',
    }
  },
  
  dividerText: {
    backgroundColor: '#151935',
    padding: '0 1rem',
    position: 'relative',
    color: '#8892b0',
    fontSize: '0.875rem',
    fontWeight: '500',
    letterSpacing: '1px',
  },
  
  altButton: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'transparent',
    border: '2px solid #64ffda',
    borderRadius: '8px',
    color: '#64ffda',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'rgba(100, 255, 218, 0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 20px rgba(100, 255, 218, 0.2)',
    }
  },
  
  bottomText: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#5a6378',
    fontSize: '0.75rem',
    lineHeight: '1.6',
  },
  
  linkText: {
    color: '#5e9eff',
    textDecoration: 'none',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#64ffda',
      textDecoration: 'underline',
    }
  },
};