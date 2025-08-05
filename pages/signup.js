import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import config from '../utils/config';

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  // Get plan from URL query
  const { plan = 'essential' } = router.query;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      // Create account
      const response = await fetch(`${config.API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('selectedPlan', plan); // Store the plan
        
        // Redirect to checkout page
        router.push('/checkout');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
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
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
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
            <Link href="/login" style={styles.loginButton}>Login</Link>
          </div>
        </div>
      </nav>

      <div style={styles.signupBox}>
        <div style={styles.signupHeader}>
          <h1 style={styles.title}>Create Your Account</h1>
          <p style={styles.subtitle}>Join elite traders getting proven signals daily</p>
        </div>
        
        <div style={styles.planInfo}>
          <div style={styles.planBadge}>
            <span style={styles.planLabel}>Selected Plan</span>
            <span style={styles.planName}>
              {plan === 'vip' ? 'VIP' : 'Essential'}
            </span>
            <span style={styles.planPrice}>
              ${plan === 'vip' ? '199' : '99'}/month
            </span>
          </div>
          {plan === 'vip' && (
            <div style={styles.planFeatures}>
              <span style={styles.featureTag}>✓ All Signals</span>
              <span style={styles.featureTag}>✓ Priority Support</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSignup} style={styles.form}>
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
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.showPasswordBtn}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                ...styles.input,
                ...(confirmPassword && password !== confirmPassword ? styles.inputError : {})
              }}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <span style={styles.errorText}>Passwords do not match</span>
            )}
          </div>

          <div style={styles.checkboxGroup}>
            <input type="checkbox" id="terms" required style={styles.checkbox} />
            <label htmlFor="terms" style={styles.checkboxLabel}>
              I agree to the{' '}
              <Link href="/terms" style={styles.linkInline}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" style={styles.linkInline}>Privacy Policy</Link>
            </label>
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
                Creating Account...
              </span>
            ) : (
              'Create Account & Continue'
            )}
          </button>

          <div style={styles.securePayment}>
            <span style={styles.lockIcon}>🔒</span>
            Secure payment powered by Stripe
          </div>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>
        
        <p style={styles.loginPrompt}>
          Already have an account?{' '}
          <Link href="/login" style={styles.linkText}>
            Login here
          </Link>
        </p>
        
        <div style={styles.disclaimer}>
          <p style={styles.disclaimerTitle}>Risk Disclaimer</p>
          <p style={styles.disclaimerText}>
            Trading cryptocurrency involves substantial risk. Past performance does not guarantee 
            future results. Only trade with money you can afford to lose.
          </p>
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
  
  loginButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    border: '2px solid #5e9eff',
    color: '#5e9eff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'inline-block',
    '&:hover': {
      backgroundColor: '#5e9eff',
      color: '#ffffff',
    }
  },
  
  // Signup Box
  signupBox: {
    backgroundColor: 'rgba(21, 25, 53, 0.9)',
    backdropFilter: 'blur(20px)',
    padding: '3rem',
    borderRadius: '16px',
    border: '1px solid #2a3456',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.6s ease-out',
    position: 'relative',
    zIndex: 1,
  },
  
  signupHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
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
  
  planInfo: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid rgba(100, 255, 218, 0.3)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '2rem',
    textAlign: 'center',
    animation: 'glow 3s ease-in-out infinite',
  },
  
  planBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  
  planLabel: {
    fontSize: '0.875rem',
    color: '#8892b0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  planName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#64ffda',
  },
  
  planPrice: {
    fontSize: '1.125rem',
    color: '#ffffff',
    fontWeight: '600',
  },
  
  planFeatures: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '0.5rem',
  },
  
  featureTag: {
    fontSize: '0.75rem',
    color: '#64ffda',
    padding: '0.25rem 0.75rem',
    background: 'rgba(100, 255, 218, 0.2)',
    borderRadius: '20px',
    animation: 'slideIn 0.5s ease-out',
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
    width: '100%',
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
  
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  
  showPasswordBtn: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#8892b0',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.5rem',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  errorText: {
    color: '#ff5e5e',
    fontSize: '0.75rem',
    marginTop: '-0.25rem',
    fontWeight: '500',
    animation: 'slideIn 0.3s ease-out',
  },
  
  checkboxGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  
  checkbox: {
    marginTop: '0.25rem',
    cursor: 'pointer',
  },
  
  checkboxLabel: {
    fontSize: '0.875rem',
    color: '#8892b0',
    lineHeight: '1.5',
  },
  
  linkInline: {
    color: '#5e9eff',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#64ffda',
      textDecoration: 'underline',
    }
  },
  
  button: {
    padding: '1rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0e27',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.4)',
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
    backgroundColor: '#0a0e27',
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  
  securePayment: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#8892b0',
    marginTop: '0.75rem',
  },
  
  lockIcon: {
    fontSize: '1rem',
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
    backgroundColor: 'rgba(21, 25, 53, 0.9)',
    padding: '0 1rem',
    position: 'relative',
    color: '#8892b0',
    fontSize: '0.875rem',
    fontWeight: '500',
    letterSpacing: '1px',
  },
  
  loginPrompt: {
    textAlign: 'center',
    color: '#8892b0',
    fontSize: '0.875rem',
  },
  
  linkText: {
    color: '#5e9eff',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#64ffda',
      textDecoration: 'underline',
    }
  },
  
  disclaimer: {
    marginTop: '2rem',
    padding: '1rem',
    background: 'rgba(255, 94, 94, 0.05)',
    border: '1px solid rgba(255, 94, 94, 0.2)',
    borderRadius: '8px',
  },
  
  disclaimerTitle: {
    fontSize: '0.75rem',
    color: '#ff5e5e',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.5rem',
  },
  
  disclaimerText: {
    fontSize: '0.75rem',
    color: '#8892b0',
    lineHeight: '1.5',
  }
};