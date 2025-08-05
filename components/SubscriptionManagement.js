import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import config from '../utils/config';

export default function SubscriptionManagement({ user, token, onClose, isModal = false }) {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const fetchSubscriptionDetails = async () => {
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
          fetchSubscriptionDetails();
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

  const content = (
    <div style={styles.container}>
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
      `}</style>

      <div style={styles.header}>
        <h2 style={styles.title}>Subscription Management</h2>
        {isModal && (
          <button onClick={onClose} style={styles.closeButton}>×</button>
        )}
      </div>

      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading subscription details...</p>
        </div>
      ) : subscription ? (
        <>
          {/* Current Plan */}
          <div style={styles.currentPlan}>
            <h3 style={styles.sectionTitle}>Current Plan</h3>
            <div style={styles.planCard}>
              <div style={styles.planHeader}>
                <span style={styles.planName}>
                  {subscription.plan === 'vip' ? 'VIP' : 'Essential'}
                </span>
                <span style={styles.planPrice}>
                  ${subscription.plan === 'vip' ? '199' : '99'}/month
                </span>
              </div>
              <div style={styles.planStatus}>
                <span style={styles.statusLabel}>Status:</span>
                <span style={{
                  ...styles.statusValue,
                  color: subscription.status === 'active' ? '#64ffda' : '#ff5e5e'
                }}>
                  {subscription.status}
                </span>
              </div>
              {subscription.current_period_end && (
                <div style={styles.nextBilling}>
                  <span style={styles.billingLabel}>
                    {subscription.cancel_at_period_end ? 'Access ends:' : 'Next billing:'}
                  </span>
                  <span style={styles.billingDate}>
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Plan Features */}
          <div style={styles.features}>
            <h3 style={styles.sectionTitle}>Your Benefits</h3>
            <ul style={styles.featuresList}>
              {subscription.plan === 'vip' ? (
                <>
                  <li style={styles.featureItem}>✓ All trading signals in real-time</li>
                  <li style={styles.featureItem}>✓ Detailed analysis for every trade</li>
                  <li style={styles.featureItem}>✓ Position sizing guidance</li>
                  <li style={styles.featureItem}>✓ Direct chat support</li>
                  <li style={styles.featureItem}>✓ Weekly strategy calls</li>
                  <li style={styles.featureItem}>✓ Priority support</li>
                </>
              ) : (
                <>
                  <li style={styles.featureItem}>✓ 5-10 daily signals</li>
                  <li style={styles.featureItem}>✓ Entry & exit alerts</li>
                  <li style={styles.featureItem}>✓ Basic risk management</li>
                  <li style={styles.featureItem}>✓ Dashboard access</li>
                  <li style={styles.featureItem}>✓ Email support</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            {subscription.plan === 'essential' && !subscription.cancel_at_period_end && (
              <button 
                onClick={handleUpgrade}
                style={styles.upgradeButton}
              >
                Upgrade to VIP
              </button>
            )}

            <button 
              onClick={handlePortalAccess}
              style={styles.portalButton}
              disabled={portalLoading}
            >
              {portalLoading ? 'Opening...' : 'Manage Billing & Payment'}
            </button>

            {!subscription.cancel_at_period_end && (
              <button 
                onClick={handleCancel}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancel Subscription
              </button>
            )}

            {subscription.cancel_at_period_end && (
              <div style={styles.cancelNotice}>
                <p style={styles.cancelText}>
                  ⚠️ Your subscription is set to cancel on {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
                <button 
                  onClick={handlePortalAccess}
                  style={styles.reactivateButton}
                >
                  Reactivate Subscription
                </button>
              </div>
            )}
          </div>

          {/* Payment History Link */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Need help? Contact support at{' '}
              <a href="mailto:support@getmoonshots.com" style={styles.supportLink}>
                support@getmoonshots.com
              </a>
            </p>
          </div>
        </>
      ) : (
        <div style={styles.noSubscription}>
          <p>No active subscription found.</p>
          <button 
            onClick={() => router.push('/checkout')}
            style={styles.subscribeButton}
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );

  // If it's a modal, wrap in overlay
  if (isModal) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          {content}
        </div>
      </div>
    );
  }

  // If it's a page, return with navigation
  return (
    <div style={styles.pageContainer}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>MoonShot Signals</Link>
          <div style={styles.navLinks}>
            <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
            <button onClick={() => router.push('/dashboard')} style={styles.backButton}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>
      
      <div style={styles.pageContent}>
        {content}
      </div>
    </div>
  );
}

const styles = {
  // Page wrapper styles
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  },
  
  backButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #5e9eff',
    borderRadius: '6px',
    color: '#5e9eff',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontWeight: '600',
  },
  
  pageContent: {
    marginTop: '80px',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  
  // Modal styles
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  
  modal: {
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: '16px',
    animation: 'fadeIn 0.3s ease-out',
  },
  
  // Main container
  container: {
    backgroundColor: '#151935',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #2a3456',
    width: '100%',
    maxWidth: '600px',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #2a3456',
  },
  
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#8892b0',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#64ffda',
  },
  
  // Current plan section
  currentPlan: {
    marginBottom: '2rem',
  },
  
  planCard: {
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  
  planName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#64ffda',
  },
  
  planPrice: {
    fontSize: '1.25rem',
    color: '#ffffff',
    fontWeight: '600',
  },
  
  planStatus: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  
  statusLabel: {
    color: '#8892b0',
    fontSize: '0.875rem',
  },
  
  statusValue: {
    fontWeight: '600',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
  },
  
  nextBilling: {
    display: 'flex',
    gap: '0.5rem',
  },
  
  billingLabel: {
    color: '#8892b0',
    fontSize: '0.875rem',
  },
  
  billingDate: {
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  
  // Features section
  features: {
    marginBottom: '2rem',
  },
  
  featuresList: {
    listStyle: 'none',
    padding: 0,
  },
  
  featureItem: {
    padding: '0.75rem',
    color: '#8892b0',
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(42, 52, 86, 0.3)',
  },
  
  // Actions section
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  
  upgradeButton: {
    padding: '1rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  
  portalButton: {
    padding: '1rem',
    backgroundColor: '#5e9eff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  
  cancelButton: {
    padding: '1rem',
    backgroundColor: 'transparent',
    color: '#ff5e5e',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  
  reactivateButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  
  cancelNotice: {
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    padding: '1rem',
  },
  
  cancelText: {
    color: '#ff5e5e',
    fontSize: '0.875rem',
    margin: 0,
  },
  
  // Loading and error states
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
    color: '#8892b0',
  },
  
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #2a3456',
    borderTop: '3px solid #64ffda',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'spin 1s linear infinite',
  },
  
  errorMessage: {
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    borderRadius: '8px',
    padding: '1rem',
    color: '#ff5e5e',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  
  noSubscription: {
    textAlign: 'center',
    padding: '2rem',
    color: '#8892b0',
  },
  
  subscribeButton: {
    marginTop: '1rem',
    padding: '1rem 2rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  
  // Footer
  footer: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #2a3456',
  },
  
  footerText: {
    color: '#8892b0',
    fontSize: '0.875rem',
  },
  
  supportLink: {
    color: '#5e9eff',
    textDecoration: 'none',
  },
};