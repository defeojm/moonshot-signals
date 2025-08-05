import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Privacy() {
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
          <h1 style={styles.pageTitle}>Privacy Policy</h1>
          <p style={styles.lastUpdated}>Last Updated: August 5, 2025</p>
        </div>

        {/* Introduction */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Introduction</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              MoonShot Signals (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This 
              Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our website www.getmoonshots.com and related services (the &quot;Services&quot;).
            </p>
            <p style={styles.paragraph}>
              By using our Services, you consent to the data practices described in this policy. If 
              you do not agree with the terms of this Privacy Policy, please do not access the Services.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>1.1 Personal Information You Provide</h3>
            <p style={styles.paragraph}>
              We collect information you provide directly to us, including:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Account Information:</strong> Name, email address, username, and password
              </li>
              <li style={styles.listItem}>
                <strong>Payment Information:</strong> Credit card details, billing address (processed 
                securely through Stripe)
              </li>
              <li style={styles.listItem}>
                <strong>Profile Information:</strong> Trading experience level, preferences
              </li>
              <li style={styles.listItem}>
                <strong>Communications:</strong> Emails, support tickets, and other correspondence
              </li>
            </ul>

            <h3 style={styles.subheading}>1.2 Information Collected Automatically</h3>
            <p style={styles.paragraph}>
              When you use our Services, we automatically collect:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Device Information:</strong> IP address, browser type, operating system, 
                device identifiers
              </li>
              <li style={styles.listItem}>
                <strong>Usage Data:</strong> Pages visited, features used, time spent on pages, 
                click patterns
              </li>
              <li style={styles.listItem}>
                <strong>Trading Activity:</strong> Signal views, performance tracking preferences
              </li>
              <li style={styles.listItem}>
                <strong>Cookies and Similar Technologies:</strong> See our Cookie Policy section below
              </li>
            </ul>

            <h3 style={styles.subheading}>1.3 Information from Third Parties</h3>
            <p style={styles.paragraph}>
              We may receive information about you from:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Payment processors (Stripe) for transaction verification
              </li>
              <li style={styles.listItem}>
                Analytics providers for usage insights
              </li>
              <li style={styles.listItem}>
                Email service providers for delivery status
              </li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We use the collected information for:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Service Delivery:</strong> Providing trading signals, analysis, and member dashboard access
              </li>
              <li style={styles.listItem}>
                <strong>Account Management:</strong> Creating and managing your account, processing payments
              </li>
              <li style={styles.listItem}>
                <strong>Communications:</strong> Sending signal alerts, updates, and support responses
              </li>
              <li style={styles.listItem}>
                <strong>Improvement:</strong> Analyzing usage to enhance our services and user experience
              </li>
              <li style={styles.listItem}>
                <strong>Security:</strong> Detecting and preventing fraud, unauthorized access, and abuse
              </li>
              <li style={styles.listItem}>
                <strong>Legal Compliance:</strong> Meeting legal obligations and enforcing our terms
              </li>
              <li style={styles.listItem}>
                <strong>Marketing:</strong> With your consent, sending promotional materials about our services
              </li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>3. How We Share Your Information</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We do not sell, trade, or rent your personal information. We may share your information with:
            </p>
            
            <h3 style={styles.subheading}>3.1 Service Providers</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Payment Processing:</strong> Stripe for secure payment handling
              </li>
              <li style={styles.listItem}>
                <strong>Email Services:</strong> SendGrid for delivering emails
              </li>
              <li style={styles.listItem}>
                <strong>Analytics:</strong> Google Analytics for usage insights (anonymized)
              </li>
              <li style={styles.listItem}>
                <strong>Hosting:</strong> Cloud service providers for data storage
              </li>
            </ul>

            <h3 style={styles.subheading}>3.2 Legal Requirements</h3>
            <p style={styles.paragraph}>
              We may disclose information if required by law or in response to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Court orders or subpoenas</li>
              <li style={styles.listItem}>Government requests</li>
              <li style={styles.listItem}>To protect our rights, property, or safety</li>
              <li style={styles.listItem}>To investigate fraud or security issues</li>
            </ul>

            <h3 style={styles.subheading}>3.3 Business Transfers</h3>
            <p style={styles.paragraph}>
              In the event of a merger, acquisition, or sale of assets, your information may be 
              transferred to the successor entity.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>4. Data Security</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                SSL/TLS encryption for data transmission
              </li>
              <li style={styles.listItem}>
                Encrypted storage of sensitive information
              </li>
              <li style={styles.listItem}>
                Regular security audits and updates
              </li>
              <li style={styles.listItem}>
                Limited access to personal information by authorized personnel
              </li>
              <li style={styles.listItem}>
                Secure password requirements and two-factor authentication options
              </li>
            </ul>
            <p style={styles.paragraph}>
              However, no method of transmission over the internet is 100% secure. We cannot guarantee 
              absolute security of your information.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>5. Your Rights and Choices</h2>
          <div style={styles.sectionContent}>
            <h3 style={styles.subheading}>5.1 Access and Update</h3>
            <p style={styles.paragraph}>
              You can access and update your personal information through your account dashboard or 
              by contacting us.
            </p>

            <h3 style={styles.subheading}>5.2 Email Preferences</h3>
            <p style={styles.paragraph}>
              You can opt-out of marketing emails using the unsubscribe link in any email. Note that 
              you cannot opt-out of service-related emails (e.g., trading signals for active subscribers).
            </p>

            <h3 style={styles.subheading}>5.3 Data Deletion</h3>
            <p style={styles.paragraph}>
              You can request deletion of your account and personal information by contacting 
              support@getmoonshots.com. We may retain certain information as required by law or for 
              legitimate business purposes.
            </p>

            <h3 style={styles.subheading}>5.4 Data Portability</h3>
            <p style={styles.paragraph}>
              You have the right to request a copy of your personal data in a structured, commonly 
              used format.
            </p>

            <h3 style={styles.subheading}>5.5 Do Not Track</h3>
            <p style={styles.paragraph}>
              We do not currently respond to Do Not Track browser signals.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>6. Cookies and Tracking Technologies</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We use cookies and similar technologies to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Essential Cookies:</strong> Required for site functionality and authentication
              </li>
              <li style={styles.listItem}>
                <strong>Analytics Cookies:</strong> Help us understand how you use our Services
              </li>
              <li style={styles.listItem}>
                <strong>Preference Cookies:</strong> Remember your settings and preferences
              </li>
            </ul>
            <p style={styles.paragraph}>
              You can control cookies through your browser settings. Disabling cookies may limit 
              certain features of our Services.
            </p>
          </div>
        </section>

        {/* Third-Party Services */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>7. Third-Party Services</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              Our Services may contain links to third-party websites or services. We are not responsible 
              for the privacy practices of these third parties. We encourage you to review their 
              privacy policies.
            </p>
            <p style={styles.paragraph}>
              Key third-party services we use:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Stripe:</strong> Payment processing (PCI-compliant)
              </li>
              <li style={styles.listItem}>
                <strong>Google Analytics:</strong> Usage analytics (anonymized)
              </li>
              <li style={styles.listItem}>
                <strong>SendGrid:</strong> Email delivery
              </li>
            </ul>
          </div>
        </section>

        {/* Children's Privacy */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>8. Children&apos;s Privacy</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              Our Services are not directed to individuals under 18 years of age. We do not knowingly 
              collect personal information from children. If we become aware that we have collected 
              personal information from a child under 18, we will take steps to delete such information.
            </p>
          </div>
        </section>

        {/* International Data Transfers */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>9. International Data Transfers</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              Your information may be transferred to and processed in countries other than your country 
              of residence. These countries may have data protection laws different from your country. 
              By using our Services, you consent to such transfers.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>10. Data Retention</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We retain your information for as long as necessary to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Provide our Services to you</li>
              <li style={styles.listItem}>Comply with legal obligations</li>
              <li style={styles.listItem}>Resolve disputes and enforce agreements</li>
              <li style={styles.listItem}>Maintain business records</li>
            </ul>
            <p style={styles.paragraph}>
              When your account is closed, we will delete or anonymize your personal information, 
              except as required by law.
            </p>
          </div>
        </section>

        {/* California Privacy Rights */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>11. California Privacy Rights</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              If you are a California resident, you have additional rights under the California 
              Consumer Privacy Act (CCPA):
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Right to know what personal information we collect</li>
              <li style={styles.listItem}>Right to delete your personal information</li>
              <li style={styles.listItem}>Right to opt-out of the sale of personal information (we do not sell data)</li>
              <li style={styles.listItem}>Right to non-discrimination for exercising privacy rights</li>
            </ul>
            <p style={styles.paragraph}>
              To exercise these rights, contact us at privacy@getmoonshots.com.
            </p>
          </div>
        </section>

        {/* Changes to Privacy Policy */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>12. Changes to This Privacy Policy</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of material 
              changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. 
              Your continued use of the Services after changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>13. Contact Us</h2>
          <div style={styles.sectionContent}>
            <p style={styles.paragraph}>
              If you have questions or concerns about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div style={styles.contactInfo}>
              <p><strong>MoonShot Signals</strong></p>
              <p>Email: privacy@getmoonshots.com</p>
              <p>Support: support@getmoonshots.com</p>
              <p>Website: www.getmoonshots.com/contact</p>
            </div>
            <p style={styles.paragraph}>
              For EU residents: You have the right to lodge a complaint with your local data protection 
              authority if you believe we have not handled your information appropriately.
            </p>
          </div>
        </section>

        {/* Footer Links */}
        <div style={styles.footerLinks}>
          <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
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
    marginBottom: '1rem',
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