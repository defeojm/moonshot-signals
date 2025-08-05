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
      <div style={styles.signupBox}>
        <h1 style={styles.title}>MoonShot Signals</h1>
        <h2 style={styles.subtitle}>Create Your Account</h2>
        
        <div style={styles.planInfo}>
          Selected Plan: <strong>{plan === 'vip' ? 'VIP ($199/mo)' : 'Essential ($99/mo)'}</strong>
        </div>
        
        <form onSubmit={handleSignup} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account & Continue to Payment'}
          </button>
        </form>
        
        <p style={styles.link}>
          Already have an account?{' '}
          <Link href="/login" style={styles.linkText}>
            Login
          </Link>
        </p>
        
        <p style={styles.disclaimer}>
          By creating an account, you agree to our Terms of Service and acknowledge 
          that trading involves risk.
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
    color: '#ffffff'
  },
  signupBox: {
    backgroundColor: '#151935',
    padding: '3rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    width: '100%',
    maxWidth: '450px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    color: '#64ffda'
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#8892b0'
  },
  planInfo: {
    backgroundColor: '#1e2444',
    padding: '1rem',
    borderRadius: '6px',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#64ffda'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem'
  },
  button: {
    padding: '1rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  error: {
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    padding: '0.75rem',
    borderRadius: '6px',
    color: '#ff5e5e',
    textAlign: 'center'
  },
  link: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#8892b0'
  },
  linkText: {
    color: '#5e9eff',
    textDecoration: 'none'
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: '#8892b0',
    textAlign: 'center',
    marginTop: '2rem',
    lineHeight: '1.4'
  }
};