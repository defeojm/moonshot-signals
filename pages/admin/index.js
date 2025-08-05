import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useWebSocket } from '../../hooks/useWebSocket';
import AdminChat from '../../components/AdminChat';
import config from '../../utils/config';
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [subscriptionStats, setSubscriptionStats] = useState({ activeCount: 0, mrr: 0 });
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [activeTab, setActiveTab] = useState('trades'); // New state for tabs
  const [members, setMembers] = useState([]);
  const [signals, setSignals] = useState([]);
  const [signalForm, setSignalForm] = useState({
    title: '',
    analysis: '',
    risk_management: '',
    stop_loss: '',
    take_profit: ''
  });
  const router = useRouter();

  const [showNotificationMenu, setShowNotificationMenu] = useState(null);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === 'new_trade') {
      console.log('New trade received:', message.data);
      fetchTrades();
      fetchStats();
    } else if (message.type === 'new_signal') {
      console.log('New signal published:', message.data);
      fetchStats();
      fetchSignals();
    } else if (message.type === 'new_chat_message') {
      console.log('New chat message:', message.data);
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`New message from ${message.data.user.email}`, {
          body: message.data.message,
          icon: '/favicon.ico'
        });
      }
    }
  }, []);

  const testEmailNotification = async (userId, notificationType) => {
    try {
      const response = await fetch(`${config.API_URL}/api/test-notifications/test-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: userId,
          type: notificationType 
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ ${result.message}\n\nCheck the user's email for the test notification.`);
      } else {
        alert(`❌ Error: ${result.error || 'Failed to send notification'}`);
      }
    } catch (error) {
      console.error('Error testing notification:', error);
      alert('Failed to send test notification. Check console for details.');
    }
  };
  // Connect to WebSocket
  const { isConnected, ws } = useWebSocket(handleWebSocketMessage);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
    fetchTrades();
    fetchStats();
    fetchSubscriptionStats();
    fetchMembers();
    fetchSignals();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchTrades();
      fetchStats();
      fetchSubscriptionStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTrades = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Fetching trades...');
    console.log('Token exists:', !!token);
    console.log('API URL:', config.API_URL);
    console.log('Full URL:', `${config.API_URL}/trades`);
    
    try {
      const response = await fetch(`${config.API_URL}/trades`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);
      console.log('Response URL:', response.url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Trades data received:', data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');
      
      if (Array.isArray(data)) {
        setTrades(data);
        console.log('✅ Trades set successfully');
      } else {
        console.error('Expected array of trades, got:', typeof data, data);
        setTrades([]);
      }
    } catch (error) {
      console.error('❌ Error fetching trades:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setTrades([]);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Fetching stats...');
    
    try {
      const response = await fetch(`${config.API_URL}/signals/performance/today`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Stats response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stats error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stats data:', data);
      setStats(data);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      // Set default stats on error
      setStats({
        total_signals: 0,
        total_pnl: 0,
        winning_trades: 0,
        losing_trades: 0,
        win_rate: 0,
        avg_rr: 0
      });
    }
  };

  const fetchSubscriptionStats = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Fetching subscription stats...');
    
    try {
      const response = await fetch(`${config.API_URL}/admin/subscription-stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Subscription stats response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Subscription stats:', data);
        setSubscriptionStats(data);
      } else {
        const errorText = await response.text();
        console.error('Subscription stats error:', errorText);
        setSubscriptionStats({ activeCount: 0, mrr: 0 });
      }
    } catch (error) {
      console.error('❌ Error fetching subscription stats:', error);
      setSubscriptionStats({ activeCount: 0, mrr: 0 });
    }
  };

  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Fetching members...');
    
    try {
      const response = await fetch(`${config.API_URL}/admin/members`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Members response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Members data:', data);
        console.log('Members count:', Array.isArray(data) ? data.length : 'Not an array');
        
        if (Array.isArray(data)) {
          setMembers(data);
        } else {
          console.error('Expected array of members, got:', typeof data);
          setMembers([]);
        }
      } else {
        const errorText = await response.text();
        console.error('Members error:', errorText);
        setMembers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching members:', error);
      setMembers([]);
    }
  };

  const fetchSignals = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Fetching signals...');
    
    try {
      const response = await fetch(`${config.API_URL}/api/signals/all`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Signals response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Signals data:', data);
        console.log('Signals count:', Array.isArray(data) ? data.length : 'Not an array');
        
        if (Array.isArray(data)) {
          setSignals(data);
        } else {
          console.error('Expected array of signals, got:', typeof data);
          setSignals([]);
        }
      } else {
        const errorText = await response.text();
        console.error('Signals error:', errorText);
        setSignals([]);
      }
    } catch (error) {
      console.error('❌ Error fetching signals:', error);
      setSignals([]);
    }
  };

  useEffect(() => {
    window.debugAPI = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('=== API Debug Info ===');
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'Missing');
      console.log('User:', user);
      console.log('Config API URL:', config.API_URL);
      console.log('Current URL:', window.location.href);
      
      // Test each endpoint
      const endpoints = [
        '/api/trades',
        '/api/signals/all',
        '/api/admin/members',
        '/api/admin/subscription-stats',
        '/api/signals/performance/today'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`\nTesting ${endpoint}...`);
          const response = await fetch(`${config.API_URL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`${endpoint} - Status:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`${endpoint} - Success:`, data);
          } else {
            const error = await response.text();
            console.log(`${endpoint} - Error:`, error);
          }
        } catch (error) {
          console.error(`${endpoint} - Failed:`, error.message);
        }
      }
    };
    
    console.log('💡 Debug function available: Run window.debugAPI() in console');
  }, []);

  const publishSignal = async () => {
    if (!selectedTrade) return;
    
    // Validate required fields
    if (!signalForm.title.trim() || !signalForm.analysis.trim()) {
      alert('Please fill in at least the title and analysis fields');
      return;
    }
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/api/signals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trade_id: selectedTrade.id,
          title: signalForm.title,
          analysis: signalForm.analysis,
          risk_management: signalForm.risk_management || '',
          stop_loss: signalForm.stop_loss || '',
          take_profit: signalForm.take_profit || ''
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Signal published successfully!');
        setSelectedTrade(null);
        setSignalForm({
          title: '',
          analysis: '',
          risk_management: '',
          stop_loss: '',
          take_profit: ''
        });
        fetchStats();
        fetchSignals();
      } else {
        alert(data.error || 'Failed to publish signal');
      }
    } catch (error) {
      console.error('Error publishing signal:', error);
      alert('Failed to publish signal');
    }
  };

  const handleCreateTrade = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tradeData = {
      okx_order_id: 'MANUAL_' + Date.now(),
      symbol: formData.get('symbol'),
      direction: formData.get('direction'),
      entry_price: parseFloat(formData.get('entry_price')),
      size: parseFloat(formData.get('size')),
      leverage: parseInt(formData.get('leverage')) || 1,
      status: 'OPEN',
      opened_at: new Date()
    };

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/trades`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tradeData)
      });
      
      if (response.ok) {
        alert('Trade created successfully!');
        e.target.reset();
        fetchTrades();
      }
    } catch (error) {
      console.error('Error creating trade:', error);
    }
  };
  const activateSubscription = async (userId, plan) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/admin/members/${userId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan })
      });
      
      if (response.ok) {
        alert('Subscription activated successfully!');
        fetchMembers(); // Refresh the member list
        fetchSubscriptionStats(); // Update stats
      } else {
        alert('Failed to activate subscription');
      }
    } catch (error) {
      console.error('Error activating subscription:', error);
      alert('Error activating subscription');
    }
  };
  const closeTrade = async (tradeId, exitPrice) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${config.API_URL}/trades/${tradeId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ exit_price: exitPrice })
      });
      
      if (response.ok) {
        alert('Trade closed successfully!');
        fetchTrades();
        fetchStats();
      }
    } catch (error) {
      console.error('Error closing trade:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>MoonShot Admin</div>
        <div style={styles.headerRight}>
          <span>Welcome, {user.email}</span>
          {isConnected && <span style={styles.wsStatus}>🟢 Live</span>}
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{subscriptionStats.activeCount || 0}</div>
          <div style={styles.statLabel}>Active Members</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>${subscriptionStats.mrr || 0}</div>
          <div style={styles.statLabel}>MRR</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{stats?.win_rate || 0}%</div>
          <div style={styles.statLabel}>Win Rate (7d)</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>${stats?.total_pnl?.toFixed(2) || '0.00'}</div>
          <div style={styles.statLabel}>Today&apos;s P&L</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        <button 
          style={{...styles.tabButton, ...(activeTab === 'trades' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('trades')}
        >
          Trading Desk
        </button>
        <button 
          style={{...styles.tabButton, ...(activeTab === 'signals' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('signals')}
        >
          Signal History
        </button>
        <button 
          style={{...styles.tabButton, ...(activeTab === 'members' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          style={{...styles.tabButton, ...(activeTab === 'analytics' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          style={{...styles.tabButton, ...(activeTab === 'chat' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('chat')}
        >
          VIP Chat
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {activeTab === 'trades' && (
          <div style={styles.tradesLayout}>
            {/* Left Column - Trade Feed */}
            <div style={styles.tradeFeed}>
              <div style={styles.feedHeader}>
                <h2>Live Trade Feed</h2>
                <span style={styles.tradeCount}>{Array.isArray(trades) ? trades.filter(t => t.status === 'OPEN').length : 0} Open</span>
              </div>
              
              {Array.isArray(trades) && trades.map(trade => (
                <div 
                  key={trade.id} 
                  style={{
                    ...styles.tradeCard, 
                    ...(selectedTrade?.id === trade.id ? styles.selectedCard : {}),
                    ...(trade.status === 'OPEN' ? styles.openTrade : {})
                  }}
                  onClick={() => setSelectedTrade(trade)}
                >
                  <div style={styles.tradeHeader}>
                    <span style={{...styles.direction, ...(trade.direction === 'BUY' ? styles.buy : styles.sell)}}>
                      {trade.direction}
                    </span>
                    <span style={styles.tradePair}>{trade.symbol}</span>
                    <span style={{...styles.status, ...(trade.status === 'OPEN' ? styles.openStatus : styles.closedStatus)}}>
                      {trade.status}
                    </span>
                  </div>
                  
                  <div style={styles.tradeDetails}>
                    <div style={styles.tradeDetailRow}>
                      <span>Entry: ${trade.entry_price}</span>
                      {trade.exit_price && <span>Exit: ${trade.exit_price}</span>}
                    </div>
                    <div style={styles.tradeDetailRow}>
                      <span>Size: {trade.size}</span>
                      <span>Leverage: {trade.leverage}x</span>
                    </div>
                    {trade.pnl && (
                      <div style={styles.tradePnl}>
                        <span style={{color: parseFloat(trade.pnl) > 0 ? '#64ffda' : '#ff5e5e'}}>
                          P&L: ${parseFloat(trade.pnl).toFixed(2)} ({((parseFloat(trade.pnl) / (parseFloat(trade.entry_price) * parseFloat(trade.size))) * 100).toFixed(2)}%)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {trade.status === 'OPEN' && (
                    <div style={styles.tradeActions}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const exitPrice = prompt('Enter exit price:');
                          if (exitPrice) closeTrade(trade.id, parseFloat(exitPrice));
                        }}
                        style={styles.closeTradeBtn}
                      >
                        Close Trade
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div style={styles.rightColumn}>
              {/* Signal Editor */}
              <div style={styles.signalEditor}>
                <h3>Signal Editor</h3>
                {selectedTrade ? (
                  <div>
                    <div style={styles.selectedInfo}>
                      <strong>Selected Trade:</strong>
                      <br />
                      {selectedTrade.symbol} {selectedTrade.direction} @ ${selectedTrade.entry_price}
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Signal Title (e.g., BTC Long - 4H Support Bounce)"
                      value={signalForm.title}
                      onChange={(e) => setSignalForm({...signalForm, title: e.target.value})}
                      style={styles.input}
                    />
                    
                    <textarea
                      placeholder="Analysis & Setup Explanation..."
                      value={signalForm.analysis}
                      onChange={(e) => setSignalForm({...signalForm, analysis: e.target.value})}
                      style={styles.textarea}
                      rows={6}
                    />
                    
                    <input
                      type="text"
                      placeholder="Risk Management Notes"
                      value={signalForm.risk_management}
                      onChange={(e) => setSignalForm({...signalForm, risk_management: e.target.value})}
                      style={styles.input}
                    />
                    
                    <div style={styles.priceInputs}>
                      <input
                        type="number"
                        placeholder="Stop Loss"
                        value={signalForm.stop_loss}
                        onChange={(e) => setSignalForm({...signalForm, stop_loss: e.target.value})}
                        style={styles.input}
                      />
                      <input
                        type="number"
                        placeholder="Take Profit"
                        value={signalForm.take_profit}
                        onChange={(e) => setSignalForm({...signalForm, take_profit: e.target.value})}
                        style={styles.input}
                      />
                    </div>
                    
                    <button onClick={publishSignal} style={styles.publishBtn}>
                      Publish Signal to Members
                    </button>
                  </div>
                ) : (
                  <p style={styles.noSelection}>Select a trade to create a signal</p>
                )}
              </div>

              {/* Quick Trade Creator */}
              <div style={styles.tradeCreator}>
                <h3>Quick Trade Entry</h3>
                <form onSubmit={handleCreateTrade}>
                  <select name="symbol" style={styles.input} required defaultValue="">
                    <option value="" disabled>Select Symbol</option>
                    <option value="BTC-USDT">BTC-USDT</option>
                    <option value="ETH-USDT">ETH-USDT</option>
                    <option value="SOL-USDT">SOL-USDT</option>
                  </select>
                  
                  <select name="direction" style={styles.input} required defaultValue="">
                    <option value="" disabled>Direction</option>
                    <option value="BUY">BUY/LONG</option>
                    <option value="SELL">SELL/SHORT</option>
                  </select>
                  
                  <input
                    type="number"
                    name="entry_price"
                    placeholder="Entry Price"
                    step="0.01"
                    style={styles.input}
                    required
                  />
                  
                  <div style={styles.priceInputs}>
                    <input
                      type="number"
                      name="size"
                      placeholder="Size"
                      step="0.01"
                      style={styles.input}
                      required
                    />
                    <input
                      type="number"
                      name="leverage"
                      placeholder="Leverage"
                      style={styles.input}
                      defaultValue="1"
                    />
                  </div>
                  
                  <button type="submit" style={styles.createTradeBtn}>
                    Create Trade
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div style={styles.signalsTab}>
            <h2>Published Signals</h2>
            <div style={styles.signalsGrid}>
              {signals.map(signal => (
                <div key={signal.id} style={styles.signalCard}>
                  <h4>{signal.title}</h4>
                  <p style={styles.signalMeta}>
                    {signal.Trade?.symbol} • {new Date(signal.createdAt).toLocaleString()}
                  </p>
                  <p style={styles.signalAnalysis}>{signal.analysis}</p>
                  {signal.Trade && (
                    <div style={styles.signalStats}>
                      <span>Entry: ${signal.Trade.entry_price}</span>
                      {signal.Trade.exit_price && <span>Exit: ${signal.Trade.exit_price}</span>}
                      {signal.Trade.pnl && (
                        <span style={{color: parseFloat(signal.Trade.pnl) > 0 ? '#64ffda' : '#ff5e5e'}}>
                          P&L: ${parseFloat(signal.Trade.pnl).toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div style={styles.membersTab}>
            <h2>Member Management</h2>
            <div style={styles.membersTable}>
              <div style={styles.tableHeader}>
                <span>Email</span>
                <span>Plan</span>
                <span>Status</span>
                <span>Joined</span>
                <span>Actions</span>
              </div>
              {members.map(member => (
                <div key={member.id} style={styles.memberRow}>
                  <span>{member.email}</span>
                  <span style={styles.planBadge}>{member.Subscription?.plan || 'No Plan'}</span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: member.Subscription?.status === 'active' ? 'rgba(100, 255, 218, 0.2)' : 'rgba(255, 94, 94, 0.2)',
                    color: member.Subscription?.status === 'active' ? '#64ffda' : '#ff5e5e',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: member.Subscription?.status === 'active' ? 'rgba(100, 255, 218, 0.3)' : 'rgba(255, 94, 94, 0.3)'
                  }}>
                    {member.Subscription?.status || 'Inactive'}
                  </span>
                  <span>{new Date(member.createdAt).toLocaleDateString()}</span>
                  <span style={styles.actionButtons}>
                    {(!member.Subscription || member.Subscription.status !== 'active') && (
                      <button 
                        style={styles.activateBtn}
                        onClick={() => activateSubscription(member.id, 'vip')}
                      >
                        Activate VIP
                      </button>
                    )}
                    <button style={styles.actionBtn}>View Details</button>
                    
                    {/* Notification Test Dropdown */}
                    <div style={styles.dropdownContainer}>
                      <button 
                        style={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotificationMenu(showNotificationMenu === member.id ? null : member.id);
                        }}
                      >
                        Test Notify ▼
                      </button>
                      
                      {showNotificationMenu === member.id && (
                        <div style={styles.dropdownMenu}>
                          <button 
                            style={styles.dropdownItem}
                            className="dropdown-item"
                            onClick={() => {
                              testEmailNotification(member.id, 'general');
                              setShowNotificationMenu(null);
                            }}
                          >
                            📧 Test Email
                          </button>
                          <button 
                            style={styles.dropdownItem}
                            className="dropdown-item"
                            onClick={() => {
                              testEmailNotification(member.id, 'trade_alert');
                              setShowNotificationMenu(null);
                            }}
                          >
                            📊 Test Trade Alert
                          </button>
                          <button 
                            style={styles.dropdownItem}
                            className="dropdown-item"
                            onClick={() => {
                              testEmailNotification(member.id, 'daily_report');
                              setShowNotificationMenu(null);
                            }}
                          >
                            📈 Test Daily Report
                          </button>
                          <button 
                            style={styles.dropdownItem}
                            className="dropdown-item"
                            onClick={() => {
                              testEmailNotification(member.id, 'price_alert');
                              setShowNotificationMenu(null);
                            }}
                          >
                            💰 Test Price Alert
                          </button>
                        </div>
                      )}
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={styles.analyticsTab}>
            <h2>Performance Analytics</h2>
            <div style={styles.analyticsGrid}>
              <div style={styles.analyticsCard}>
                <h3>Monthly Performance</h3>
                <div style={styles.bigStat}>
                  <span style={styles.bigStatValue}>${(stats?.total_pnl * 30)?.toFixed(0) || '0'}</span>
                  <span style={styles.bigStatLabel}>Projected Monthly P&L</span>
                </div>
              </div>
              
              <div style={styles.analyticsCard}>
                <h3>Trading Stats</h3>
                <div style={styles.statsList}>
                  <div style={styles.statsRow}>
                    <span>Total Trades:</span>
                    <span>{trades.length}</span>
                  </div>
                  <div style={styles.statsRow}>
                    <span>Open Positions:</span>
                    <span>{trades.filter(t => t.status === 'OPEN').length}</span>
                  </div>
                  <div style={styles.statsRow}>
                    <span>Avg Win:</span>
                    <span style={{color: '#64ffda'}}>
                      ${(trades.filter(t => parseFloat(t.pnl) > 0).reduce((acc, t) => acc + parseFloat(t.pnl), 0) / trades.filter(t => parseFloat(t.pnl) > 0).length || 0).toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.statsRow}>
                    <span>Avg Loss:</span>
                    <span style={{color: '#ff5e5e'}}>
                      ${(trades.filter(t => parseFloat(t.pnl) < 0).reduce((acc, t) => acc + parseFloat(t.pnl), 0) / trades.filter(t => parseFloat(t.pnl) < 0).length || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={styles.analyticsCard}>
                <h3>Member Engagement</h3>
                <div style={styles.statsList}>
                  <div style={styles.statsRow}>
                    <span>Total Members:</span>
                    <span>{members.length}</span>
                  </div>
                  <div style={styles.statsRow}>
                    <span>Active Subscriptions:</span>
                    <span>{subscriptionStats.activeCount}</span>
                  </div>
                  <div style={styles.statsRow}>
                    <span>Churn Rate:</span>
                    <span>{((1 - subscriptionStats.activeCount / members.length) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={styles.chatTab}>
            <h2>VIP Member Support Chat</h2>
            <AdminChat 
              token={localStorage.getItem('token')} 
              ws={ws}
            />
          </div>
        )}
      </div>
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
  chatTab: {
    padding: '2rem'
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
  headerRight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  wsStatus: {
    color: '#64ffda',
    fontSize: '0.875rem'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #5e9eff',
    borderRadius: '6px',
    color: '#5e9eff',
    cursor: 'pointer'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    padding: '2rem',
    backgroundColor: '#151935',
    borderBottom: '1px solid #2a3456'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#64ffda'
  },
  statLabel: {
    color: '#8892b0',
    fontSize: '0.875rem'
  },
  tabNav: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 2rem',
    backgroundColor: '#151935',
    borderBottom: '1px solid #2a3456'
  },
  tabButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '6px',
    color: '#8892b0',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  activeTab: {
    backgroundColor: '#1e2444',
    borderColor: '#5e9eff',
    color: '#ffffff'
  },
  content: {
    padding: '2rem'
  },
  tradesLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  tradeFeed: {
    backgroundColor: '#151935',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  feedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  tradeCount: {
    backgroundColor: '#1e2444',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    color: '#64ffda'
  },
  tradeCard: {
    backgroundColor: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.3s'
  },
  selectedCard: {
    borderColor: '#5e9eff'
  },
  openTrade: {
    borderLeft: '4px solid #64ffda'
  },

  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  activateBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tradeHeader: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  direction: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 'bold'
  },
  buy: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    color: '#64ffda'
  },
  sell: {
    backgroundColor: 'rgba(255, 94, 94, 0.2)',
    color: '#ff5e5e'
  },
  tradePair: {
    fontSize: '1.125rem',
    fontWeight: '600'
  },
  status: {
    marginLeft: 'auto',
    fontSize: '0.875rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px'
  },
  openStatus: {
    backgroundColor: 'rgba(94, 158, 255, 0.2)',
    color: '#5e9eff'
  },
  closedStatus: {
    backgroundColor: 'rgba(136, 146, 176, 0.2)',
    color: '#8892b0'
  },
  tradeDetails: {
    fontSize: '0.875rem',
    color: '#8892b0'
  },
  tradeDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.25rem'
  },
  tradePnl: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #2a3456'
  },
  tradeActions: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem'
  },
  closeTradeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff5e5e',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  signalEditor: {
    backgroundColor: '#151935',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #2a3456'
  },
  selectedInfo: {
    backgroundColor: '#1e2444',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    color: '#64ffda',
    fontSize: '0.875rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    marginBottom: '0.75rem'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    marginBottom: '0.75rem',
    resize: 'vertical'
  },
  priceInputs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem'
  },
  publishBtn: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  noSelection: {
    textAlign: 'center',
    color: '#8892b0',
    padding: '3rem'
  },
  tradeCreator: {
    backgroundColor: '#151935',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #2a3456'
  },
  createTradeBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#5e9eff',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer'
  },
  signalsTab: {
    backgroundColor: '#151935',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #2a3456'
  },
  signalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  signalCard: {
    backgroundColor: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #2a3456'
  },
  signalMeta: {
    color: '#8892b0',
    fontSize: '0.875rem',
    marginBottom: '0.75rem'
  },
  signalAnalysis: {
    color: '#ffffff',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  signalStats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#8892b0'
  },
  membersTab: {
    backgroundColor: '#151935',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #2a3456'
  },
  membersTable: {
    marginTop: '1.5rem'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#1e2444',
    borderRadius: '6px',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  memberRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#1e2444',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    alignItems: 'center'
  },
  planBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(94, 158, 255, 0.2)',
    color: '#5e9eff',
    borderRadius: '20px',
    fontSize: '0.875rem',
    textAlign: 'center'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    textAlign: 'center'
  },
  actionBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  analyticsTab: {
    backgroundColor: '#151935',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #2a3456'
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  },
  analyticsCard: {
    backgroundColor: '#1e2444',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #2a3456'
  },
  bigStat: {
    textAlign: 'center',
    padding: '2rem 0'
  },
  bigStatValue: {
    display: 'block',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: '0.5rem'
  },
  bigStatLabel: {
    color: '#8892b0',
    fontSize: '1rem'
  },
  statsList: {
    marginTop: '1rem'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #2a3456'
  },
  dropdownContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    minWidth: '180px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 1000,
    marginTop: '4px'
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background 0.2s',
    borderBottom: '1px solid #2a3456'
  },
};