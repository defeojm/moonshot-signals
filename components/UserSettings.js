import { useState, useEffect } from 'react';
import config from '../utils/config';

export default function UserSettings({ user, token, onClose }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    tradeAlerts: true,
    priceAlerts: false,
    dailyReport: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user settings
  useEffect(() => {
    fetchSettings();
  }, []);

  // Add styles when component mounts (client-side only)
  useEffect(() => {
    const styleId = 'user-settings-styles';
    
    // Check if styles already exist
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.textContent = `
        .user-settings-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .user-settings-switch input:checked + span {
          background-color: #64ffda;
        }
        
        .user-settings-switch input:checked + span:before {
          transform: translateX(26px);
        }
        
        .user-settings-switch span:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Cleanup function to remove styles when component unmounts
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/settings/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings({
          emailNotifications: data.email_notifications,
          tradeAlerts: data.trade_alerts,
          priceAlerts: data.price_alerts,
          dailyReport: data.daily_report
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    setIsLoading(false);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${config.API_URL}/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_notifications: settings.emailNotifications,
          trade_alerts: settings.tradeAlerts,
          price_alerts: settings.priceAlerts,
          daily_report: settings.dailyReport
        })
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
    setIsSaving(false);
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Settings</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Account Information</h3>
            <div style={styles.infoRow}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{user.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Member Since:</span>
              <span style={styles.value}>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Subscription:</span>
              <span style={styles.value}>VIP Active</span>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Notification Preferences</h3>
            
            <div style={styles.settingRow}>
              <div>
                <div style={styles.settingTitle}>Email Notifications</div>
                <div style={styles.settingDescription}>Receive important updates via email</div>
              </div>
              <label className="user-settings-switch" style={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span style={styles.slider}></span>
              </label>
            </div>

            <div style={styles.settingRow}>
              <div>
                <div style={styles.settingTitle}>Trade Alerts</div>
                <div style={styles.settingDescription}>Get notified for new trading signals</div>
              </div>
              <label className="user-settings-switch" style={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.tradeAlerts}
                  onChange={() => handleToggle('tradeAlerts')}
                />
                <span style={styles.slider}></span>
              </label>
            </div>

            <div style={styles.settingRow}>
              <div>
                <div style={styles.settingTitle}>Price Alerts</div>
                <div style={styles.settingDescription}>Notifications for significant price movements</div>
              </div>
              <label className="user-settings-switch" style={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.priceAlerts}
                  onChange={() => handleToggle('priceAlerts')}
                />
                <span style={styles.slider}></span>
              </label>
            </div>

            <div style={styles.settingRow}>
              <div>
                <div style={styles.settingTitle}>Daily Report</div>
                <div style={styles.settingDescription}>Receive daily performance summary</div>
              </div>
              <label className="user-settings-switch" style={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.dailyReport}
                  onChange={() => handleToggle('dailyReport')}
                />
                <span style={styles.slider}></span>
              </label>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Security</h3>
            <button style={styles.secondaryButton}>Change Password</button>
            <button style={styles.secondaryButton}>Enable Two-Factor Authentication</button>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={saveSettings} style={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #2a3456'
  },
  header: {
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
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.125rem',
    marginBottom: '1rem',
    color: '#64ffda'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #2a3456'
  },
  label: {
    color: '#8892b0'
  },
  value: {
    color: '#ffffff'
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #2a3456'
  },
  settingTitle: {
    fontSize: '1rem',
    marginBottom: '0.25rem'
  },
  settingDescription: {
    fontSize: '0.875rem',
    color: '#8892b0'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px'
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2a3456',
    transition: '0.4s',
    borderRadius: '24px'
  },
  secondaryButton: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid #2a3456',
    textAlign: 'right'
  },
  saveButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#64ffda',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e27',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.3s'
  }
};