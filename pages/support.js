import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Support() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${config.API_URL}/support/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            subject,
            message
        }),
        });

        const data = await response.json();

        if (response.ok) {
        setSuccess(true);
        // Clear form
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            setSuccess(false);
        }, 5000);
        } else {
        setError(data.error || 'Failed to send message. Please try again.');
        }
    } catch (err) {
        setError('Failed to send message. Please try again.');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Background Elements */}
      <div style={styles.bgElements}>
        <div style={styles.bgCircle1}></div>
        <div style={styles.bgCircle2}></div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>MoonShot Signals</Link>
          <div style={styles.navLinks}>
            <Link href="/" style={styles.navLink}>Home</Link>
            <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link href="/login" style={styles.navLink}>Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.mainSection}>
          <h1 style={styles.title}>Contact Support</h1>
          <p style={styles.subtitle}>We&apos;re here to help! Send us a message and we&apos;ll get back to you within 24 hours.</p>

          {success && (
            <div style={styles.successMessage}>
              <span style={styles.successIcon}>✓</span>
              Your message has been sent successfully! We&apos;ll get back to you soon.
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Select a topic</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="account">Account Help</option>
                <option value="signals">Trading Signals</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.textarea}
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading ? styles.buttonDisabled : {})
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.buttonContent}>
                  <span style={styles.loadingDot}></span>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Quick Help Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.helpCard}>
            <h3 style={styles.helpTitle}>Quick Help</h3>
            
            <div style={styles.helpSection}>
              <h4 style={styles.helpSubtitle}>Common Questions</h4>
              <Link href="/faq" style={styles.helpLink}>→ How do I reset my password?</Link>
              <Link href="/faq" style={styles.helpLink}>→ How do I cancel my subscription?</Link>
              <Link href="/faq" style={styles.helpLink}>→ How do trading signals work?</Link>
              <Link href="/faq" style={styles.helpLink}>→ What payment methods do you accept?</Link>
            </div>

            <div style={styles.helpSection}>
              <h4 style={styles.helpSubtitle}>Contact Info</h4>
              <p style={styles.contactInfo}>
                <strong>Email:</strong><br />
                support@moonshotsignals.com
              </p>
              <p style={styles.contactInfo}>
                <strong>Response Time:</strong><br />
                Usually within 24 hours
              </p>
            </div>

            <div style={styles.helpSection}>
              <h4 style={styles.helpSubtitle}>Emergency?</h4>
              <p style={styles.helpText}>
                For urgent trading issues, please use the live chat in your dashboard for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>&copy; 2025 MoonShot Signals. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <Link href="/terms" style={styles.footerLink}>Terms</Link>
            <span style={styles.separator}>•</span>
            <Link href="/privacy" style={styles.footerLink}>Privacy</Link>
            <span style={styles.separator}>•</span>
            <Link href="/disclaimer" style={styles.footerLink}>Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Background elements
  bgElements: {
    position: 'fixed',
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
    position: 'relative',
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a3456',
    zIndex: 10,
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
  
  // Content
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '3rem',
    position: 'relative',
    zIndex: 1,
  },
  
  mainSection: {
    animation: 'fadeIn 0.6s ease-out',
  },
  
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    letterSpacing: '-1px',
  },
  
  subtitle: {
    fontSize: '1.25rem',
    color: '#8892b0',
    marginBottom: '3rem',
  },
  
  // Form
  form: {
    background: 'rgba(21, 25, 53, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '2rem',
  },
  
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
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
  
  select: {
    background: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  
  textarea: {
    background: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: '#5e9eff',
      backgroundColor: '#1e2444',
    },
    '&::placeholder': {
      color: '#5a6378',
    }
  },
  
  submitButton: {
    background: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
    width: '100%',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.4)',
    }
  },
  
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
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
  
  // Messages
  successMessage: {
    background: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid #64ffda',
    borderRadius: '8px',
    padding: '1rem',
    color: '#64ffda',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    animation: 'slideIn 0.3s ease-out',
  },
  
  successIcon: {
    fontSize: '1.25rem',
  },
  
  errorMessage: {
    background: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    padding: '1rem',
    color: '#ff5e5e',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  // Sidebar
  sidebar: {
    animation: 'fadeIn 0.8s ease-out',
  },
  
  helpCard: {
    background: 'rgba(21, 25, 53, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '2rem',
    position: 'sticky',
    top: '2rem',
  },
  
  helpTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#64ffda',
  },
  
  helpSection: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #2a3456',
  },
  
  helpSection: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #2a3456',
    '&:last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    }
  },
  
  helpSubtitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ffffff',
  },
  
  helpLink: {
    display: 'block',
    color: '#8892b0',
    textDecoration: 'none',
    marginBottom: '0.75rem',
    transition: 'color 0.3s',
    fontSize: '0.875rem',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  contactInfo: {
    fontSize: '0.875rem',
    color: '#8892b0',
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  
  helpText: {
    fontSize: '0.875rem',
    color: '#8892b0',
    lineHeight: '1.6',
  },
  
  // Footer
  footer: {
    borderTop: '1px solid #2a3456',
    padding: '2rem',
    marginTop: '4rem',
    position: 'relative',
    zIndex: 1,
  },
  
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#8892b0',
    fontSize: '0.875rem',
  },
  
  footerLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  
  footerLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  separator: {
    color: '#5a6378',
  },
  
  // Responsive
  '@media (max-width: 768px)': {
    content: {
      gridTemplateColumns: '1fr',
    },
    sidebar: {
      display: 'none',
    },
    formRow: {
      gridTemplateColumns: '1fr',
    }
  }
};