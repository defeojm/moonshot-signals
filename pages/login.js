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
      
      // Use the base URL and add /auth/login (without the extra /api)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || config.API_URL;
      const loginUrl = `${baseUrl}/auth/login`;
      
      console.log('Login URL being used:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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
      <div style={styles.loginBox}>
        <h1 style={styles.title}>MoonShot Signals</h1>
        <h2 style={styles.subtitle}>Login to Your Account</h2>
        
        <form onSubmit={handleLogin} style={styles.form}>
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
          
          <div style={styles.forgotPasswordContainer}>
            <Link href="/forgot-password" style={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.link}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={styles.linkText}>
            Sign up
          </Link>
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
  loginBox: {
    backgroundColor: '#151935',
    padding: '3rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    color: '#64ffda'
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#8892b0'
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
    padding: '0.75rem',
    backgroundColor: '#5e9eff',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
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
  forgotPasswordContainer: {
    textAlign: 'right',
    marginTop: '-0.5rem',
    marginBottom: '1rem',
  },
  forgotPasswordLink: {
    color: '#5e9eff',
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'color 0.3s',
    cursor: 'pointer',
  },
};