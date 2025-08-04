// frontend/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can also log to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e27',
          color: '#ffffff',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            color: '#ff5e5e' 
          }}>
            Oops! Something went wrong
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            marginBottom: '2rem',
            color: '#8892b0' 
          }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          
          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: '2rem', 
              padding: '1rem',
              backgroundColor: '#151935',
              borderRadius: '8px',
              border: '1px solid #2a3456',
              maxWidth: '800px',
              width: '100%',
              textAlign: 'left'
            }}>
              <summary style={{ 
                cursor: 'pointer',
                marginBottom: '1rem',
                color: '#64ffda'
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                overflow: 'auto',
                fontSize: '0.875rem',
                color: '#ff5e5e'
              }}>
                {this.state.error && this.state.error.toString()}
              </pre>
              <pre style={{ 
                overflow: 'auto',
                fontSize: '0.875rem',
                marginTop: '1rem',
                color: '#8892b0'
              }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              backgroundColor: '#5e9eff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Refresh Page
          </button>
          
          <a
            href="/"
            style={{
              marginTop: '1rem',
              color: '#64ffda',
              textDecoration: 'none'
            }}
          >
            Go to Homepage
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;