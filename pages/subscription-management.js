import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import config from '../utils/config';

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function SubscriptionManagementPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Fetch subscription details
    fetchSubscriptionDetails(token);
  }, [router]);

  const fetchSubscriptionDetails = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/subscription/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        setError('Failed to load subscription details');
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Unable to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handlePortalAccess = async () => {
    setPortalLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${config.API_URL}/create-portal-session`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Unable to access billing portal');
      }
    } catch (err) {
      console.error('Error accessing portal:', err);
      setError('Failed to open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/checkout?plan=vip&upgrade=true');
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`${config.API_URL}/subscription/cancel`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert('Subscription cancelled successfully. You will retain access until the end of your billing period.');
          fetchSubscriptionDetails(token);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to cancel subscription');
        }
      } catch (err) {
        console.error('Error cancelling subscription:', err);
        setError('Failed to cancel subscription. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>MoonShot Signals</Link>
          <div style={styles.navLinks}>
            <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link href="/dashboard" style={styles.backButton}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.pageContent}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Subscription Management</h1>
            <p style={styles.subtitle}>Manage your MoonShot Signals subscription</p>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={styles.loadingSection}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading subscription details...</p>
            </div>
          ) : subscription ? (
            <>
              {/* Current Plan */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Current Plan</h2>
                <div style={styles.planCard}>
                  <div style={styles.planHeader}>
                    <div>
                      <span style={styles.planName}>
                        {subscription.plan === 'vip' ? 'VIP' : 'Essential'}
                      </span>
                      <span style={styles.planBadge}>
                        {subscription.status === 'active' ? 'Active' : subscription.status}
                      </span>
                    </div>
                    <span style={styles.planPrice}>
                      ${subscription.plan === 'vip' ? '199' : '99'}/month
                    </span>
                  </div>
                  
                  <div style={styles.planDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Status:</span>
                      <span style={{
                        ...styles.detailValue,
                        color: subscription.status === 'active' ? '#64ffda' : '#ff5e5e'
                      }}>
                        {subscription.status === 'active' ? '✓ Active' : subscription.status}
                      </span>
                    </div>
                    
                    {subscription.current_period_end && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>
                          {subscription.cancel_at_period_end ? 'Access ends:' : 'Next billing date:'}
                        </span>
                        <span style={styles.detailValue}>
                          {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    
                    {subscription.created_at && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Member since:</span>
                        <span style={styles.detailValue}>
                          {new Date(subscription.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {subscription.cancel_at_period_end && (
                    <div style={styles.cancelNotice}>
                      ⚠️ Your subscription is scheduled to cancel on {new Date(subscription.current_period_end).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Features */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Your Benefits</h2>
                <div style={styles.featuresGrid}>
                  {subscription.plan === 'vip' ? (
                    <>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📊</span>
                        <h3 style={styles.featureTitle}>All Trading Signals</h3>
                        <p style={styles.featureDesc}>Real-time access to every trade</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📈</span>
                        <h3 style={styles.featureTitle}>Detailed Analysis</h3>
                        <p style={styles.featureDesc}>In-depth market breakdowns</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>💰</span>
                        <h3 style={styles.featureTitle}>Position Sizing</h3>
                        <p style={styles.featureDesc}>Risk management guidance</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>💬</span>
                        <h3 style={styles.featureTitle}>Direct Chat Support</h3>
                        <p style={styles.featureDesc}>24/7 VIP assistance</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📞</span>
                        <h3 style={styles.featureTitle}>Weekly Calls</h3>
                        <p style={styles.featureDesc}>Strategy sessions with trader</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>⚡</span>
                        <h3 style={styles.featureTitle}>Priority Support</h3>
                        <p style={styles.featureDesc}>Fastest response times</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📊</span>
                        <h3 style={styles.featureTitle}>Daily Signals</h3>
                        <p style={styles.featureDesc}>5-10 high-quality trades</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>🎯</span>
                        <h3 style={styles.featureTitle}>Entry & Exit</h3>
                        <p style={styles.featureDesc}>Clear trade levels</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>🛡️</span>
                        <h3 style={styles.featureTitle}>Risk Management</h3>
                        <p style={styles.featureDesc}>Basic position guidance</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📱</span>
                        <h3 style={styles.featureTitle}>Dashboard Access</h3>
                        <p style={styles.featureDesc}>Real-time interface</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📧</span>
                        <h3 style={styles.featureTitle}>Email Support</h3>
                        <p style={styles.featureDesc}>Help when you need it</p>
                      </div>
                      <div style={styles.featureCard}>
                        <span style={styles.featureIcon}>📈</span>
                        <h3 style={styles.featureTitle}>Performance Tracking</h3>
                        <p style={styles.featureDesc}>Monitor your results</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Manage Your Subscription</h2>
                <div style={styles.actionButtons}>
                  {subscription.plan === 'essential' && !subscription.cancel_at_period_end && (
                    <button 
                      onClick={handleUpgrade}
                      style={styles.upgradeButton}
                    >
                      <span style={styles.buttonIcon}>🚀</span>
                      Upgrade to VIP
                    </button>
                  )}

                  <button 
                    onClick={handlePortalAccess}
                    style={styles.portalButton}
                    disabled={portalLoading}
                  >
                    <span style={styles.buttonIcon}>💳</span>
                    {portalLoading ? 'Opening...' : 'Manage Billing & Payment'}
                  </button>

                  {!subscription.cancel_at_period_end && (
                    <button 
                      onClick={handleCancel}
                      style={styles.cancelButton}
                      disabled={loading}
                    >
                      <span style={styles.buttonIcon}>✕</span>
                      Cancel Subscription
                    </button>
                  )}

                  {subscription.cancel_at_period_end && (
                    <button 
                      onClick={handlePortalAccess}
                      style={styles.reactivateButton}
                    >
                      <span style={styles.buttonIcon}>♻️</span>
                      Reactivate Subscription
                    </button>
                  )}
                </div>
              </div>

              {/* Support Section */}
              <div style={styles.supportSection}>
                <h3 style={styles.supportTitle}>Need Help?</h3>
                <p style={styles.supportText}>
                  Contact our support team at{' '}
                  <a href="mailto:support@getmoonshots.com" style={styles.supportLink}>
                    support@getmoonshots.com
                  </a>
                </p>
              </div>
            </>
          ) : (
            <div style={styles.noSubscription}>
              <span style={styles.noSubIcon}>🔒</span>
              <h2 style={styles.noSubTitle}>No Active Subscription</h2>
              <p style={styles.noSubText}>
                Start receiving profitable trading signals today
              </p>
              <button 
                onClick={() => router.push('/checkout')}
                style={styles.subscribeButton}
              >
                Subscribe Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
  },
  
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
  
  backButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '2px solid #5e9eff',
    borderRadius: '8px',
    color: '#5e9eff',
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontWeight: '600',
    display: 'inline-block',
    '&:hover': {
      backgroundColor: '#5e9eff',
      color: '#ffffff',
    }
  },
  
  pageContent: {
    marginTop: '100px',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)',
  },
  
  container: {
    width: '100%',
    maxWidth: '1000px',
    animation: 'fadeIn 0.6s ease-out',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-1px',
  },
  
  subtitle: {
    color: '#8892b0',
    fontSize: '1.125rem',
  },
  
  section: {
    marginBottom: '3rem',
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#64ffda',
  },
  
  planCard: {
    backgroundColor: '#151935',
    border: '2px solid #2a3456',
    borderRadius: '16px',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #2a3456',
  },
  
  planName: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#64ffda',
    marginRight: '1rem',
  },
  
  planBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  planPrice: {
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: '600',
  },
  
  planDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(42, 52, 86, 0.3)',
  },
  
  detailLabel: {
    color: '#8892b0',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  
  detailValue: {
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  
  cancelNotice: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    color: '#ff5e5e',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  
  featureCard: {
    backgroundColor: '#151935',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'all 0.3s',
    '&:hover': {
      borderColor: '#5e9eff',
      transform: 'translateY(-2px)',
    }
  },
  
  featureIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#ffffff',
  },
  
  featureDesc: {
    fontSize: '0.875rem',
    color: '#8892b0',
  },
  
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  
  buttonIcon: {
    marginRight: '0.5rem',
    fontSize: '1.25rem',
  },
  
  upgradeButton: {
    padding: '1rem 1.5rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.4)',
    }
  },
  
  portalButton: {
    padding: '1rem 1.5rem',
    backgroundColor: '#5e9eff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(94, 158, 255, 0.4)',
    }
  },
  
  cancelButton: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#ff5e5e',
    border: '2px solid #ff5e5e',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: 'rgba(255, 94, 94, 0.1)',
    }
  },
  
  reactivateButton: {
    padding: '1rem 1.5rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingSection: {
    textAlign: 'center',
    padding: '4rem',
    color: '#8892b0',
  },
  
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #2a3456',
    borderTop: '3px solid #64ffda',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    animation: 'spin 1s linear infinite',
  },
  
  errorMessage: {
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    padding: '1rem',
    color: '#ff5e5e',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  
  noSubscription: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#151935',
    borderRadius: '16px',
    border: '1px solid #2a3456',
  },
  
  noSubIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1.5rem',
  },
  
  noSubTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ffffff',
  },
  
  noSubText: {
    color: '#8892b0',
    fontSize: '1.125rem',
    marginBottom: '2rem',
  },
  
  subscribeButton: {
    padding: '1rem 3rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.4)',
    }
  },
  
  supportSection: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#151935',
    borderRadius: '12px',
    border: '1px solid #2a3456',
  },
  
  supportTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#64ffda',
  },
  
  supportText: {
    color: '#8892b0',
    fontSize: '1rem',
  },
  
  supportLink: {
    color: '#5e9eff',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
};