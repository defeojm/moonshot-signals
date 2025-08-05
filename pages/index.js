import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function LandingPage() {
  const router = useRouter();
  const [recentTrades, setRecentTrades] = useState([]);
  const [stats, setStats] = useState({
    winRate: '90.8',
    quarterProfit: '$153K',
    totalTrades: '5,561',
    sharpeRatio: '5.221'
  });
  const [memberCount, setMemberCount] = useState(23);
  const [isConnected, setIsConnected] = useState(false);
  const [newTradeAlert, setNewTradeAlert] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Request initial data on connect
      socket.emit('request_stats');
      socket.emit('request_recent_trades');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    // Real-time event handlers
    socket.on('new_trade', (trade) => {
      handleNewTrade(trade);
    });

    socket.on('trade_closed', (trade) => {
      updateTradeStatus(trade);
    });

    socket.on('stats_update', (newStats) => {
      updateStats(newStats);
    });

    socket.on('member_count_update', (count) => {
      setMemberCount(count);
    });

    socket.on('initial_data', (data) => {
      if (data.trades) setRecentTrades(data.trades.slice(0, 6));
      if (data.stats) updateStats(data.stats);
      if (data.memberCount) setMemberCount(data.memberCount);
    });

    // Fetch initial data via HTTP as fallback
    fetchInitialData();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Fetch recent trades
      const tradesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades`, { headers });
      if (tradesRes.ok) {
        const trades = await tradesRes.json();
        const recentPublishedTrades = trades
          .filter(t => t.signal?.published)
          .slice(0, 6);
        setRecentTrades(recentPublishedTrades);
      }

      // Fetch stats
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics?period=90`, { headers });
      if (statsRes.ok) {
        const data = await statsRes.json();
        updateStats(data.tradeStats);
      }

      // Fetch member count
      const membersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-stats`, { headers });
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMemberCount(data.activeCount || 23);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleNewTrade = (trade) => {
    // Add new trade to the beginning with animation
    setRecentTrades(prev => [trade, ...prev.slice(0, 5)]);
    
    // Show notification
    setNewTradeAlert({
      symbol: trade.symbol,
      direction: trade.direction,
      profit: trade.pnl
    });

    // Clear notification after 5 seconds
    setTimeout(() => setNewTradeAlert(null), 5000);
  };

  const updateTradeStatus = (updatedTrade) => {
    setRecentTrades(prev => 
      prev.map(trade => 
        trade.id === updatedTrade.id ? updatedTrade : trade
      )
    );
  };

  const updateStats = (newStats) => {
    setStats({
      winRate: newStats.winRate ? `${newStats.winRate}` : '90.8',
      quarterProfit: newStats.totalPnl ? `$${Math.round(newStats.totalPnl / 1000)}K` : '$153K',
      totalTrades: newStats.totalTrades ? newStats.totalTrades.toLocaleString() : '5,561',
      sharpeRatio: calculateSharpeRatio(newStats).toFixed(3)
    });
  };

  const calculateSharpeRatio = (stats) => {
    if (!stats.avgWin || !stats.avgLoss) return 5.221;
    const avgReturn = (stats.avgWin + stats.avgLoss) / stats.totalTrades;
    const riskFreeRate = 0.02;
    return ((avgReturn - riskFreeRate) / Math.abs(stats.avgLoss)) * Math.sqrt(252);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'Active';
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(100, 255, 218, 0.5); }
          50% { box-shadow: 0 0 40px rgba(100, 255, 218, 0.8), 0 0 60px rgba(100, 255, 218, 0.6); }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #64ffda 0%, #5e9eff 50%, #64ffda 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease infinite;
        }

        .hover-glow {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hover-glow:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .hover-glow::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(100, 255, 218, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .hover-glow:hover::before {
          width: 300px;
          height: 300px;
        }

        .glass-effect {
          background: rgba(30, 36, 68, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(100, 255, 218, 0.2);
        }

        .new-trade-flash {
          animation: flash 0.5s ease-out;
        }

        @keyframes flash {
          0% { background-color: rgba(100, 255, 218, 0.3); }
          100% { background-color: transparent; }
        }

        .live-dot {
          position: relative;
        }

        .live-dot::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #64ffda;
          transform: translate(-50%, -50%);
          animation: ripple 1.5s ease-out infinite;
        }

        .notification-banner {
          position: fixed;
          top: 80px;
          right: 20px;
          background: linear-gradient(135deg, #1e2444 0%, #2a3456 100%);
          border: 2px solid #64ffda;
          border-radius: 12px;
          padding: 1rem 2rem;
          box-shadow: 0 10px 40px rgba(100, 255, 218, 0.3);
          z-index: 1001;
          animation: slideInRight 0.5s ease-out;
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .stats-grid-mobile { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-title-mobile { font-size: 2.5rem !important; }
        }
      `}</style>

      {/* Connection Status Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(30, 36, 68, 0.9)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        fontSize: '0.75rem',
        color: isConnected ? '#64ffda' : '#ff5e5e'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isConnected ? '#64ffda' : '#ff5e5e',
          animation: isConnected ? 'pulse 2s infinite' : 'none'
        }}></div>
        {isConnected ? 'Live Connected' : 'Connecting...'}
      </div>

      {/* New Trade Notification */}
      {newTradeAlert && (
        <div className="notification-banner">
          <div style={{ fontSize: '0.875rem', color: '#64ffda', marginBottom: '0.25rem' }}>
            🔥 NEW TRADE ALERT
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            {newTradeAlert.symbol} {newTradeAlert.direction === 'buy' ? 'LONG' : 'SHORT'}
          </div>
          {newTradeAlert.profit && (
            <div style={{ fontSize: '1rem', color: '#64ffda' }}>
              Profit: {formatPrice(newTradeAlert.profit)}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={styles.nav} className="glass-effect">
        <div style={styles.navContainer}>
          <div style={styles.logo} className="gradient-text">MoonShot Signals</div>
          <div style={styles.navLinks} className="hide-mobile">
            <a href="#proof" style={styles.navLink}>Live Results</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#how-it-works" style={styles.navLink}>How It Works</a>
            <a href="#faq" style={styles.navLink}>FAQ</a>
            <button 
              onClick={() => router.push('/login')} 
              style={styles.loginButton}
              className="hover-glow"
            >
              Member Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        {/* Animated Background Elements */}
        <div style={styles.bgElements}>
          <div style={styles.bgCircle1} className="animate-float"></div>
          <div style={styles.bgCircle2} className="animate-float"></div>
        </div>

        <div style={styles.heroBadge} className="animate-pulse glass-effect animate-glow">
          🔥 Limited to {25 - memberCount} Spots Remaining
        </div>
        
        <h1 style={styles.heroTitle} className="animate-fade-in hero-title-mobile">
          Trade Like a Pro<br />
          <span className="gradient-text">With {stats.winRate}% Win Rate</span>
        </h1>
        
        <p style={styles.heroSubtitle} className="animate-fade-in">
          Real-time crypto perpetual signals from a verified profitable trader. 
          No theory, just proven results.
        </p>
        
        <div style={styles.heroCta} className="animate-fade-in">
          <button 
            onClick={() => router.push('/signup')} 
            style={styles.ctaPrimary}
            className="hover-glow"
          >
            Get Instant Access
          </button>
          <a href="#proof" style={styles.ctaSecondary} className="hover-glow glass-effect">
            View Live Results
          </a>
        </div>
        
        {/* Animated Stats Bar */}
        <div style={styles.statsBar} className="stats-grid-mobile">
          {[
            { value: stats.winRate + '%', label: 'Win Rate', delay: '0.1s' },
            { value: stats.quarterProfit, label: 'Q2 Profit', delay: '0.2s' },
            { value: stats.totalTrades, label: 'Verified Trades', delay: '0.3s' },
            { value: stats.sharpeRatio, label: 'Sharpe Ratio', delay: '0.4s' }
          ].map((stat, index) => (
            <div 
              key={index} 
              style={{...styles.statItem, animationDelay: stat.delay}} 
              className="glass-effect animate-fade-in hover-glow"
            >
              <div style={styles.statValue} className="gradient-text">{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Proof Section */}
      <section id="proof" style={styles.proofSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
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
            {recentTrades.map((trade, index) => (
              <div 
                key={trade.id} 
                style={styles.tradeCard} 
                className={`hover-glow animate-fade-in ${index === 0 ? 'new-trade-flash' : ''}`}
              >
                {index === 0 && trade.status === 'open' && (
                  <div style={styles.newBadge} className="animate-pulse">NEW</div>
                )}
                <div style={styles.tradeHeader}>
                  <div style={styles.tradePair}>
                    <span style={trade.direction === 'buy' ? styles.buyBadge : styles.sellBadge}>
                      {trade.direction === 'buy' ? 'LONG' : 'SHORT'}
                    </span>
                    <span style={{ fontWeight: '600' }}>{trade.symbol}</span>
                  </div>
                  <span style={styles.tradeProfit}>
                    {trade.pnl ? formatPrice(trade.pnl) : 'Active'}
                  </span>
                </div>
                <div style={styles.tradeDetails}>
                  <div>Entry: {formatPrice(trade.entry_price)}</div>
                  {trade.exit_price && <div>Exit: {formatPrice(trade.exit_price)}</div>}
                  <div>Duration: {calculateDuration(trade.opened_at, trade.closed_at)}</div>
                  <div>Size: {trade.size} {trade.symbol.split('-')[0]}</div>
                </div>
                {trade.status === 'open' && (
                  <div style={styles.activeIndicator}>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill} className="animate-pulse"></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64ffda' }}>POSITION ACTIVE</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.viewMore}>
            <button 
              onClick={() => router.push('/performance')} 
              style={styles.viewMoreButton}
              className="hover-glow"
            >
              View Full Track Record →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={styles.howItWorks}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Start receiving profitable signals in minutes</p>
          
          <div style={styles.stepsGrid}>
            {[
              { 
                icon: '👤', 
                title: 'Join VIP', 
                desc: 'Choose your plan and get instant access to our private dashboard',
                color: '#5e9eff'
              },
              { 
                icon: '📊', 
                title: 'Receive Signals', 
                desc: 'Get real-time alerts with entry, stop loss, and take profit levels',
                color: '#64ffda'
              },
              { 
                icon: '🚀', 
                title: 'Copy & Trade', 
                desc: 'Execute trades on OKX with one-click copy functionality',
                color: '#ffd464'
              },
              { 
                icon: '📈', 
                title: 'Track Results', 
                desc: 'Monitor your performance with our real-time dashboard',
                color: '#ff5e5e'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                style={{...styles.stepCard, animationDelay: `${index * 0.1}s`}} 
                className="animate-fade-in hover-glow"
              >
                <div style={{...styles.stepIcon, background: `rgba(30, 36, 68, 0.8)`, border: `3px solid ${step.color}`}}>
                  {step.icon}
                </div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricingSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p style={styles.sectionSubtitle}>No hidden fees. Cancel anytime.</p>
          
          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard} className="hover-glow animate-fade-in">
              <h3 style={styles.planName}>Essential</h3>
              <div style={styles.planPrice}>
                $99<span style={styles.priceUnit}>/month</span>
              </div>
              <ul style={styles.features}>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> 5-10 daily signals
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Entry & exit alerts
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Basic risk management
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Dashboard access
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Email support
                </li>
              </ul>
              <button 
                onClick={() => router.push('/signup?plan=essential')} 
                style={styles.planButton}
                className="hover-glow"
              >
                Start Trading
              </button>
            </div>
            
            <div style={{...styles.pricingCard, ...styles.featured}} className="hover-glow animate-fade-in animate-glow">
              <div style={styles.popularBadge}>MOST POPULAR</div>
              <h3 style={styles.planName}>VIP</h3>
              <div style={styles.planPrice}>
                $199<span style={styles.priceUnit}>/month</span>
              </div>
              <ul style={styles.features}>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> ALL trades in real-time
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Detailed analysis
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Position sizing guide
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Direct chat access
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Weekly strategy calls
                </li>
                <li style={styles.featureItem}>
                  <span style={styles.checkIcon}>✓</span> Priority support
                </li>
              </ul>
              <button 
                onClick={() => router.push('/signup?plan=vip')} 
                style={styles.featuredButton}
                className="hover-glow"
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
        
        {[
          {
            q: 'What exchanges do you trade on?',
            a: 'I exclusively trade perpetual futures on OKX. All signals are optimized for OKX\'s platform, but can be executed on other exchanges offering BTC, ETH, and SOL perpetuals.'
          },
          {
            q: 'How many signals do you send daily?',
            a: 'I average 10-20 trades per day during my trading window (6AM-12PM EST). Essential members receive 5-10 of the highest probability setups, while VIP members get every single trade I take.'
          },
          {
            q: `Is your ${stats.winRate}% win rate real?`,
            a: `Yes, verified across ${stats.totalTrades} trades in Q2 2025. However, my average loss is 3.6x my average win, meaning risk management is critical. I provide exact position sizing guidelines to all members.`
          },
          {
            q: 'Can I cancel anytime?',
            a: 'Absolutely. No contracts, no minimum commitment. Cancel directly from your dashboard or contact support. You\'ll maintain access until the end of your billing period.'
          }
        ].map((faq, index) => (
          <details 
            key={index} 
            style={styles.faqItem} 
            className="hover-glow animate-fade-in"
          >
            <summary style={styles.faqQuestion}>{faq.q}</summary>
            <p style={styles.faqAnswer}>{faq.a}</p>
          </details>
        ))}
      </section>

      {/* Final CTA */}
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
            style={styles.ctaButton}
            className="hover-glow animate-glow"
          >
            Start Your 7-Day Trial
          </button>
          <p style={styles.ctaNote}>
            Limited to 25 members total • Only {25 - memberCount} spots remaining
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <a href="/terms" style={styles.footerLink}>Terms of Service</a>
            <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(42, 52, 86, 0.5)',
    zIndex: 1000,
    transition: 'all 0.3s ease'
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
    gap: '2.5rem',
    alignItems: 'center'
  },
  navLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'all 0.3s',
    cursor: 'pointer',
    position: 'relative',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  loginButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    border: '2px solid #5e9eff',
    borderRadius: '8px',
    color: '#5e9eff',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '1rem',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden'
  },
  hero: {
    marginTop: '80px',
    padding: '8rem 2rem 6rem',
    textAlign: 'center',
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1
  },
  bgCircle1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
    top: '-250px',
    right: '-250px'
  },
  bgCircle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(94, 158, 255, 0.1) 0%, transparent 70%)',
    bottom: '-200px',
    left: '-200px'
  },
  heroBadge: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    borderRadius: '30px',
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
    boxShadow: '0 10px 30px rgba(100, 255, 218, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  ctaSecondary: {
    padding: '1.25rem 3rem',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '1.125rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    width: '100%'
  },
  statItem: {
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
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
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '500'
  },
  proofSection: {
    padding: '6rem 2rem',
    backgroundColor: '#151935',
    borderTop: '1px solid rgba(42, 52, 86, 0.5)',
    borderBottom: '1px solid rgba(42, 52, 86, 0.5)',
    position: 'relative'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
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
    letterSpacing: '1px',
    padding: '0.5rem 1rem',
    background: 'rgba(100, 255, 218, 0.1)',
    borderRadius: '20px',
    border: '1px solid rgba(100, 255, 218, 0.3)'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#64ffda',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative'
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
  tradeCard: {
    backgroundColor: '#1e2444',
    border: '2px solid rgba(42, 52, 86, 0.5)',
    borderRadius: '12px',
    padding: '2rem',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  newBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#ffd464',
    color: '#0a0e27',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tradeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  tradePair: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.125rem'
  },
  buyBadge: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda',
    borderRadius: '25px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  sellBadge: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e',
    borderRadius: '25px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
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
  activeIndicator: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(42, 52, 86, 0.5)'
  },
  progressBar: {
    height: '4px',
    backgroundColor: 'rgba(136, 146, 176, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '0.5rem'
  },
  progressFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#64ffda',
    borderRadius: '2px'
  },
  viewMore: {
    textAlign: 'center'
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
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  howItWorks: {
    padding: '6rem 2rem',
    backgroundColor: '#0a0e27',
    position: 'relative'
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
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(30, 36, 68, 0.3)',
    border: '1px solid rgba(42, 52, 86, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  stepIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: '2.5rem'
  },
  stepTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: '600'
  },
  stepDesc: {
    color: '#8892b0',
    fontSize: '1rem',
    lineHeight: '1.6'
  },
  pricingSection: {
    padding: '6rem 2rem',
    backgroundColor: '#151935',
    position: 'relative'
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
    border: '2px solid rgba(42, 52, 86, 0.5)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    position: 'relative',
    textAlign: 'center',
    overflow: 'hidden'
  },
  featured: {
    borderColor: '#64ffda',
    transform: 'scale(1.05)',
    backgroundColor: 'rgba(30, 36, 68, 0.8)'
  },
  popularBadge: {
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
  features: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 2rem 0',
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
  checkIcon: {
    color: '#64ffda',
    fontWeight: 'bold',
    fontSize: '1.25rem'
  },
  planButton: {
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#5e9eff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1.125rem',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  featuredButton: {
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '1.125rem',
    boxShadow: '0 10px 30px rgba(100, 255, 218, 0.3)',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  faqSection: {
    padding: '6rem 2rem',
    maxWidth: '900px',
    margin: '0 auto'
  },
  faqItem: {
    backgroundColor: '#151935',
    border: '2px solid rgba(42, 52, 86, 0.5)',
    borderRadius: '12px',
    marginBottom: '1rem',
    padding: '2rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  faqQuestion: {
    fontSize: '1.25rem',
    fontWeight: '600',
    listStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faqAnswer: {
    color: '#8892b0',
    lineHeight: '1.8',
    marginTop: '1rem',
    fontSize: '1rem'
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
  ctaButton: {
    padding: '1.5rem 4rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 20px 40px rgba(100, 255, 218, 0.4)',
    position: 'relative',
    overflow: 'hidden'
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
    borderTop: '1px solid rgba(42, 52, 86, 0.5)',
    textAlign: 'center'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  footerLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontWeight: '500'
  },
  copyright: {
    color: '#5a6378',
    fontSize: '0.875rem'
  }
};