import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          color: 'white', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>Application Error</h1>
          <p style={{ marginBottom: '10px', color: '#fbbf24' }}>{this.state.error?.message || 'Unknown error'}</p>
          {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
            <pre style={{ 
              background: '#1f2937', 
              padding: '15px', 
              borderRadius: '5px', 
              overflow: 'auto', 
              maxWidth: '90%',
              fontSize: '12px',
              textAlign: 'left'
            }}>
              {this.state.error.stack}
            </pre>
          )}
          <button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{ 
              marginTop: '20px', 
              padding: '12px 24px', 
              background: '#8b5cf6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
