import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useWebSocket } from '../hooks/useWebSocket';
import UserSettings from '../components/UserSettings';
import ChatWidget from '../components/ChatWidget';
import config from '../utils/config';
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState({
    todayPnl: 0,
    weekPnl: 0,
    activeSignals: 0
  });
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);

  // WebSocket message handler - moved before useWebSocket
  const handleWebSocketMessage = useCallback((message) => {
    console.log('Dashboard received WebSocket message:', message);
    
    if (message.type === 'new_signal') {
      console.log('🚀 New signal received:', message.data);
      
      // Add the new signal to the top of the list
      setSignals(prevSignals => {
        // Check if signal already exists to avoid duplicates
        const exists = prevSignals.some(s => s.id === message.data.id);
        if (exists) return prevSignals;
        
        return [message.data, ...prevSignals];
      });
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Trading Signal!', {
          body: `${message.data.Trade?.symbol} ${message.data.Trade?.direction}`,
          icon: '/favicon.ico'
        });
      }
      
      // Also refresh all signals to ensure consistency
      fetchSignals();
    } else if (message.type === 'connected') {
      console.log('✅ WebSocket connection confirmed:', message.message);
    }
  }, []);

  // Connect to WebSocket
  const { isConnected, ws } = useWebSocket(handleWebSocketMessage);

  // Move fetchSignals outside of useEffect so it can be called from handleWebSocketMessage
  const fetchSignals = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      console.log('Fetching signals...');
      const response = await fetch(`${config.API_URL}/signals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        
        // Check if it's a subscription error
        if (response.status === 403 && errorData.requiresPayment) {
          console.log('Subscription required, redirecting to checkout...');
          router.push('/checkout');
          return;
        }
        
        setSignals([]);
        return;
      }
      
      const data = await response.json();
      console.log('Signals response:', data);
      
      // Handle both array and object response formats
      let signalsArray;
      if (Array.isArray(data)) {
        signalsArray = data;
      } else if (data.signals && Array.isArray(data.signals)) {
        signalsArray = data.signals;
      } else {
        console.error('Unexpected data format:', data);
        setSignals([]);
        return;
      }
      
      setSignals(signalsArray);
      
      // Calculate stats
      if (signalsArray.length > 0) {
        const today = new Date().setHours(0,0,0,0);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        let todayPnl = 0;
        let weekPnl = 0;
        let activeCount = 0;
        
        signalsArray.forEach(signal => {
          if (!signal.Trade) return;
          
          const signalDate = new Date(signal.createdAt).setHours(0,0,0,0);
          const pnl = parseFloat(signal.Trade.pnl || 0);
          
          if (signal.Trade.status === 'OPEN') activeCount++;
          if (signalDate === today) todayPnl += pnl;
          if (new Date(signal.createdAt) >= weekAgo) weekPnl += pnl;
        });
        
        setStats({
          todayPnl,
          weekPnl,
          activeSignals: activeCount
        });
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
      setSignals([]);
    }
  }, [router]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // If admin, redirect to admin dashboard
    if (parsedUser.role === 'admin') {
      router.push('/admin');
      return;
    }
    
    fetchSignals();
  }, [fetchSignals, router]);

  // Log WebSocket connection status changes
  useEffect(() => {
    console.log('WebSocket connection status:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  const handleManageSubscription = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/create-portal-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        alert('Unable to open subscription management');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to open subscription management');
    }
  };

  const copyToClipboard = (signal) => {
    if (!signal.Trade) return;
    
    const text = `
${signal.Trade.symbol} ${signal.Trade.direction}
Entry: $${signal.Trade.entry_price}
SL: $${signal.stop_loss || 'N/A'}
TP: $${signal.take_profit || 'N/A'}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Trade details copied!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>MoonShot Signals</div>
        <nav style={styles.nav}>
          <a 
            href="#" 
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              // Scroll to signals or do nothing since we're already on Live Signals
            }}
          >
            Live Signals
          </a>
          <a 
            href="#" 
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              setShowPerformance(true);
            }}
          >
            Performance
          </a>
          <a 
            href="#" 
            style={styles.navLink} 
            onClick={(e) => {
              e.preventDefault(); 
              setShowSettings(true);
            }}
          > 
            Settings 
          </a>
        </nav>
        <div style={styles.headerRight}>
          <span>{user.email}</span>
          <button onClick={handleManageSubscription} style={styles.manageBtn}>
            Manage Subscription
          </button>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={styles.mainGrid}>
        {/* Performance Summary */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Your Performance</h3>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Today&apos;s P&L</div>
            <div style={{...styles.statValue, color: stats.todayPnl >= 0 ? '#64ffda' : '#ff5e5e'}}>
              ${stats.todayPnl.toFixed(2)}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Week P&L</div>
            <div style={{...styles.statValue, color: stats.weekPnl >= 0 ? '#64ffda' : '#ff5e5e'}}>
              ${stats.weekPnl.toFixed(2)}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Trades</div>
            <div style={styles.statValue}>{stats.activeSignals}</div>
          </div>
        </aside>

        {/* Signal Feed */}
        <main style={styles.signalFeed}>
          <div style={styles.feedHeader}>
            <h2 style={styles.feedTitle}>Trading Signals</h2>
            <div style={styles.liveIndicator}>
              <span style={styles.liveDot}></span>
              <span>{isConnected ? 'Live' : 'Connecting...'}</span>
            </div>
          </div>

          {!Array.isArray(signals) || signals.length === 0 ? (
            <p style={styles.noSignals}>No signals yet. Check back soon!</p>
          ) : (
            signals.map(signal => {
              // Skip if no trade data
              if (!signal.Trade) return null;
              
              return (
                <div key={signal.id} style={styles.signalCard}>
                  <div style={styles.signalHeader}>
                    <div style={styles.signalInfo}>
                      <span style={{
                        ...styles.direction,
                        ...(signal.Trade.direction === 'BUY' || signal.Trade.direction === 'LONG' ? styles.long : styles.short)
                      }}>
                        {signal.Trade.direction}
                      </span>
                      <span style={styles.pair}>{signal.Trade.symbol}</span>
                    </div>
                    <span style={styles.time}>
                      {new Date(signal.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 style={styles.signalTitle}>{signal.title}</h3>

                  <div style={styles.priceGrid}>
                    <div style={styles.priceItem}>
                      <span style={styles.priceLabel}>Entry Price</span>
                      <span style={styles.priceValue}>${signal.Trade.entry_price}</span>
                    </div>
                    <div style={styles.priceItem}>
                      <span style={styles.priceLabel}>Stop Loss</span>
                      <span style={styles.priceValue}>${signal.stop_loss || 'N/A'}</span>
                    </div>
                    <div style={styles.priceItem}>
                      <span style={styles.priceLabel}>Take Profit</span>
                      <span style={styles.priceValue}>${signal.take_profit || 'N/A'}</span>
                    </div>
                    <div style={styles.priceItem}>
                      <span style={styles.priceLabel}>Status</span>
                      <span style={styles.priceValue}>{signal.Trade.status}</span>
                    </div>
                  </div>

                  <div style={styles.analysis}>
                    <strong>Analysis:</strong> {signal.analysis}
                  </div>

                  {signal.risk_management && (
                    <div style={styles.riskManagement}>
                      <strong>Risk Management:</strong> {signal.risk_management}
                    </div>
                  )}

                  <div style={styles.signalFooter}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(signal.Trade.status === 'OPEN' ? styles.active : 
                          signal.Trade.pnl > 0 ? styles.profit : styles.loss)
                    }}>
                      {signal.Trade.status === 'OPEN' ? 'ACTIVE' : 
                       signal.Trade.pnl > 0 ? `PROFIT +$${signal.Trade.pnl}` : 
                       `LOSS -$${Math.abs(signal.Trade.pnl)}`}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(signal)} 
                      style={styles.copyBtn}
                    >
                      Copy Trade Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <UserSettings 
          user={user}
          token={localStorage.getItem('token')}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Performance Modal */}
      {showPerformance && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Performance History</h2>
              <button 
                onClick={() => setShowPerformance(false)} 
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.performanceStats}>
                <div style={styles.perfStatCard}>
                  <h3>Monthly Performance</h3>
                  <div style={styles.perfValue}>+${(stats.weekPnl * 4).toFixed(2)}</div>
                  <div style={styles.perfLabel}>Estimated Monthly P&L</div>
                </div>
                <div style={styles.perfStatCard}>
                  <h3>Total Signals</h3>
                  <div style={styles.perfValue}>{signals.length}</div>
                  <div style={styles.perfLabel}>Signals Received</div>
                </div>
                <div style={styles.perfStatCard}>
                  <h3>Win Rate</h3>
                  <div style={styles.perfValue}>
                    {signals.length > 0 
                      ? `${((signals.filter(s => s.Trade?.pnl > 0).length / signals.length) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                  <div style={styles.perfLabel}>Success Rate</div>
                </div>
              </div>
              <div style={styles.chartPlaceholder}>
                <p>Detailed performance charts coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {user && (
        <ChatWidget 
          user={user} 
          token={localStorage.getItem('token')}
          ws={ws}
        />
      )}
    </div>
  );
}

// Styles remain the same
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#ffffff'
  },
  
  header: {
    backgroundColor: '#151935',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #2a3456'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#64ffda'
  },
  nav: {
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    color: '#8892b0',
    textDecoration: 'none',
    transition: 'color 0.3s'
  },
    manageBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #64ffda',
    borderRadius: '6px',
    color: '#64ffda',
    cursor: 'pointer',
    marginRight: '1rem'
  },
  headerRight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #5e9eff',
    borderRadius: '6px',
    color: '#5e9eff',
    cursor: 'pointer'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  sidebar: {
    backgroundColor: '#151935',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    height: 'fit-content'
  },
  sidebarTitle: {
    marginBottom: '1.5rem',
    fontSize: '1.125rem'
  },
  statCard: {
    backgroundColor: '#1e2444',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#8892b0',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#64ffda'
  },
  signalFeed: {
    backgroundColor: '#151935',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #2a3456'
  },
  feedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  feedTitle: {
    fontSize: '1.25rem'
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64ffda'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#64ffda',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },
  noSignals: {
    textAlign: 'center',
    color: '#8892b0',
    padding: '3rem'
  },
  signalCard: {
    backgroundColor: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #2a3456'
  },
  signalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  signalInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  direction: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '0.875rem'
  },
  long: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda'
  },
  short: {
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e'
  },
  pair: {
    fontSize: '1.125rem',
    fontWeight: '600'
  },
  time: {
    fontSize: '0.75rem',
    color: '#8892b0'
  },
  signalTitle: {
    color: '#5e9eff',
    marginBottom: '1rem'
  },
  priceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    backgroundColor: '#151935',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem'
  },
  priceItem: {
    textAlign: 'center'
  },
  priceLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#8892b0',
    marginBottom: '0.25rem'
  },
  priceValue: {
    fontSize: '1rem',
    fontWeight: '600'
  },
  analysis: {
    color: '#8892b0',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  riskManagement: {
    color: '#8892b0',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  signalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #2a3456'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  active: {
    backgroundColor: 'rgba(94, 158, 255, 0.2)',
    color: '#5e9eff'
  },
  profit: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda'
  },
  loss: {
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e'
  },
  copyBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: '#151935',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #2a3456'
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #2a3456',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#8892b0',
    cursor: 'pointer'
  },
  modalContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem'
  },
  performanceStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  perfStatCard: {
    backgroundColor: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #2a3456'
  },
  perfValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#64ffda',
    margin: '0.5rem 0'
  },
  perfLabel: {
    color: '#8892b0',
    fontSize: '0.875rem'
  },
  chartPlaceholder: {
    backgroundColor: '#1e2444',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#8892b0',
    border: '1px solid #2a3456'
  }
};