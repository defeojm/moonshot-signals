import { useRouter } from 'next/router';
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logo}>MoonShot Signals</div>
          <div style={styles.navLinks}>
            <a href="#proof" style={styles.navLink}>Live Results</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#how-it-works" style={styles.navLink}>How It Works</a>
            <a href="#faq" style={styles.navLink}>FAQ</a>
            <button onClick={() => router.push('/login')} style={styles.loginButton}>
              Member Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>🔥 Limited to 25 Members</div>
        <h1 style={styles.heroTitle}>
          Trade Like a Pro<br />With 90.8% Win Rate
        </h1>
        <p style={styles.heroSubtitle}>
          Real-time crypto perpetual signals from a verified profitable trader. No theory, just proven results.
        </p>
        
        <div style={styles.heroCta}>
          <button onClick={() => router.push('/signup')} style={styles.ctaPrimary}>
            Get Instant Access
          </button>
          <a href="#proof" style={styles.ctaSecondary}>
            View Live Results
          </a>
        </div>
        
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>90.8%</div>
            <div style={styles.statLabel}>Win Rate</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>$153K</div>
            <div style={styles.statLabel}>Q2 Profit</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>5,561</div>
            <div style={styles.statLabel}>Verified Trades</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>5.221</div>
            <div style={styles.statLabel}>Sharpe Ratio</div>
          </div>
        </div>
      </section>

      {/* Live Proof Section */}
      <section id="proof" style={styles.proofSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Today&apos;s Live Results</h2>
          <p style={styles.sectionSubtitle}>Every trade, win or loss, posted in real-time</p>
          
          <div style={styles.tradesGrid}>
            <div style={styles.tradeResult}>
              <div style={styles.tradeResultHeader}>
                <div style={styles.tradePairBadge}>
                  <span style={styles.tradeLong}>LONG</span>
                  <span>BTC-USDT</span>
                </div>
                <span style={styles.tradeProfit}>+$2,847</span>
              </div>
              <div style={styles.tradeDetails}>
                Entry: $65,450 → Exit: $66,320<br />
                Duration: 2h 15m<br />
                Risk/Reward: 1:2.8
              </div>
            </div>
            
            <div style={styles.tradeResult}>
              <div style={styles.tradeResultHeader}>
                <div style={styles.tradePairBadge}>
                  <span style={styles.tradeShort}>SHORT</span>
                  <span>ETH-USDT</span>
                </div>
                <span style={styles.tradeProfit}>+$1,600</span>
              </div>
              <div style={styles.tradeDetails}>
                Entry: $3,420 → Exit: $3,380<br />
                Duration: 45m<br />
                Risk/Reward: 1:3.2
              </div>
            </div>
            
            <div style={styles.tradeResult}>
              <div style={styles.tradeResultHeader}>
                <div style={styles.tradePairBadge}>
                  <span style={styles.tradeLong}>LONG</span>
                  <span>SOL-USDT</span>
                </div>
                <span style={styles.tradeProfit}>+$920</span>
              </div>
              <div style={styles.tradeDetails}>
                Entry: $142.50 → Exit: $144.80<br />
                Duration: 1h 30m<br />
                Risk/Reward: 1:2.1
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={styles.howItWorks}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Start receiving profitable signals in minutes</p>
          
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Join VIP</h3>
              <p style={styles.stepDescription}>
                Choose your plan and get instant access to our private dashboard
              </p>
            </div>
            
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Receive Signals</h3>
              <p style={styles.stepDescription}>
                Get real-time alerts with entry, stop loss, and take profit levels
              </p>
            </div>
            
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Copy & Trade</h3>
              <p style={styles.stepDescription}>
                Execute trades on OKX with one-click copy functionality
              </p>
            </div>
            
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>4</div>
              <h3 style={styles.stepTitle}>Track Results</h3>
              <p style={styles.stepDescription}>
                Monitor your performance with our real-time dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricingSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p style={styles.sectionSubtitle}>No hidden fees. Cancel anytime.</p>
          
          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard}>
              <h3 style={styles.planName}>Essential</h3>
              <div style={styles.planPrice}>$99<span>/month</span></div>
              <ul style={styles.pricingFeatures}>
                <li>✓ 5-10 daily signals</li>
                <li>✓ Entry & exit alerts</li>
                <li>✓ Basic risk management</li>
                <li>✓ Dashboard access</li>
                <li>✓ Email support</li>
              </ul>
              <button 
                onClick={() => router.push('/signup?plan=essential')} 
                style={styles.pricingCta}
              >
                Start Trading
              </button>
            </div>
            
            <div style={{...styles.pricingCard, ...styles.featured}}>
              <span style={styles.pricingBadge}>MOST POPULAR</span>
              <h3 style={styles.planName}>VIP</h3>
              <div style={styles.planPrice}>$199<span>/month</span></div>
              <ul style={styles.pricingFeatures}>
                <li>✓ ALL trades in real-time</li>
                <li>✓ Detailed analysis</li>
                <li>✓ Position sizing guide</li>
                <li>✓ Direct chat access</li>
                <li>✓ Weekly strategy calls</li>
                <li>✓ Priority support</li>
              </ul>
              <button 
                onClick={() => router.push('/signup?plan=vip')} 
                style={styles.pricingCtaFeatured}
              >
                Get VIP Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={styles.faqSection}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        
        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>What exchanges do you trade on?</h3>
          <p style={styles.faqAnswer}>
            I exclusively trade perpetual futures on OKX. All signals are optimized for OKX&apos;s platform, 
            but can be executed on other exchanges offering BTC, ETH, and SOL perpetuals.
          </p>
        </div>
        
        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>How many signals do you send daily?</h3>
          <p style={styles.faqAnswer}>
            I average 10-20 trades per day during my trading window (6AM-12PM EST). Essential members 
            receive 5-10 of the highest probability setups, while VIP members get every single trade I take.
          </p>
        </div>
        
        <div style={styles.faqItem}>
          <h3 style={styles.faqQuestion}>Is your 90.8% win rate real?</h3>
          <p style={styles.faqAnswer}>
            Yes, verified across 5,561 trades in Q2 2025. However, my average loss is 3.6x my average win, 
            meaning risk management is critical. I provide exact position sizing guidelines to all members.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Trade with Confidence?</h2>
        <p style={styles.ctaSubtitle}>Join 23 profitable traders already copying my signals</p>
        <button onClick={() => router.push('/signup')} style={styles.ctaPrimary}>
          Start Your 7-Day Trial
        </button>
        <p style={styles.ctaNote}>Limited to 25 members total • 2 spots remaining</p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 MoonShot Signals. Trading involves risk. Past performance doesn&apos;t guarantee future results.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff'
  },
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a3456',
    zIndex: 1000
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#64ffda'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  navLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s'
  },
  loginButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #5e9eff',
    borderRadius: '6px',
    color: '#5e9eff',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  hero: {
    marginTop: '80px',
    padding: '6rem 2rem',
    textAlign: 'center'
  },
  heroBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid #64ffda',
    borderRadius: '20px',
    color: '#64ffda',
    fontSize: '0.875rem',
    marginBottom: '2rem'
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#8892b0',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem'
  },
  heroCta: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '4rem'
  },
  ctaPrimary: {
    padding: '1rem 2.5rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'transform 0.3s'
  },
  ctaSecondary: {
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a3456',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1.125rem',
    display: 'flex',
    alignItems: 'center'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#64ffda',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#8892b0',
    fontSize: '1rem'
  },
  proofSection: {
    padding: '4rem 2rem',
    backgroundColor: '#151935',
    borderTop: '1px solid #2a3456',
    borderBottom: '1px solid #2a3456'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  sectionSubtitle: {
    color: '#8892b0',
    fontSize: '1.125rem',
    textAlign: 'center',
    marginBottom: '3rem'
  },
  tradesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  tradeResult: {
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '8px',
    padding: '1.5rem',
    transition: 'transform 0.3s'
  },
  tradeResultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  tradePairBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  tradeLong: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda'
  },
  tradeShort: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e'
  },
  tradeProfit: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#64ffda'
  },
  tradeDetails: {
    color: '#8892b0',
    fontSize: '0.875rem',
    lineHeight: '1.6'
  },
  howItWorks: {
    padding: '4rem 2rem',
    backgroundColor: '#151935'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  stepCard: {
    textAlign: 'center'
  },
  stepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    backgroundColor: '#1e2444',
    border: '2px solid #5e9eff',
    borderRadius: '50%',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#5e9eff'
  },
  stepTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem'
  },
  stepDescription: {
    color: '#8892b0',
    fontSize: '0.875rem'
  },
  pricingSection: {
    padding: '6rem 2rem'
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  pricingCard: {
    backgroundColor: '#151935',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '2rem',
    position: 'relative'
  },
  featured: {
    borderColor: '#64ffda',
    transform: 'scale(1.05)'
  },
  pricingBadge: {
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
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  planPrice: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#64ffda',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  pricingFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '2rem 0'
  },
  pricingCta: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#5e9eff',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  pricingCtaFeatured: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  faqSection: {
    padding: '4rem 2rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  faqItem: {
    backgroundColor: '#151935',
    border: '1px solid #2a3456',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  faqQuestion: {
    marginBottom: '0.75rem',
    fontSize: '1.125rem'
  },
  faqAnswer: {
    color: '#8892b0',
    lineHeight: '1.6'
  },
  ctaSection: {
    padding: '6rem 2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #151935 0%, #0a0e27 100%)'
  },
  ctaTitle: {
    fontSize: '3rem',
    marginBottom: '1.5rem'
  },
  ctaSubtitle: {
    fontSize: '1.25rem',
    color: '#8892b0',
    marginBottom: '2rem'
  },
  ctaNote: {
   fontSize: '0.875rem',
   marginTop: '1rem',
   color: '#8892b0'
 },
 footer: {
   padding: '3rem 2rem',
   backgroundColor: '#151935',
   borderTop: '1px solid #2a3456',
   textAlign: 'center',
   color: '#8892b0'
 }
};