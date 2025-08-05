import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Success() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Clear the selected plan from storage
    localStorage.removeItem('selectedPlan');
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

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
        
        @keyframes scaleIn {
          from { 
            transform: scale(0);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes checkmark {
          0% { 
            stroke-dashoffset: 100;
            opacity: 0;
          }
          100% { 
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        <div style={styles.bgCircle3}></div>
      </div>

      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>MoonShot Signals</Link>
          <div style={styles.navLinks}>
            <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
          </div>
        </div>
      </nav>

      <div style={styles.successBox}>
        {/* Animated Checkmark */}
        <div style={styles.checkmarkWrapper}>
          <div style={styles.checkmarkCircle}>
            <svg style={styles.checkmarkSvg} viewBox="0 0 52 52">
              <circle style={styles.checkmarkCircleBg} cx="26" cy="26" r="25" fill="none"/>
              <path style={styles.checkmarkPath} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <div style={styles.rippleEffect}></div>
        </div>

        <h1 style={styles.title}>Payment Successful!</h1>
        
        <div style={styles.successDetails}>
          <p style={styles.message}>
            Welcome to MoonShot Signals! Your subscription is now active and you&apos;re ready to start receiving profitable trading signals.
          </p>
          
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>📊</span>
              <span style={styles.featureText}>Real-time signals</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>💬</span>
              <span style={styles.featureText}>24/7 support</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>📈</span>
              <span style={styles.featureText}>Performance tracking</span>
            </div>
          </div>
        </div>

        <div style={styles.redirectInfo}>
          Redirecting to dashboard in <span style={styles.countdown}>{countdown}</span> seconds...
        </div>

        <button 
          onClick={() => router.push('/dashboard')}
          style={styles.dashboardBtn}
        >
          Go to Dashboard Now
        </button>

        <div style={styles.helpLinks}>
          <Link href="/help" style={styles.helpLink}>Need help?</Link>
          <span style={styles.separator}>•</span>
          <Link href="/contact" style={styles.helpLink}>Contact support</Link>
        </div>
      </div>

      {/* Confetti Effect (CSS only) */}
      <div style={styles.confettiContainer}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{...styles.confetti, animationDelay: `${i * 0.2}s`}}></div>
        ))}
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
  
  bgCircle3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 214, 100, 0.1) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 12s ease-in-out infinite',
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
  
  // Success Box
  successBox: {
    backgroundColor: 'rgba(21, 25, 53, 0.9)',
    backdropFilter: 'blur(20px)',
    padding: '3rem',
    borderRadius: '16px',
    border: '1px solid #2a3456',
    textAlign: 'center',
    maxWidth: '540px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.6s ease-out',
    position: 'relative',
    zIndex: 1,
  },
  
  // Checkmark Animation
  checkmarkWrapper: {
    position: 'relative',
    marginBottom: '2rem',
    display: 'inline-block',
  },
  
  checkmarkCircle: {
    width: '100px',
    height: '100px',
    position: 'relative',
    display: 'inline-block',
    animation: 'scaleIn 0.6s ease-out',
  },
  
  checkmarkSvg: {
    width: '100px',
    height: '100px',
  },
  
  checkmarkCircleBg: {
    stroke: '#64ffda',
    strokeWidth: '2',
    strokeDasharray: '166',
    strokeDashoffset: '166',
    animation: 'checkmark 0.6s ease-out 0.3s forwards',
  },
  
  checkmarkPath: {
    stroke: '#64ffda',
    strokeWidth: '4',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: '48',
    strokeDashoffset: '48',
    animation: 'checkmark 0.4s ease-out 0.6s forwards',
  },
  
  rippleEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid #64ffda',
    transform: 'translate(-50%, -50%)',
    animation: 'ripple 1.5s ease-out 0.8s',
    opacity: 0,
  },
  
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #64ffda 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-1px',
    animation: 'slideInUp 0.6s ease-out 0.4s both',
  },
  
  successDetails: {
    animation: 'slideInUp 0.6s ease-out 0.6s both',
    marginBottom: '2rem',
  },
  
  message: {
    fontSize: '1.125rem',
    color: '#8892b0',
    marginBottom: '2rem',
    lineHeight: '1.8',
    maxWidth: '420px',
    margin: '0 auto 2rem',
  },
  
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid rgba(100, 255, 218, 0.3)',
    borderRadius: '20px',
    fontSize: '0.875rem',
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  featureIcon: {
    fontSize: '1.125rem',
  },
  
  featureText: {
    color: '#64ffda',
    fontWeight: '500',
  },
  
  redirectInfo: {
    fontSize: '0.875rem',
    color: '#8892b0',
    marginBottom: '2rem',
    animation: 'fadeIn 0.6s ease-out 0.8s both',
  },
  
  countdown: {
    fontSize: '1.125rem',
    color: '#64ffda',
    fontWeight: '700',
    padding: '0 0.5rem',
  },
  
  dashboardBtn: {
    padding: '1rem 3rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0e27',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    animation: 'slideInUp 0.6s ease-out 1s both, glow 3s ease-in-out infinite',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 30px rgba(100, 255, 218, 0.4)',
    }
  },
  
  helpLinks: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    animation: 'fadeIn 0.6s ease-out 1.2s both',
  },
  
  helpLink: {
    color: '#8892b0',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.3s',
    fontWeight: '500',
    '&:hover': {
      color: '#5e9eff',
    }
  },
  
  separator: {
    color: '#5a6378',
    fontSize: '0.875rem',
  },
  
  // Confetti Effect
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 2,
  },
  
  confetti: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: '#64ffda',
    top: '-10px',
    animation: 'confettiFall 3s ease-out forwards',
    opacity: 0,
  },
};