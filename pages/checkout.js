import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import config from '../utils/config';

// Force dynamic rendering to avoid static generation issues
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState('essential');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }
    
    // Get selected plan
    const selectedPlan = localStorage.getItem('selectedPlan') || 'essential';
    setPlan(selectedPlan);
    
    // Check if user already has subscription
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/checkout/subscription-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.hasActiveSubscription) {
        // Already subscribed, go to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan })
      });

      const data = await response.json();
      
      if (response.ok && data.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.sessionUrl;
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changePlan = (newPlan) => {
    setPlan(newPlan);
    localStorage.setItem('selectedPlan', newPlan);
  };

  return (
    <div style={styles.container}>
      <div style={styles.checkoutBox}>
        <h1 style={styles.title}>Complete Your Subscription</h1>
        <p style={styles.subtitle}>Choose your plan to start receiving signals</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.planOptions}>
          <div 
            style={{
              ...styles.planCard,
              ...(plan === 'essential' ? styles.selectedPlan : {})
            }}
            onClick={() => changePlan('essential')}
          >
            <h3 style={styles.planName}>Essential</h3>
            <div style={styles.planPrice}>$99<span>/month</span></div>
            <ul style={styles.features}>
              <li>5-10 daily signals</li>
              <li>Entry & exit alerts</li>
              <li>Basic risk management</li>
            </ul>
          </div>
          
          <div 
            style={{
              ...styles.planCard,
              ...(plan === 'vip' ? styles.selectedPlan : {})
            }}
            onClick={() => changePlan('vip')}
          >
            <span style={styles.recommendedBadge}>RECOMMENDED</span>
            <h3 style={styles.planName}>VIP</h3>
            <div style={styles.planPrice}>$199<span>/month</span></div>
            <ul style={styles.features}>
              <li>ALL trades in real-time</li>
              <li>Detailed analysis</li>
              <li>Position sizing guide</li>
              <li>Direct chat access</li>
            </ul>
          </div>
        </div>
        
        <button 
          onClick={handleCheckout} 
          style={styles.checkoutBtn}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Subscribe to ${plan === 'vip' ? 'VIP' : 'Essential'} Plan`}
        </button>
        
        <p style={styles.secureNote}>
          🔒 Secure payment powered by Stripe
        </p>
        
        <p style={styles.terms}>
          By subscribing, you agree to our terms of service. Cancel anytime.
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
    padding: '2rem'
  },
  checkoutBox: {
    backgroundColor: '#151935',
    padding: '3rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    width: '100%',
    maxWidth: '800px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    color: '#64ffda'
  },
  subtitle: {
    fontSize: '1.125rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#8892b0'
  },
  error: {
    backgroundColor: 'rgba(255, 94, 94, 0.1)',
    border: '1px solid #ff5e5e',
    padding: '0.75rem',
    borderRadius: '6px',
    color: '#ff5e5e',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  planOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  planCard: {
    backgroundColor: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '8px',
    padding: '2rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative'
  },
  selectedPlan: {
    borderColor: '#64ffda',
    transform: 'scale(1.02)'
  },
  recommendedBadge: {
    position: 'absolute',
    top: '-12px',
    right: '20px',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    padding: '0.25rem 1rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  planName: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  planPrice: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: '1rem'
  },
  features: {
    listStyle: 'none',
    padding: 0,
    color: '#8892b0'
  },
  checkoutBtn: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.3s'
  },
  secureNote: {
    textAlign: 'center',
    color: '#8892b0',
    marginTop: '1.5rem',
    fontSize: '0.875rem'
  },
  terms: {
    textAlign: 'center',
    color: '#8892b0',
    marginTop: '0.5rem',
    fontSize: '0.75rem'
  }
};