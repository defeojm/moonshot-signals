import { useState } from 'react';
import Link from 'next/link';
import config from '../utils/config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // Remove: const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${config.API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('If an account exists with this email, a password reset link has been sent.');
        setEmail('');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

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
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={styles.links}>
          <Link href="/login" style={styles.link}>
            Back to Login
          </Link>
          <span style={styles.separator}>|</span>
          <Link href="/signup" style={styles.link}>
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
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#8892b0',
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '0.9rem',
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
  links: {
    marginTop: '2rem',
    textAlign: 'center',
    color: '#8892b0',
  },
  link: {
    color: '#5e9eff',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  separator: {
    margin: '0 1rem',
    color: '#2a3456',
  },
};