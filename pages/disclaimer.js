import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Disclaimer() {
  const router = useRouter();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>MoonShot Signals</Link>
          <div style={styles.navLinks}>
            <Link href="/" style={styles.navLink}>Home</Link>
            <Link href="/login" style={styles.navLink}>Login</Link>
            <button 
              onClick={() => router.push('/signup')} 
              style={styles.ctaButton}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.headerSection}>
          <h1 style={styles.pageTitle}>Risk Disclaimer</h1>
          <p style={styles.lastUpdated}>Last Updated: August 5, 2025</p>
        </div>

        {/* Critical Warning */}
        <div style={styles.warningBanner}>
          <h2 style={styles.warningTitle}>⚠️ CRITICAL RISK WARNING</h2>
          <p style={styles.warningText}>
            Trading cryptocurrency perpetual futures involves substantial risk of loss and is not suitable for all investors. 
            You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, 
            and financial resources. You may lose all or more than your initial investment.
          </p>
        </div>

        {/* General Disclaimer */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>General Disclaimer</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              MoonShot Signals (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website www.getmoonshots.com and provides 
              cryptocurrency trading signals and educational content. This disclaimer outlines the terms under 
              which we provide our services and the risks associated with using our information.
            </p>
            <p style={styles.paragraph}>
              <strong>By using our services, you acknowledge that you have read, understood, and agree to be 
              bound by this Risk Disclaimer.</strong>
            </p>
          </div>
        </section>

        {/* Not Financial Advice */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Not Financial Advice</h2>
          <div style={styles.sectionContent}>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Our signals, analysis, and content are provided for <strong>informational and educational 
                purposes only</strong> and should not be construed as financial, investment, trading, or 
                other types of advice or recommendations.
              </li>
              <li style={styles.listItem}>
                We are <strong>not</strong> registered investment advisors, broker-dealers, or financial planners.
              </li>
              <li style={styles.listItem}>
                We do not recommend or advise individuals to buy, sell, or hold any cryptocurrency or 
                perpetual futures contracts.
              </li>
              <li style={styles.listItem}>
                Any decision to place trades in the financial markets, including trading in cryptocurrency 
                perpetual futures based on our signals, is a personal decision that should be made after 
                thorough research, including personal financial analysis and engagement with qualified professionals.
              </li>
            </ul>
          </div>
        </section>

        {/* Risk of Trading */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Risks of Cryptocurrency Trading</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              Trading cryptocurrency perpetual futures carries significant risks, including but not limited to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Total Loss of Capital:</strong> You can lose your entire investment and potentially 
                owe additional money when using leverage.
              </li>
              <li style={styles.listItem}>
                <strong>Leverage Risk:</strong> Trading with leverage amplifies both gains and losses. 
                A small market movement can result in proportionately larger losses.
              </li>
              <li style={styles.listItem}>
                <strong>Market Volatility:</strong> Cryptocurrency markets are extremely volatile and can 
                move dramatically in short periods.
              </li>
              <li style={styles.listItem}>
                <strong>Liquidity Risk:</strong> Markets may lack sufficient liquidity, resulting in 
                slippage or inability to exit positions.
              </li>
              <li style={styles.listItem}>
                <strong>Technical Risk:</strong> Trading platforms may experience outages, hacks, or 
                technical failures that prevent order execution.
              </li>
              <li style={styles.listItem}>
                <strong>Regulatory Risk:</strong> Cryptocurrency regulations can change rapidly and may 
                affect your ability to trade.
              </li>
            </ul>
          </div>
        </section>

        {/* No Guarantees */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>No Guarantees or Warranties</h2>
          <div style={styles.sectionContent}>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                We make <strong>no guarantees</strong> about the accuracy, completeness, timeliness, or 
                reliability of any information provided.
              </li>
              <li style={styles.listItem}>
                <strong>Past performance is not indicative of future results.</strong> Any historical 
                returns, expected returns, or probability projections may not reflect actual future performance.
              </li>
              <li style={styles.listItem}>
                We do not guarantee any specific outcome or profit from using our signals or information.
              </li>
              <li style={styles.listItem}>
                Win rates, profit figures, and other performance metrics are historical and may not be 
                replicated in the future.
              </li>
            </ul>
          </div>
        </section>

        {/* User Responsibility */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Your Responsibility</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>As a user of our services, you acknowledge and agree that:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                You are <strong>solely responsible</strong> for any investment decisions you make.
              </li>
              <li style={styles.listItem}>
                You will conduct your own research and due diligence before making any trades.
              </li>
              <li style={styles.listItem}>
                You understand the risks involved in cryptocurrency trading and can afford to lose your 
                entire investment.
              </li>
              <li style={styles.listItem}>
                You will not hold MoonShot Signals liable for any losses incurred from using our information.
              </li>
              <li style={styles.listItem}>
                You are responsible for complying with all applicable laws and regulations in your jurisdiction.
              </li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Limitation of Liability</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              To the maximum extent permitted by law, MoonShot Signals, its owners, operators, employees, 
              and affiliates shall not be liable for:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Any direct, indirect, incidental, special, consequential, or punitive damages
              </li>
              <li style={styles.listItem}>
                Any loss of profits, revenue, or data
              </li>
              <li style={styles.listItem}>
                Any trading losses incurred from using our signals or information
              </li>
              <li style={styles.listItem}>
                Any damages arising from your use or inability to use our services
              </li>
              <li style={styles.listItem}>
                Any damages resulting from errors, omissions, interruptions, delays, or inaccuracies in our content
              </li>
            </ul>
          </div>
        </section>

        {/* Indemnification */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Indemnification</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              You agree to indemnify, defend, and hold harmless MoonShot Signals and its officers, directors, 
              employees, agents, and affiliates from and against any claims, liabilities, damages, losses, 
              and expenses, including reasonable attorney&apos;s fees, arising out of or in any way connected with 
              your access to or use of our services or your violation of these terms.
            </p>
          </div>
        </section>

        {/* No Professional Relationship */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>No Professional Relationship</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              Using our services does not create any fiduciary duty, advisory, or professional service 
              relationship between you and MoonShot Signals. We are an educational and informational 
              service only.
            </p>
          </div>
        </section>

        {/* Specific Disclaimers */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Specific Disclaimers</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>Signal Timing</h3>
            <p style={styles.paragraph}>
              Trading signals are time-sensitive. Delays in receiving, reading, or acting upon signals may 
              result in losses. We are not responsible for any delays in signal delivery or your execution.
            </p>

            <h3 style={styles.subheading}>Third-Party Platforms</h3>
            <p style={styles.paragraph}>
              We are not affiliated with any cryptocurrency exchange or trading platform. We are not 
              responsible for any issues, losses, or damages arising from your use of third-party platforms.
            </p>

            <h3 style={styles.subheading}>Market Manipulation</h3>
            <p style={styles.paragraph}>
              Cryptocurrency markets may be subject to manipulation. We cannot predict or prevent market 
              manipulation that may affect our signals&apos; performance.
            </p>
          </div>
        </section>

        {/* Testimonials Disclaimer */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Testimonials and Case Studies</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              Any testimonials or examples of trading results on our website are not typical and do not 
              guarantee future performance or success. Individual results will vary based on market conditions, 
              experience level, and other factors.
            </p>
          </div>
        </section>

        {/* Contact and Complaints */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Questions and Complaints</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              If you have any questions about this Risk Disclaimer or wish to file a complaint, please contact us at:
            </p>
            <div style={styles.contactInfo}>
              <p>Email: legal@getmoonshots.com</p>
              <p>Website: www.getmoonshots.com/contact</p>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Acceptance of Terms</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              By using MoonShot Signals&apos; services, you acknowledge that you have read, understood, and agree 
              to this Risk Disclaimer. If you do not agree with these terms, you should not use our services.
            </p>
            <p style={styles.paragraph}>
              We reserve the right to modify this disclaimer at any time. Continued use of our services 
              after any changes constitutes acceptance of the modified terms.
            </p>
          </div>
        </section>

        {/* Final Warning */}
        <div style={styles.finalWarning}>
          <p style={styles.finalWarningText}>
            <strong>FINAL WARNING:</strong> Only trade with money you can afford to lose. Cryptocurrency 
            perpetual futures trading is extremely risky and may not be suitable for your financial situation. 
            Seek independent financial advice if you have any doubts.
          </p>
        </div>

        {/* Footer Links */}
        <div style={styles.footerLinks}>
          <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
          <span style={styles.separator}>•</span>
          <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          <span style={styles.separator}>•</span>
          <Link href="/" style={styles.footerLink}>Home</Link>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
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
    color: '#64ffda',
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
  },
  ctaButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  mainContainer: {
    maxWidth: '900px',
    margin: '120px auto 4rem',
    padding: '0 2rem',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  pageTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #5e9eff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  lastUpdated: {
    color: '#8892b0',
    fontSize: '0.875rem',
  },
  warningBanner: {
    background: 'rgba(255, 94, 94, 0.1)',
    border: '2px solid #ff5e5e',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  warningTitle: {
    color: '#ff5e5e',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  warningText: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
  },
  contentSection: {
    background: '#151935',
    border: '1px solid #2a3456',
    borderRadius: '12px',
    padding: '2.5rem',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#64ffda',
  },
  sectionContent: {
    lineHeight: '1.8',
  },
  paragraph: {
    marginBottom: '1rem',
    color: '#e6e6e6',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '1rem',
    paddingLeft: '2rem',
    position: 'relative',
    color: '#e6e6e6',
  },
  subheading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginTop: '2rem',
    marginBottom: '1rem',
    color: '#5e9eff',
  },
  contactInfo: {
    background: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '1rem',
  },
  finalWarning: {
    background: 'rgba(255, 214, 100, 0.1)',
    border: '2px solid #ffd464',
    borderRadius: '12px',
    padding: '2rem',
    marginTop: '3rem',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  finalWarningText: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: '#ffd464',
  },
  footerLinks: {
    textAlign: 'center',
    padding: '2rem 0',
  },
  footerLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s',
    padding: '0 1rem',
  },
  separator: {
    color: '#8892b0',
    margin: '0 0.5rem',
  },
};