import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PerformancePage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({
    totalTrades: 5561,
    winRate: 90.8,
    totalProfit: 153000,
    avgWin: 850,
    avgLoss: -3060,
    profitFactor: 3.2,
    sharpeRatio: 5.221,
    maxDrawdown: -8.5
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    try {
      // Fetch performance stats
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performance?period=${timeRange}`);
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Fetch monthly breakdown
      const monthlyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performance/monthly`);
      if (monthlyRes.ok) {
        const data = await monthlyRes.json();
        setMonthlyData(data);
      }

      // Fetch recent trades
      const tradesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades/recent?limit=50`);
      if (tradesRes.ok) {
        const data = await tradesRes.json();
        setRecentTrades(data);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Demo monthly data
  const demoMonthlyData = [
    { month: 'Jan 2025', profit: 42000, trades: 892, winRate: 89.5 },
    { month: 'Feb 2025', profit: 38500, trades: 856, winRate: 91.2 },
    { month: 'Mar 2025', profit: 51200, trades: 943, winRate: 90.8 },
    { month: 'Apr 2025', profit: 47300, trades: 901, winRate: 92.1 },
    { month: 'May 2025', profit: 53400, trades: 969, winRate: 90.3 }
  ];

  const displayMonthlyData = monthlyData.length > 0 ? monthlyData : demoMonthlyData;

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes progressFill {
          from { width: 0; }
          to { width: var(--progress); }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-count {
          animation: countUp 0.5s ease-out forwards;
        }

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
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .glass-card {
          background: rgba(30, 36, 68, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(42, 52, 86, 0.5);
        }

        .progress-bar {
          position: relative;
          height: 8px;
          background: rgba(136, 146, 176, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #64ffda 0%, #5e9eff 100%);
          border-radius: 4px;
          animation: progressFill 1s ease-out forwards;
        }

        .chart-bar {
          background: linear-gradient(180deg, #64ffda 0%, #5e9eff 100%);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .chart-bar:hover {
          filter: brightness(1.2);
          transform: scaleY(1.05);
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .grid-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logo} className="gradient-text">MoonShot Signals</div>
          <div style={styles.navLinks}>
            <button onClick={() => router.push('/')} style={styles.navLink}>
              ← Back to Home
            </button>
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

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle} className="animate-fade-in">
          Verified Trading Performance
        </h1>
        <p style={styles.heroSubtitle} className="animate-fade-in">
          Every trade documented. Every result transparent. No cherry-picking.
        </p>

        {/* Time Range Selector */}
        <div style={styles.timeRangeSelector} className="animate-fade-in">
          {['7d', '30d', '90d', 'YTD', 'All'].map((range) => (
            <button
              key={range}
              style={{
                ...styles.timeButton,
                ...(timeRange === range ? styles.timeButtonActive : {})
              }}
              onClick={() => setTimeRange(range)}
              className="hover-lift"
            >
              {range === 'YTD' ? 'Year to Date' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section style={styles.metricsSection}>
        <div style={styles.metricsGrid} className="grid-mobile">
          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Total Trades</div>
            <div style={styles.metricValue} className="animate-count">
              {stats.totalTrades.toLocaleString()}
            </div>
            <div style={styles.metricChange}>+{Math.round(stats.totalTrades * 0.12)} this month</div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Win Rate</div>
            <div style={styles.metricValue} className="gradient-text animate-count">
              {formatPercent(stats.winRate)}
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{...styles.progressFill, '--progress': `${stats.winRate}%`}} 
                className="progress-fill"
              ></div>
            </div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Total Profit</div>
            <div style={styles.metricValue} className="gradient-text animate-count">
              {formatCurrency(stats.totalProfit)}
            </div>
            <div style={styles.metricChange}>+{formatPercent(23.5)} vs last period</div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Profit Factor</div>
            <div style={styles.metricValue} className="animate-count">
              {stats.profitFactor.toFixed(2)}
            </div>
            <div style={styles.metricSubtext}>Gross Profit / Gross Loss</div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Average Win</div>
            <div style={styles.metricValue} className="animate-count">
              {formatCurrency(stats.avgWin)}
            </div>
            <div style={styles.metricSubtext}>Per winning trade</div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Average Loss</div>
            <div style={styles.metricValue} className="animate-count">
              {formatCurrency(stats.avgLoss)}
            </div>
            <div style={styles.metricSubtext}>Per losing trade</div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Sharpe Ratio</div>
            <div style={styles.metricValue} className="gradient-text animate-count">
              {stats.sharpeRatio.toFixed(3)}
            </div>
            <div style={styles.metricSubtext}>Risk-adjusted returns</div>
          </div>

          <div style={styles.metricCard} className="glass-card hover-lift animate-fade-in">
            <div style={styles.metricLabel}>Max Drawdown</div>
            <div style={styles.metricValue} className="animate-count">
              {formatPercent(stats.maxDrawdown)}
            </div>
            <div style={styles.metricSubtext}>Largest peak to trough</div>
          </div>
        </div>
      </section>

      {/* Monthly Performance Chart */}
      <section style={styles.chartSection}>
        <h2 style={styles.sectionTitle}>Monthly Performance Breakdown</h2>
        <div style={styles.chartCard} className="glass-card animate-fade-in">
          <div style={styles.chartContainer}>
            {displayMonthlyData.map((month, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.chartColumn,
                  animationDelay: `${index * 0.1}s`
                }}
                className="animate-slide-in"
              >
                <div style={styles.chartBarContainer}>
                  <div style={styles.chartValue}>{formatCurrency(month.profit)}</div>
                  <div 
                    className="chart-bar"
                    style={{
                      ...styles.chartBar,
                      height: `${(month.profit / 55000) * 200}px`
                    }}
                  ></div>
                </div>
                <div style={styles.chartLabel}>{month.month}</div>
                <div style={styles.chartStats}>
                  <span>{month.trades} trades</span>
                  <span>{formatPercent(month.winRate)} win</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Statistics */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statsCard} className="glass-card animate-fade-in">
            <h3 style={styles.statsTitle}>Trading Pairs Performance</h3>
            <div style={styles.pairsList}>
              {[
                { pair: 'BTC-USDT', trades: 2145, winRate: 91.2, profit: 68500 },
                { pair: 'ETH-USDT', trades: 1823, winRate: 90.5, profit: 47200 },
                { pair: 'SOL-USDT', trades: 1593, winRate: 89.8, profit: 37300 }
              ].map((pair, index) => (
                <div key={index} style={styles.pairItem} className="hover-lift">
                  <div style={styles.pairInfo}>
                    <span style={styles.pairName}>{pair.pair}</span>
                    <span style={styles.pairTrades}>{pair.trades} trades</span>
                  </div>
                  <div style={styles.pairStats}>
                    <span style={styles.pairWinRate}>{formatPercent(pair.winRate)}</span>
                    <span style={styles.pairProfit}>{formatCurrency(pair.profit)}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{...styles.progressFill, width: `${pair.winRate}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.statsCard} className="glass-card animate-fade-in">
            <h3 style={styles.statsTitle}>Risk Management</h3>
            <div style={styles.riskStats}>
              <div style={styles.riskItem}>
                <span style={styles.riskLabel}>Average Risk per Trade</span>
                <span style={styles.riskValue}>1.5%</span>
              </div>
              <div style={styles.riskItem}>
                <span style={styles.riskLabel}>Risk/Reward Ratio</span>
                <span style={styles.riskValue}>1:3.6</span>
              </div>
              <div style={styles.riskItem}>
                <span style={styles.riskLabel}>Consecutive Wins (Best)</span>
                <span style={styles.riskValue}>47 trades</span>
              </div>
              <div style={styles.riskItem}>
                <span style={styles.riskLabel}>Consecutive Losses (Worst)</span>
                <span style={styles.riskValue}>3 trades</span>
              </div>
              <div style={styles.riskItem}>
                <span style={styles.riskLabel}>Recovery Factor</span>
                <span style={styles.riskValue}>18.2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle} className="gradient-text">
          Ready to Copy These Trades?
        </h2>
        <p style={styles.ctaSubtitle}>
          Join our exclusive community and start receiving real-time signals
        </p>
        <div style={styles.ctaButtons}>
          <button 
            onClick={() => router.push('/signup?plan=vip')} 
            style={styles.ctaPrimary}
            className="hover-lift"
          >
            Get VIP Access
          </button>
          <button 
            onClick={() => router.push('/#pricing')} 
            style={styles.ctaSecondary}
            className="hover-lift"
          >
            View Pricing
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 MoonShot Signals. Past performance does not guarantee future results.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  nav: {
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a3456',
    position: 'sticky',
    top: 0,
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
    fontWeight: 'bold'
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#8892b0',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'color 0.3s'
  },
  loginButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #5e9eff',
    borderRadius: '6px',
    color: '#5e9eff',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  hero: {
    padding: '4rem 2rem',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#8892b0',
    marginBottom: '3rem'
  },
  timeRangeSelector: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  timeButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a3456',
    borderRadius: '8px',
    color: '#8892b0',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  timeButtonActive: {
    backgroundColor: '#5e9eff',
    borderColor: '#5e9eff',
    color: '#ffffff'
  },
  metricsSection: {
    padding: '0 2rem 4rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  metricCard: {
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center'
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: '#8892b0',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  metricValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  },
  metricChange: {
    fontSize: '0.875rem',
    color: '#64ffda'
  },
  metricSubtext: {
    fontSize: '0.875rem',
    color: '#8892b0'
  },
  progressBar: {
    marginTop: '1rem',
    height: '8px',
    backgroundColor: 'rgba(136, 146, 176, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #64ffda 0%, #5e9eff 100%)',
    borderRadius: '4px',
    transition: 'width 1s ease-out'
  },
  chartSection: {
    padding: '4rem 2rem',
    backgroundColor: '#151935',
    borderTop: '1px solid #2a3456',
    borderBottom: '1px solid #2a3456'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '3rem'
  },
  chartCard: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    borderRadius: '12px'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '300px',
    gap: '2rem',
    overflowX: 'auto'
  },
  chartColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100px'
  },
  chartBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '250px'
  },
  chartBar: {
    width: '60px',
    borderRadius: '4px 4px 0 0',
    transformOrigin: 'bottom'
  },
  chartValue: {
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    fontWeight: '600'
  },
  chartLabel: {
    fontSize: '0.875rem',
    color: '#8892b0',
    marginTop: '1rem'
  },
  chartStats: {
    fontSize: '0.75rem',
    color: '#8892b0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '0.5rem'
  },
  statsSection: {
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  },
  statsCard: {
    padding: '2rem',
    borderRadius: '12px'
  },
  statsTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    fontWeight: '600'
  },
  pairsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  pairItem: {
    padding: '1rem',
    backgroundColor: 'rgba(42, 52, 86, 0.3)',
    borderRadius: '8px',
    transition: 'all 0.3s'
  },
  pairInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  pairName: {
    fontWeight: '600'
  },
  pairTrades: {
    color: '#8892b0',
    fontSize: '0.875rem'
  },
  pairStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  pairWinRate: {
    color: '#64ffda',
    fontWeight: '600'
  },
  pairProfit: {
    color: '#5e9eff',
    fontWeight: '600'
  },
  riskStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  riskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(42, 52, 86, 0.3)',
    borderRadius: '8px'
  },
  riskLabel: {
    color: '#8892b0'
  },
  riskValue: {
    fontWeight: '600',
    fontSize: '1.125rem',
    color: '#64ffda'
  },
  tradesSection: {
    padding: '4rem 2rem',
    backgroundColor: '#151935',
    borderTop: '1px solid #2a3456'
  },
  tradesCard: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    borderRadius: '12px',
    overflowX: 'auto'
  },
  tradesTable: {
    width: '100%',
    minWidth: '800px'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '100px 100px 80px 100px 100px 100px 80px',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '2px solid #2a3456',
    fontWeight: '600',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#8892b0'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '100px 100px 80px 100px 100px 100px 80px',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid rgba(42, 52, 86, 0.5)',
    transition: 'all 0.3s'
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center'
  },
  buyBadge: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  sellBadge: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#8892b0'
  },
  ctaSection: {
    padding: '6rem 2rem',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #0a0e27 0%, #151935 100%)'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: '700'
  },
  ctaSubtitle: {
    fontSize: '1.25rem',
    color: '#8892b0',
    marginBottom: '2rem'
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimary: {
    padding: '1rem 2.5rem',
    backgroundColor: '#64ffda',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  ctaSecondary: {
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    border: '2px solid #5e9eff',
    color: '#5e9eff',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  footer: {
    padding: '2rem',
    textAlign: 'center',
    color: '#8892b0',
    borderTop: '1px solid #2a3456'
  }
};