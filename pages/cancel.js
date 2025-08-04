import { useRouter } from 'next/router';
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
export default function Cancel() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.cancelBox}>
        <h1 style={styles.title}>Payment Cancelled</h1>
        <p style={styles.message}>
          Your payment was cancelled. No charges were made to your card.
        </p>
        <p style={styles.submessage}>
          You can try again anytime when you're ready to start receiving profitable trading signals.
        </p>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => router.push('/checkout')}
            style={styles.retryBtn}
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/')}
            style={styles.homeBtn}
          >
            Return Home
          </button>
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
    color: '#ffffff'
  },
  cancelBox: {
    backgroundColor: '#151935',
    padding: '3rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    textAlign: 'center',
    maxWidth: '500px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#ff5e5e'
  },
  message: {
    fontSize: '1.125rem',
    color: '#ffffff',
    marginBottom: '1rem'
  },
  submessage: {
    fontSize: '1rem',
    color: '#8892b0',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  retryBtn: {
    padding: '0.75rem 2rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.3s'
  },
  homeBtn: {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }
};