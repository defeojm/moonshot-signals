import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function LandingPage() {
  const router = useRouter();
  const [recentTrades, setRecentTrades] = useState([]);
  const [stats, setStats] = useState({
    winRate: '90.8%',
    quarterProfit: '$153K',
    totalTrades: '5,561',
    sharpeRatio: '5.221'
  });
  const [memberCount, setMemberCount] = useState(23);
  const [spotsRemaining, setSpotsRemaining] = useState(2);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Fetch initial data
    fetchRecentTrades();
    fetchStats();

    // Listen for real-time updates
    newSocket.on('new-trade', (trade) => {
      setRecentTrades(prev => [trade, ...prev.slice(0, 5)]);
      // Add animation for new trades
      animateNewTrade();
    });

    newSocket.on('stats-update', (newStats) => {
      setStats(newStats);
    });

    newSocket.on('member-update', (data) => {
      setMemberCount(data.total);
      setSpotsRemaining(25 - data.total);
    });

    return () => newSocket.close();
  }, []);

  const fetchRecentTrades = async () => {
    try {
      const res = await fetch('/api/trades/recent');
      const data = await res.json();
      setRecentTrades(data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/performance/stats');
      const data = await res.json();
      setStats({
        winRate: `${data.winRate}%`,
        quarterProfit: `$${(data.quarterProfit / 1000).toFixed(0)}K`,
        totalTrades: data.totalTrades.toLocaleString(),
        sharpeRatio: data.sharpeRatio.toFixed(3)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const animateNewTrade = () => {
    // Trigger CSS animation for new trade
    const tradeCards = document.querySelectorAll('.trade-card');
    if (tradeCards[0]) {
      tradeCards[0].classList.add('pulse-animation');
      setTimeout(() => {
        tradeCards[0].classList.remove('pulse-animation');
      }, 1000);
    }
  };

  const formatTradeData = (trade) => {
    const profit = trade.exit_price ? 
      ((trade.exit_price - trade.entry_price) * trade.size).toFixed(0) : 
      'Active';
    const direction = trade.direction === 'buy' ? 'LONG' : 'SHORT';
    const duration = trade.closed_at ? 
      calculateDuration(trade.opened_at, trade.closed_at) : 
      'Ongoing';
    
    return { profit, direction, duration };
  };

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(100, 255, 218, 0.5); }
          50% { box-shadow: 0 0 40px rgba(100, 255, 218, 0.8); }
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .fade-in { animation: fadeInUp 0.8s ease-out; }
        .pulse-animation { animation: pulse 0.6s ease-in-out; }
        .glow-effect { animation: glow 2s ease-in-out infinite; }
        .slide-in { animation: slideIn 0.5s ease-out; }

        .gradient-text {
          background: linear-gradient(135deg, #64ffda 0%, #5e9eff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(94, 158, 255, 0.3);
        }

        .live-dot {
          position: relative;
        }
        .live-dot::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: #64ffda;
          border-radius: 50%;
          animation: ripple 1.5s ease-out infinite;
        }

        @keyframes ripple {
          0% {
            width: 8px;
            height: 8px;
            opacity: 1;
          }
          100% {
            width: 30px;
            height: 30px;
            opacity: 0;
          }
        }

        .trade-card {
          position: relative;
          overflow: hidden;
        }
        .trade-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #64ffda, #5e9eff, #64ffda);
          border-radius: 8px;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s;
        }
        .trade-card:hover::before {
          opacity: 1;
        }

        .new-trade-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ffd464;
          color: #0a0e27;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation with Glass Effect */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logo} className="gradient-text">MoonShot Signals</div>
          <div style={styles.navLinks}>
            <a href="#proof" style={styles.navLink}>Live Results</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#how-it-works" style={styles.navLink}>How It Works</a>
            <a href="#faq" style={styles.navLink}>FAQ</a>
            <button 
              onClick={() => router.push('/login')} 
              style={styles.loginButton}
              className="hover-lift"
            >
              Member Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animations */}
      <section style={styles.hero}>
        <div style={styles.heroBadge} className="fade-in glow-effect">
          🔥 Limited to {25 - memberCount} Spots Remaining
        </div>
        <h1 style={styles.heroTitle} className="fade-in">
          Trade Like a Pro<br />With {stats.winRate} Win Rate
        </h1>
        <p style={styles.heroSubtitle} className="fade-in">
          Real-time crypto perpetual signals from a verified profitable trader. 
          No theory, just proven results.
        </p>
        
        <div style={styles.heroCta} className="fade-in">
          <button 
            onClick={() => router.push('/signup')} 
            style={styles.ctaPrimary}
            className="hover-lift"
          >
            Get Instant Access
          </button>
          <a href="#proof" style={styles.ctaSecondary} className="hover-lift">
            View Live Results
          </a>
        </div>
        
        {/* Animated Stats Bar */}
        <div style={styles.statsBar} className="fade-in">
          <div style={styles.statItem} className="hover-lift">
            <div style={styles.statValue} className="gradient-text">{stats.winRate}</div>
            <div style={styles.statLabel}>Win Rate</div>
          </div>
          <div style={styles.statItem} className="hover-lift">
            <div style={styles.statValue} className="gradient-text">{stats.quarterProfit}</div>
            <div style={styles.statLabel}>Q2 Profit</div>
          </div>
          <div style={styles.statItem} className="hover-lift">
            <div style={styles.statValue} className="gradient-text">{stats.totalTrades}</div>
            <div style={styles.statLabel}>Verified Trades</div>
          </div>
          <div style={styles.statItem} className="hover-lift">
            <div style={styles.statValue} className="gradient-text">{stats.sharpeRatio}</div>
            <div style={styles.statLabel}>Sharpe Ratio</div>
          </div>
        </div>

        {/* Floating Background Elements */}
        <div style={styles.floatingElements}>
          <div style={styles.floatingCircle1}></div>
          <div style={styles.floatingCircle2}></div>
        </div>
      </section>

      {/* Live Proof Section with Real-time Updates */}
      <section id="proof" style={styles.proofSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.liveHeader}>
            <h2 style={styles.sectionTitle}>Live Trading Results</h2>
            <div style={styles.liveIndicator}>
              <span className="live-dot" style={styles.liveDot}></span>
              <span>LIVE</span>
            </div>
          </div>
          <p style={styles.sectionSubtitle}>
            Every trade posted in real-time • Last update: just now
          </p>
          
          <div style={styles.tradesGrid}>
            {recentTrades.length > 0 ? (
              recentTrades.map((trade, index) => {
                const { profit, direction, duration } = formatTradeData(trade);
                return (
                  <div 
                    key={trade.id} 
                    style={styles.tradeResult} 
                    className={`trade-card hover-lift ${index === 0 ? 'slide-in' : ''}`}
                  >
                    {index === 0 && <div className="new-trade-badge">NEW</div>}
                    <div style={styles.tradeResultHeader}>
                      <div style={styles.tradePairBadge}>
                        <span style={direction === 'LONG' ? styles.tradeLong : styles.tradeShort}>
                          {direction}
                        </span>
                        <span>{trade.symbol}</span>
                      </div>
                      <span style={styles.tradeProfit}>
                        {profit !== 'Active' ? `+$${profit}` : profit}
                      </span>
                    </div>
                    <div style={styles.tradeDetails}>
                      Entry: ${trade.entry_price.toLocaleString()}<br />
                      {trade.exit_price && `Exit: $${trade.exit_price.toLocaleString()}`}<br />
                      Duration: {duration}<br />
                      Size: {trade.size} {trade.symbol.split('-')[0]}
                    </div>
                    <div style={styles.tradeStatus}>
                      <div style={styles.progressBar}>
                        <div 
                          style={{
                            ...styles.progressFill,
                            width: trade.status === 'closed' ? '100%' : '60%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Placeholder trades for initial load
              <>
                <div style={styles.tradeResult} className="hover-lift">
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
                
                <div style={styles.tradeResult} className="hover-lift">
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
                
                <div style={styles.tradeResult} className="hover-lift">
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
              </>
            )}
          </div>

          <div style={styles.viewMoreContainer}>
            <button 
              onClick={() => router.push('/performance')} 
              style={styles.viewMoreButton}
              className="hover-lift"
            >
              View Full Track Record →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works with Icons */}
      <section id="how-it-works" style={styles.howItWorks}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>
            Start receiving profitable signals in minutes
          </p>
          
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard} className="hover-lift fade-in">
              <div style={styles.stepNumber}>
                <span style={styles.stepIcon}>👤</span>
              </div>
              <h3 style={styles.stepTitle}>Join VIP</h3>
              <p style={styles.stepDescription}>
                Choose your plan and get instant access to our private dashboard
              </p>
            </div>
            
            <div style={styles.stepCard} className="hover-lift fade-in">
              <div style={styles.stepNumber}>
                <span style={styles.stepIcon}>📊</span>
              </div>
              <h3 style={styles.stepTitle}>Receive Signals</h3>
              <p style={styles.stepDescription}>
                Get real-time alerts with entry, stop loss, and take profit levels
              </p>
            </div>
            
            <div style={styles.stepCard} className="hover-lift fade-in">
              <div style={styles.stepNumber}>
                <span style={styles.stepIcon}>🚀</span>
              </div>
              <h3 style={styles.stepTitle}>Copy & Trade</h3>
              <p style={styles.stepDescription}>
                Execute trades on OKX with one-click copy functionality
              </p>
            </div>
            
            <div style={styles.stepCard} className="hover-lift fade-in">
              <div style={styles.stepNumber}>
                <span style={styles.stepIcon}>📈</span>
              </div>
              <h3 style={styles.stepTitle}>Track Results</h3>
              <p style={styles.stepDescription}>
                Monitor your performance with our real-time dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" style={styles.pricingSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p style={styles.sectionSubtitle}>No hidden fees. Cancel anytime.</p>
          
          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard} className="hover-lift">
              <h3 style={styles.planName}>Essential</h3>
              <div style={styles.planPrice}>
                $99<span style={styles.priceUnit}>/month</span>
              </div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> 5-10 daily signals
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Entry & exit alerts
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Basic risk management
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Dashboard access
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Email support
                </li>
              </ul>
              <button 
                onClick={() => router.push('/signup?plan=essential')} 
                style={styles.pricingCta}
                className="hover-lift"
              >
                Start Trading
              </button>
            </div>
            
            <div style={{...styles.pricingCard, ...styles.featured}} className="hover-lift glow-effect">
              <span style={styles.pricingBadge}>MOST POPULAR</span>
              <h3 style={styles.planName}>VIP</h3>
              <div style={styles.planPrice}>
                $199<span style={styles.priceUnit}>/month</span>
              </div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> ALL trades in real-time
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Detailed analysis
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Position sizing guide
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Direct chat access
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Weekly strategy calls
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span> Priority support
                </li>
              </ul>
              <button 
                onClick={() => router.push('/signup?plan=vip')} 
                style={styles.pricingCtaFeatured}
                className="hover-lift"
              >
                Get VIP Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section id="faq" style={styles.faqSection}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        
        <div style={styles.faqContainer}>
          <details style={styles.faqItem} className="hover-lift">
            <summary style={styles.faqQuestion}>
              What exchanges do you trade on?
            </summary>
            <p style={styles.faqAnswer}>
              I exclusively trade perpetual futures on OKX. All signals are optimized for OKX&apos;s platform, 
              but can be executed on other exchanges offering BTC, ETH, and SOL perpetuals.
            </p>
          </details>
          
          <details style={styles.faqItem} className="hover-lift">
            <summary style={styles.faqQuestion}>
              How many signals do you send daily?
            </summary>
            <p style={styles.faqAnswer}>
              I average 10-20 trades per day during my trading window (6AM-12PM EST). Essential members 
              receive 5-10 of the highest probability setups, while VIP members get every single trade I take.
            </p>
          </details>
          
          <details style={styles.faqItem} className="hover-lift">
            <summary style={styles.faqQuestion}>
              Is your {stats.winRate} win rate real?
            </summary>
            <p style={styles.faqAnswer}>
              Yes, verified across {stats.totalTrades} trades in Q2 2025. However, my average loss is 3.6x my average win, 
              meaning risk management is critical. I provide exact position sizing guidelines to all members.
            </p>
          </details>

          <details style={styles.faqItem} className="hover-lift">
            <summary style={styles.faqQuestion}>
              Can I cancel anytime?
            </summary>
            <p style={styles.faqAnswer}>
              Absolutely. No contracts, no minimum commitment. Cancel directly from your dashboard or contact support. 
              You&apos;ll maintain access until the end of your billing period.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA with Urgency */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle} className="gradient-text">
            Ready to Trade with Confidence?
          </h2>
          <p style={styles.ctaSubtitle}>
            Join {memberCount} profitable traders already copying my signals
          </p>
          <button 
            onClick={() => router.push('/signup')} 
            style={styles.ctaPrimaryLarge}
            className="hover-lift glow-effect"
          >
            Start Your 7-Day Trial
          </button>
          <p style={styles.ctaNote}>
            Limited to 25 members total • Only {spotsRemaining} spots remaining
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <a href="/terms" style={styles.footerLink}>Terms</a>
            <a href="/privacy" style={styles.footerLink}>Privacy</a>
            <a href="/disclaimer" style={styles.footerLink}>Risk Disclaimer</a>
            <a href="/contact" style={styles.footerLink}>Contact</a>
          </div>
          <p style={styles.copyright}>
            © 2025 MoonShot Signals. Trading involves risk. Past performance doesn&apos;t guarantee future results.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  },
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a3456',
    zIndex: 1000,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
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
    fontSize: '1.75rem',
    fontWeight: 'bold',
    letterSpacing: '-0.5px'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  navLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'all 0.3s',
    position: 'relative',
    fontWeight: '500'
  },
  loginButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    border: '2px solid #5e9eff',
    borderRadius: '8px',
    color: '#5e9eff',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  hero: {
    marginTop: '80px',
    padding: '8rem 2rem 6rem',
    textAlign: 'center',
    position: 'relative'
  },
  heroBadge: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    border: '2px solid #64ffda',
    borderRadius: '30px',
    color: '#64ffda',
    fontSize: '0.875rem',
    marginBottom: '2rem',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '800',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
    letterSpacing: '-2px'
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#8892b0',
    marginBottom: '3rem',
    maxWidth: '700px',
    margin: '0 auto 3rem',
    lineHeight: '1.5'
  },
  heroCta: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '5rem',
    flexWrap: 'wrap'
  },
  ctaPrimary: {
    padding: '1.25rem 3rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 10px 30px rgba(100, 255, 218, 0.3)'
  },
  ctaSecondary: {
    padding: '1.25rem 3rem',
    backgroundColor: 'rgba(30, 36, 68, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '2px solid #2a3456',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '1.125rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  statItem: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'rgba(30, 36, 68, 0.3)',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    backdropFilter: 'blur(10px)'
  },
  statValue: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    letterSpacing: '-1px'
  },
  statLabel: {
    color: '#8892b0',
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1
  },
  floatingCircle1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    animation: 'float 20s ease-in-out infinite'
  },
  floatingCircle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(94, 158, 255, 0.1) 0%, transparent 70%)',
    bottom: '-150px',
    left: '-150px',
    animation: 'float 15s ease-in-out infinite reverse'
  },
  proofSection: {
    padding: '6rem 2rem',
    backgroundColor: '#151935',
    borderTop: '1px solid #2a3456',
    borderBottom: '1px solid #2a3456',
    position: 'relative'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  liveHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px'
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#64ffda',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#64ffda',
    borderRadius: '50%',
    display: 'inline-block'
  },
  sectionSubtitle: {
    color: '#8892b0',
    fontSize: '1.25rem',
    textAlign: 'center',
    marginBottom: '4rem'
  },
  tradesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  tradeResult: {
    backgroundColor: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '12px',
    padding: '2rem',
    position: 'relative',
    transition: 'all 0.3s'
  },
  tradeResultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  tradePairBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  tradeLong: {
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tradeShort: {
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tradeProfit: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#64ffda',
    letterSpacing: '-0.5px'
  },
  tradeDetails: {
    color: '#8892b0',
    fontSize: '0.95rem',
    lineHeight: '1.8',
    marginBottom: '1rem'
  },
  tradeStatus: {
    marginTop: '1.5rem'
  },
  progressBar: {
    height: '4px',
    backgroundColor: 'rgba(136, 146, 176, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#64ffda',
    transition: 'width 0.5s ease',
    borderRadius: '2px'
  },
  viewMoreContainer: {
    textAlign: 'center',
    marginTop: '3rem'
  },
  viewMoreButton: {
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    border: '2px solid #5e9eff',
    borderRadius: '8px',
    color: '#5e9eff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  howItWorks: {
    padding: '6rem 2rem',
    backgroundColor: '#0a0e27'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  stepCard: {
    textAlign: 'center',
    padding: '2rem'
  },
  stepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    backgroundColor: 'rgba(30, 36, 68, 0.6)',
    border: '3px solid #5e9eff',
    borderRadius: '50%',
    marginBottom: '1.5rem',
    position: 'relative'
  },
  stepIcon: {
    fontSize: '2rem'
  },
  stepTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: '600'
  },
  stepDescription: {
    color: '#8892b0',
    fontSize: '1rem',
    lineHeight: '1.6'
  },
  pricingSection: {
    padding: '6rem 2rem',
    backgroundColor: '#151935'
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '3rem',
    maxWidth: '900px',
    margin: '0 auto'
  },
  pricingCard: {
    backgroundColor: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '16px',
    padding: '3rem 2rem',
    position: 'relative',
    textAlign: 'center'
  },
  featured: {
    borderColor: '#64ffda',
    transform: 'scale(1.05)',
    backgroundColor: 'rgba(30, 36, 68, 0.8)'
  },
  pricingBadge: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    padding: '0.5rem 1.5rem',
    borderRadius: '25px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  planName: {
    fontSize: '2rem',
    marginBottom: '1rem',
    fontWeight: '600'
  },
  planPrice: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#64ffda',
    marginBottom: '2rem',
    letterSpacing: '-2px'
  },
  priceUnit: {
    fontSize: '1.25rem',
    color: '#8892b0',
    fontWeight: '400'
  },
  pricingFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '2rem 0',
    textAlign: 'left'
  },
  featureItem: {
    padding: '0.75rem 0',
    color: '#8892b0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1rem'
  },
  checkmark: {
    color: '#64ffda',
    fontWeight: 'bold',
    fontSize: '1.25rem'
  },
  pricingCta: {
    display: 'block',
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#5e9eff',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '2rem'
  },
  pricingCtaFeatured: {
    display: 'block',
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '10px',
    color: '#0a0e27',
    fontSize: '1.125rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '2rem',
    boxShadow: '0 10px 30px rgba(100, 255, 218, 0.3)'
  },
  faqSection: {
    padding: '6rem 2rem',
    maxWidth: '900px',
    margin: '0 auto'
  },
  faqContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  faqItem: {
    backgroundColor: '#151935',
    border: '2px solid #2a3456',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    cursor: 'pointer'
  },
  faqQuestion: {
    marginBottom: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '600',
    cursor: 'pointer',
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faqAnswer: {
    color: '#8892b0',
    lineHeight: '1.8',
    fontSize: '1rem',
    marginTop: '1rem'
  },
  ctaSection: {
    padding: '8rem 2rem',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #151935 0%, #0a0e27 100%)',
    position: 'relative'
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '3.5rem',
    marginBottom: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  ctaSubtitle: {
    fontSize: '1.5rem',
    color: '#8892b0',
    marginBottom: '3rem'
  },
  ctaPrimaryLarge: {
    padding: '1.5rem 4rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 20px 40px rgba(100, 255, 218, 0.4)'
  },
  ctaNote: {
    fontSize: '1rem',
    marginTop: '2rem',
    color: '#ffd464',
    fontWeight: '600'
  },
  footer: {
    padding: '3rem 2rem',
    backgroundColor: '#0a0e27',
    borderTop: '1px solid #2a3456',
    textAlign: 'center',
    color: '#8892b0'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  footerLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontWeight: '500'
  },
  copyright: {
    fontSize: '0.875rem',
    color: '#5a6378'
  }
};