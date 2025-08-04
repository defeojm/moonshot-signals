import { useEffect } from 'react';
import { useRouter } from 'next/router';
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Clear the selected plan from storage
    localStorage.removeItem('selectedPlan');
    
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.successBox}>
        <div style={styles.checkmark}>✓</div>
        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={styles.message}>
          Your subscription is now active. You&apos;ll be redirected to your dashboard in a moment...
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          style={styles.dashboardBtn}
        >
          Go to Dashboard Now
        </button>
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
  successBox: {
    backgroundColor: '#151935',
    padding: '3rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    textAlign: 'center',
    maxWidth: '500px'
  },
  checkmark: {
    fontSize: '4rem',
    color: '#64ffda',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#64ffda'
  },
  message: {
    fontSize: '1.125rem',
    color: '#8892b0',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  dashboardBtn: {
    padding: '0.75rem 2rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.3s'
  }
};