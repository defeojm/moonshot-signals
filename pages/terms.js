import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Terms() {
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
          <h1 style={styles.pageTitle}>Terms of Service</h1>
          <p style={styles.lastUpdated}>Effective Date: August 5, 2025</p>
        </div>

        {/* Introduction */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>1. Agreement to Terms</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and 
              MoonShot Signals (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) concerning your access to and use of 
              the www.getmoonshots.com website and any related services (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p style={styles.paragraph}>
              By accessing or using our Services, you agree to be bound by these Terms. If you disagree 
              with any part of these terms, then you may not access the Services.
            </p>
          </div>
        </section>

        {/* Eligibility */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>2. Eligibility</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              To use our Services, you must:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Be at least 18 years of age or the legal age of majority in your jurisdiction
              </li>
              <li style={styles.listItem}>
                Have the legal capacity to enter into a binding agreement
              </li>
              <li style={styles.listItem}>
                Not be barred from using the Services under applicable law
              </li>
              <li style={styles.listItem}>
                Reside in a jurisdiction where cryptocurrency trading is legal
              </li>
            </ul>
          </div>
        </section>

        {/* Account Registration */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>3. Account Registration</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              To access certain features, you must register for an account. When registering, you agree to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Provide accurate, current, and complete information
              </li>
              <li style={styles.listItem}>
                Maintain and promptly update your account information
              </li>
              <li style={styles.listItem}>
                Maintain the security of your password and account
              </li>
              <li style={styles.listItem}>
                Accept responsibility for all activities under your account
              </li>
              <li style={styles.listItem}>
                Immediately notify us of any unauthorized use of your account
              </li>
            </ul>
            <p style={styles.paragraph}>
              We reserve the right to refuse service, terminate accounts, or remove content at our 
              sole discretion.
            </p>
          </div>
        </section>

        {/* Services Description */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>4. Description of Services</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              MoonShot Signals provides:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Cryptocurrency trading signals for educational and informational purposes
              </li>
              <li style={styles.listItem}>
                Market analysis and commentary
              </li>
              <li style={styles.listItem}>
                Access to a member dashboard with real-time updates
              </li>
              <li style={styles.listItem}>
                Educational content about trading strategies
              </li>
            </ul>
            <p style={styles.paragraph}>
              <strong>Our Services are for informational purposes only and do not constitute financial advice.</strong>
            </p>
          </div>
        </section>

        {/* Subscription and Billing */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>5. Subscription and Billing</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>5.1 Subscription Plans</h3>
            <p style={styles.paragraph}>
              We offer monthly subscription plans. By subscribing, you agree to pay the applicable fees 
              for your chosen plan.
            </p>

            <h3 style={styles.subheading}>5.2 Automatic Renewal</h3>
            <p style={styles.paragraph}>
              Subscriptions automatically renew unless cancelled before the renewal date. You authorize 
              us to charge your payment method on file for the renewal fee.
            </p>

            <h3 style={styles.subheading}>5.3 Cancellation</h3>
            <p style={styles.paragraph}>
              You may cancel your subscription at any time through your account dashboard. Cancellations 
              take effect at the end of the current billing period.
            </p>

            <h3 style={styles.subheading}>5.4 Refunds</h3>
            <p style={styles.paragraph}>
              All payments are non-refundable except as required by law or as explicitly stated in 
              these Terms.
            </p>

            <h3 style={styles.subheading}>5.5 Price Changes</h3>
            <p style={styles.paragraph}>
              We reserve the right to modify pricing with 30 days&apos; notice. Price changes will apply 
              to subsequent billing periods.
            </p>
          </div>
        </section>

        {/* User Conduct */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>6. User Conduct and Prohibited Uses</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              You agree not to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Share, distribute, or resell our signals or content to third parties
              </li>
              <li style={styles.listItem}>
                Use our Services for any illegal or unauthorized purpose
              </li>
              <li style={styles.listItem}>
                Attempt to gain unauthorized access to our systems
              </li>
              <li style={styles.listItem}>
                Interfere with or disrupt the Services or servers
              </li>
              <li style={styles.listItem}>
                Impersonate any person or entity
              </li>
              <li style={styles.listItem}>
                Use automated systems or software to extract data from the Services
              </li>
              <li style={styles.listItem}>
                Reverse engineer any aspect of the Services
              </li>
              <li style={styles.listItem}>
                Violate any applicable laws or regulations
              </li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>7. Intellectual Property Rights</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>7.1 Our Content</h3>
            <p style={styles.paragraph}>
              All content on our Services, including text, graphics, logos, signals, analysis, and 
              software, is the property of MoonShot Signals or its licensors and is protected by 
              intellectual property laws.
            </p>

            <h3 style={styles.subheading}>7.2 Limited License</h3>
            <p style={styles.paragraph}>
              We grant you a limited, non-exclusive, non-transferable license to access and use our 
              Services for personal, non-commercial purposes in accordance with these Terms.
            </p>

            <h3 style={styles.subheading}>7.3 Restrictions</h3>
            <p style={styles.paragraph}>
              You may not copy, modify, distribute, sell, or lease any part of our Services or content 
              without our express written permission.
            </p>
          </div>
        </section>

        {/* Disclaimers */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>8. Disclaimers</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, 
              EXPRESS OR IMPLIED.
            </p>
            <p style={styles.paragraph}>
              We specifically disclaim:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Any warranties of merchantability, fitness for a particular purpose, or non-infringement
              </li>
              <li style={styles.listItem}>
                That the Services will be uninterrupted, secure, or error-free
              </li>
              <li style={styles.listItem}>
                The accuracy, reliability, or completeness of any content
              </li>
              <li style={styles.listItem}>
                Any responsibility for trading losses or missed opportunities
              </li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>9. Limitation of Liability</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOONSHOT SIGNALS SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS 
              OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, 
              OR OTHER INTANGIBLE LOSSES.
            </p>
            <p style={styles.paragraph}>
              Our total liability to you for any claims arising from or related to these Terms or the 
              Services shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </div>
        </section>

        {/* Indemnification */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>10. Indemnification</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              You agree to indemnify, defend, and hold harmless MoonShot Signals, its officers, 
              directors, employees, and agents from any claims, damages, losses, liabilities, and 
              expenses (including attorney&apos;s fees) arising from:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Your use of the Services</li>
              <li style={styles.listItem}>Your violation of these Terms</li>
              <li style={styles.listItem}>Your violation of any rights of another party</li>
              <li style={styles.listItem}>Your trading activities</li>
            </ul>
          </div>
        </section>

        {/* Termination */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>11. Termination</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We may terminate or suspend your account and access to the Services immediately, without 
              prior notice or liability, for any reason, including:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Breach of these Terms</li>
              <li style={styles.listItem}>Non-payment of fees</li>
              <li style={styles.listItem}>Fraudulent or illegal activity</li>
              <li style={styles.listItem}>At our sole discretion</li>
            </ul>
            <p style={styles.paragraph}>
              Upon termination, your right to use the Services will immediately cease.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>12. Governing Law and Dispute Resolution</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>12.1 Governing Law</h3>
            <p style={styles.paragraph}>
              These Terms shall be governed by and construed in accordance with the laws of the United 
              States and the State of Delaware, without regard to conflict of law principles.
            </p>

            <h3 style={styles.subheading}>12.2 Arbitration</h3>
            <p style={styles.paragraph}>
              Any dispute arising from these Terms shall be resolved through binding arbitration in 
              accordance with the American Arbitration Association&apos;s rules.
            </p>

            <h3 style={styles.subheading}>12.3 Class Action Waiver</h3>
            <p style={styles.paragraph}>
              You agree to resolve disputes on an individual basis and waive any right to participate 
              in a class action.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>13. Changes to Terms</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We reserve the right to modify these Terms at any time. We will notify you of material 
              changes by posting the new Terms on this page and updating the &ldquo;Effective Date.&rdquo;
            </p>
            <p style={styles.paragraph}>
              Your continued use of the Services after changes become effective constitutes acceptance 
              of the revised Terms.
            </p>
          </div>
        </section>

        {/* General Provisions */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>14. General Provisions</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>14.1 Entire Agreement</h3>
            <p style={styles.paragraph}>
              These Terms constitute the entire agreement between you and MoonShot Signals regarding 
              the Services.
            </p>

            <h3 style={styles.subheading}>14.2 Severability</h3>
            <p style={styles.paragraph}>
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will continue in effect.
            </p>

            <h3 style={styles.subheading}>14.3 Waiver</h3>
            <p style={styles.paragraph}>
              Our failure to enforce any right or provision shall not be considered a waiver of such 
              right or provision.
            </p>

            <h3 style={styles.subheading}>14.4 Assignment</h3>
            <p style={styles.paragraph}>
              You may not assign or transfer these Terms. We may assign our rights and obligations 
              without restriction.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>15. Contact Information</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div style={styles.contactInfo}>
              <p>MoonShot Signals</p>
              <p>Email: support@getmoonshots.com</p>
              <p>Website: www.getmoonshots.com/contact</p>
            </div>
          </div>
        </section>

        {/* Acknowledgment */}
        <div style={styles.acknowledgment}>
          <p style={styles.acknowledgmentText}>
            By using MoonShot Signals, you acknowledge that you have read, understood, and agree to 
            be bound by these Terms of Service.
          </p>
        </div>

        {/* Footer Links */}
        <div style={styles.footerLinks}>
          <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          <span style={styles.separator}>•</span>
          <Link href="/disclaimer" style={styles.footerLink}>Risk Disclaimer</Link>
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
    marginBottom: '1rem',
  },
  listItem: {
    marginBottom: '0.75rem',
    paddingLeft: '2rem',
    position: 'relative',
    color: '#e6e6e6',
    '&::before': {
      content: '"•"',
      position: 'absolute',
      left: '0.5rem',
      color: '#64ffda',
    }
  },
  subheading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginTop: '1.5rem',
    marginBottom: '1rem',
    color: '#5e9eff',
  },
  contactInfo: {
    background: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '1rem',
  },
  acknowledgment: {
    background: 'rgba(100, 255, 218, 0.1)',
    border: '2px solid #64ffda',
    borderRadius: '12px',
    padding: '2rem',
    marginTop: '3rem',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  acknowledgmentText: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#64ffda',
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